import Link from "next/link";
import { Mail, Phone } from "lucide-react";

interface FooterProps {
  storeName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
}

export function StyleHubFooter({ storeName, contactEmail, contactPhone }: FooterProps) {
  return (
    <footer className="mt-auto bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-10 border-b border-zinc-800 pb-10">
          <p className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
            Style Starts Here.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Men</p>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/products?category=mens-wear" className="hover:text-white">Shirts</Link>
              <Link href="/products?category=mens-wear" className="hover:text-white">Trousers</Link>
              <Link href="/products?category=mens-wear" className="hover:text-white">Traditional</Link>
            </nav>
          </div>
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Women</p>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/products?category=womens-wear" className="hover:text-white">Dresses</Link>
              <Link href="/products?category=womens-wear" className="hover:text-white">Skirts</Link>
              <Link href="/products?category=womens-wear" className="hover:text-white">Traditional</Link>
            </nav>
          </div>
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Accessories</p>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/products?category=accessories" className="hover:text-white">Bags</Link>
              <Link href="/products?category=accessories" className="hover:text-white">Jewellery</Link>
              <Link href="/products?category=accessories" className="hover:text-white">Sandals</Link>
            </nav>
          </div>
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Contact</p>
            <div className="flex flex-col gap-2 text-sm">
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className="flex items-center gap-1.5 hover:text-white">
                  <Mail className="h-3.5 w-3.5" />{contactEmail}
                </a>
              )}
              {contactPhone && (
                <a href={`tel:${contactPhone}`} className="flex items-center gap-1.5 hover:text-white">
                  <Phone className="h-3.5 w-3.5" />{contactPhone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-900 px-4 py-4">
        <p className="text-center text-xs text-zinc-700">
          © {new Date().getFullYear()} {storeName}. Crafted in Ghana.
        </p>
      </div>
    </footer>
  );
}
