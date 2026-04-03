import Link from "next/link";

interface FooterProps {
  storeName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
}

export function SecondSightFooter({ storeName, contactEmail, contactPhone }: FooterProps) {
  return (
    <footer className="mt-auto bg-[#eeeeec]">
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <p
              className="text-xl font-bold tracking-tight text-[#1a1c1b]"
              style={{ fontFamily: "var(--font-noto-serif)" }}
            >
              {storeName.toUpperCase()}
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5f5e5e]">Shop</p>
            <nav className="flex flex-col gap-2.5 text-sm text-[#1a1c1b]/70">
              <Link href="/products" className="hover:text-[#6c5e06] transition-colors">All Collections</Link>
              <Link href="/cart" className="hover:text-[#6c5e06] transition-colors">Cart</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5f5e5e]">Contact</p>
            <div className="flex flex-col gap-2.5 text-sm text-[#1a1c1b]/70">
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className="hover:text-[#6c5e06] transition-colors">{contactEmail}</a>
              )}
              {contactPhone && (
                <a href={`tel:${contactPhone}`} className="hover:text-[#6c5e06] transition-colors">{contactPhone}</a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-[#cdc6b3]/40 pt-6">
          <p className="text-center text-xs text-[#5f5e5e]/60">
            © {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
