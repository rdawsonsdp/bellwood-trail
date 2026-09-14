import Image from "next/image";
import { SITE } from "@/content/restaurants";
export function Footer() {
  return <footer className="discovery-footer"><div className="site-container footer-main">
    <div><a className="footer-brand" href="/" aria-label="Chatham Culinary Path home"><Image src="/images/brand/gci-logo.png" alt="" width={400} height={311} /><strong>Chatham<br />Culinary Path</strong></a><p>A neighborhood worth knowing. A food story worth sharing. Discover the kitchens of Chicago’s South Side with Greater Chatham Initiative.</p></div>
    <nav aria-label="Footer navigation"><h2>Make a day of it</h2><a href="#path">Explore the kitchens</a><a href="#neighborhoods">Meet the neighborhood</a><a href="#updates">Latest from the path</a><a href={SITE.instagram} target="_blank" rel="noopener noreferrer">Follow Greater Chatham</a></nav>
    <div><h2>Rooted in the neighborhood</h2><p>Greater Chatham Initiative brings people, businesses, and neighborhoods together to build a stronger South Side.</p><a href={SITE.orgUrl} target="_blank" rel="noopener noreferrer">Get to know GCI</a></div>
  </div><div className="site-container footer-bottom">© {new Date().getFullYear()} Greater Chatham Initiative. Made for exploring, one kitchen at a time.</div></footer>;
}
