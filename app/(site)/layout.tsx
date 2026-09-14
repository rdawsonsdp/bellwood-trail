import { DiscoveryProvider } from "@/app/components/DiscoveryContext";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

// The public trail's chrome. /admin sits outside this group and has its own.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <DiscoveryProvider>
    <div className="culinary-site">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
    </DiscoveryProvider>
  );
}
