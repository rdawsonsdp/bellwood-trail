import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { SITE } from "@/content/restaurants";

// Figtree is GCI's face on gci2016.org. Black for the hero, ExtraBold for
// section heads, Regular for body — all one family, self-hosted by next/font.
const figtree = Figtree({ subsets: ["latin"], weight: ["400", "600", "700", "800", "900"], variable: "--font-figtree", display: "swap" });

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://chatham-culinary-path.vercel.app").replace(/\/+$/, "");
const TITLE = "Chatham Culinary Path — Explore the Food of Chicago's South Side";

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s | ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE.name, locale: "en_US", url: SITE_URL, title: TITLE, description: SITE.description,
    images: [{ url: "/images/brand/hero-corridor-aerial.jpg", width: 1600, height: 1000, alt: "Aerial view of the 79th Street corridor in Greater Chatham" }] },
  twitter: { card: "summary_large_image", title: TITLE, description: SITE.description, images: ["/images/brand/hero-corridor-aerial.jpg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Culinary Path", statusBarStyle: "default" },
  icons: {
    icon: [
      { url: "/icons/gci-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/gci-48.png", type: "image/png", sizes: "48x48" },
      { url: "/icons/gci-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/icons/gci-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} h-full antialiased`}>
      <body className="min-h-full overflow-x-hidden bg-paper text-ink">{children}</body>
    </html>
  );
}
