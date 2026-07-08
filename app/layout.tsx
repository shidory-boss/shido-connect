import type { Metadata, Viewport } from 'next'
import { Josefin_Sans, Nunito } from 'next/font/google'
import './globals.css'
import { PWAConfigProvider } from '@/core/PWAConfigContext'

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-josefin',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
})

const CLINIC_NAME = process.env.NEXT_PUBLIC_CLINIC_NAME || 'ShidoConnect'
const ACCENT      = process.env.NEXT_PUBLIC_ACCENT_COLOR || '#1D9E75'

export const metadata: Metadata = {
  title: CLINIC_NAME,
  description: `Votre espace santé personnalisé — ${CLINIC_NAME}`,
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: CLINIC_NAME },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: ACCENT,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('sc_theme')||'light';if(t==='auto'){t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);var a=localStorage.getItem('sc_accent');if(a)document.documentElement.style.setProperty('--accent',a);}catch(e){}})();` }} />
        <script dangerouslySetInnerHTML={{ __html: `(function(){if('serviceWorker' in navigator){navigator.serviceWorker.addEventListener('controllerchange',function(){window.location.reload();});}})();` }} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={CLINIC_NAME} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content={CLINIC_NAME} />
      </head>
      <body className={`${nunito.variable} ${josefinSans.variable}`}>
        <PWAConfigProvider>
          {children}
        </PWAConfigProvider>
      </body>
    </html>
  )
}
