import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { clinicConfig } from "@/lib/config";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:       `${clinicConfig.name} — Votre Clinique`,
  description: clinicConfig.description,
  manifest:    "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: clinicConfig.shortName },
  openGraph: {
    title:       clinicConfig.name,
    description: clinicConfig.tagline,
    type:        "website",
  },
};

export const viewport: Viewport = {
  themeColor:   clinicConfig.accent,
  width:        "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={geist.className}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </body>
    </html>
  );
}
