import Link from "next/link";
import { Leaf, MapPin, Mail, Phone } from "lucide-react";

interface FooterProps {
  storeName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
}

export function FreshMartFooter({ storeName, contactEmail, contactPhone }: FooterProps) {
  return (
    <footer className="mt-auto bg-green-900 text-green-100">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400">
                <Leaf className="h-4 w-4 text-green-900" />
              </div>
              <span className="font-extrabold text-white">{storeName}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-green-300">
              Farm-to-table produce, pantry staples, and beverages — delivered same day across Accra.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-green-400">Shop</p>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/products?category=fresh-produce" className="text-green-200 hover:text-white">Fresh Produce</Link>
              <Link href="/products?category=pantry" className="text-green-200 hover:text-white">Pantry Staples</Link>
              <Link href="/products?category=beverages" className="text-green-200 hover:text-white">Beverages</Link>
              <Link href="/products" className="text-green-200 hover:text-white">All Products</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-green-400">Contact</p>
            <div className="flex flex-col gap-2 text-sm text-green-200">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-green-400" />
                <span>Delivering across Accra & Greater Accra</span>
              </div>
              {contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-green-400" />
                  <a href={`mailto:${contactEmail}`} className="hover:text-white">{contactEmail}</a>
                </div>
              )}
              {contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-green-400" />
                  <a href={`tel:${contactPhone}`} className="hover:text-white">{contactPhone}</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-green-800 px-4 py-4">
        <p className="text-center text-xs text-green-600">
          © {new Date().getFullYear()} {storeName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
