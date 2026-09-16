import Image from "next/image";
import { SITE } from "@/content/restaurants";

export function Footer() {
  return (
    <footer className="discovery-footer">
      <div className="site-container footer-main">
        <a className="footer-brand" href="/" aria-label="Chatham Culinary Path home">
          <Image src="/images/brand/gci-logo.png" alt="" width={400} height={311} />
          <strong>Chatham<br />Culinary Path</strong>
        </a>
        <a className="footer-gci-link" href={SITE.orgUrl}>Visit Greater Chatham Initiative <span aria-hidden="true">→</span></a>
      </div>
      <div className="site-container footer-bottom">© {new Date().getFullYear()} Greater Chatham Initiative.</div>
    </footer>
  );
}
