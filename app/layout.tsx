import type { Metadata, Viewport } from "next";
import { Figtree, Kaushan_Script } from "next/font/google";
import "./globals.css";
import { SITE } from "@/content/restaurants";

// Figtree carries the headlines. Black for the hero, ExtraBold for
// section heads, Regular for body — all one family, self-hosted by next/font.
const figtree = Figtree({ subsets: ["latin"], weight: ["400", "600", "700", "800", "900"], variable: "--font-figtree", display: "swap" });

const script = Kaushan_Script({ subsets: ["latin"], weight: "400", variable: "--font-logo-script", display: "swap" });

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://bellwood-culinary-path.vercel.app").replace(/\/+$/, "");
const TITLE = SITE.name;

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s | ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE.name, locale: "en_US", url: SITE_URL, title: TITLE, description: SITE.description,
    images: [{ url: "/icons/bellwood-1024.png", width: 1024, height: 1024, alt: "The Bellwood Culinary Path mark — a gold trail on the village blue" }] },
  twitter: { card: "summary", title: TITLE, description: SITE.description, images: ["/icons/bellwood-1024.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: "default" },
  icons: {
    icon: [
      { url: "/icons/bellwood-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/bellwood-48.png", type: "image/png", sizes: "48x48" },
      { url: "/icons/bellwood-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico?v=bellwood",
    apple: [{ url: "/icons/bellwood-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} ${script.variable} h-full antialiased`}>
      <body className="min-h-full overflow-x-hidden bg-paper text-ink">{children}</body>
    </html>
  );
}
