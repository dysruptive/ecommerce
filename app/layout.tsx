import type { Metadata } from "next";
import { Geist_Mono, Nunito_Sans } from "next/font/google"
import { headers } from "next/headers";

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/db";

const nunitoSans = Nunito_Sans({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const defaultMetadata: Metadata = {
  title: {
    default: "Multi-Tenant Ecommerce Platform",
    template: "%s | Store",
  },
  description: "Powering 10 online stores across Ghana.",
};

export async function generateMetadata(): Promise<Metadata> {
  const hdrs = await headers();
  const slug = hdrs.get("x-tenant-slug");
  const lookupType = hdrs.get("x-tenant-lookup-type") as "slug" | "domain" | null;

  if (!slug || !lookupType) return defaultMetadata;

  const tenant = await prisma.tenant.findUnique({
    where: lookupType === "slug" ? { slug } : { customDomain: slug },
    select: { name: true, faviconUrl: true },
  });

  if (!tenant) return defaultMetadata;

  return {
    title: {
      default: tenant.name,
      template: `%s | ${tenant.name}`,
    },
    icons: tenant.faviconUrl ? { icon: tenant.faviconUrl } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", nunitoSans.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster theme="light" position="bottom-right" richColors />
      </body>
    </html>
  )
}
