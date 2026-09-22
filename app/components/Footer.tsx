import { CookiePreferences } from "./CookiePreferences";
import Image from "next/image";
import { SITE } from "@/content/restaurants";

export function Footer() {
  return (
    <footer className="discovery-footer">
      <div className="site-container footer-main">
        <a className="footer-brand" href="/" aria-label={`${SITE.name} home`}>
          <Image src="/images/brand/bellwood-logo.png" alt="" width={400} height={170} />
          <strong>{SITE.name}</strong>
        </a>
        <a className="footer-org-link" href={SITE.orgUrl}>Visit the Village of Bellwood <span aria-hidden="true">→</span></a>
      </div>
      <div className="site-container footer-bottom">© {new Date().getFullYear()} Village of Bellwood.<CookiePreferences /></div>
    </footer>
  );
}
