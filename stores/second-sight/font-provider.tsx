import { Noto_Serif, Manrope } from "next/font/google";
import { cn } from "@/lib/utils";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  weight: ["400", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export function SecondSightFontProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn(notoSerif.variable, manrope.variable)}>
      {children}
    </div>
  );
}
