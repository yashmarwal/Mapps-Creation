import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, Phone } from "lucide-react";
import { CATEGORIES } from "@/data/catalog";
import { SITE } from "@/lib/seo";
import { LogoMark } from "./LogoMark";

const INSTAGRAM_URL = "https://www.instagram.com/mappscreation?igsi=MWsxdjNycThiNmY3dw==";

const DEVELOPER_WHATSAPP = `https://wa.me/918595475007?text=${encodeURIComponent(
  "Hello, I’m interested in developing a website.",
)}`;

export function Footer() {
  return (
    <footer id="site-footer" className="border-border border-t pb-23 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 md:px-10 md:py-20">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <LogoMark size={44} />
            <span className="font-display text-2xl tracking-wide">Mapps Creation</span>
          </div>
          <p className="text-primary font-display mt-5 text-xl italic">{SITE.tagline}</p>
          <p className="text-muted-foreground mt-4 max-w-sm text-sm leading-relaxed">
            Wholesale trader and distributor of Lycra, knitted and polyester-lycra fabrics for
            garment manufacturers, exporters and brands.
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <a
              href={`tel:${SITE.phone}`}
              className="text-foreground hover:text-primary flex items-center gap-2 transition-colors"
            >
              <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
            </a>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {SITE.city}, India
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mapps Creation on Instagram"
              className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors"
            >
              <Instagram className="h-4 w-4" /> Instagram
            </a>
          </div>
        </div>

        <div>
          <h3 className="label-caps text-primary">Fabrics</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  to="/catalogue"
                  search={{ category }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label-caps text-primary">Company</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {[
              { to: "/catalogue", label: "Catalogue" },
              { to: "/about", label: "About Us" },
              { to: "/wholesale", label: "Wholesale" },
              { to: "/faq", label: "FAQ" },
              { to: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-6 text-xs leading-relaxed">
            GST-registered proprietorship
            <br />
            Established 2024
            <br />
            Proprietor: P Agarwal
          </p>
        </div>
      </div>

      <div className="hairline" />
      <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs md:flex-row md:items-center md:justify-between md:px-10">
        <p>© {new Date().getFullYear()} Mapps Creation. All rights reserved.</p>
        <p>Inquiry-only B2B · Wholesale &amp; bulk supply from Surat</p>
      </div>

      <div className="border-border text-muted-foreground border-t py-4 text-center text-xs">
        Developed by{" "}
        <a
          href={DEVELOPER_WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-foreground underline underline-offset-2 transition-colors"
        >
          Yash Marwal
        </a>
      </div>
    </footer>
  );
}
