import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

// The public trail's chrome. /admin sits outside this group and has its own.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
