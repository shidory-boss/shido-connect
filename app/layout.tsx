import type { Metadata, Viewport } from 'next'
import './globals.css'
import { PWAConfigProvider } from '@/core/PWAConfigContext'

export const metadata: Metadata = {
  title: 'Oria Care',
  description: 'Votre espace santé personnalisé — Oria Care',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Oria Care' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1D9E75',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('sc_theme')||'light';if(t==='auto'){t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);var a=localStorage.getItem('sc_accent');if(a)document.documentElement.style.setProperty('--accent',a);}catch(e){}})();` }} />
        <script dangerouslySetInnerHTML={{ __html: `(function(){if('serviceWorker' in navigator){navigator.serviceWorker.addEventListener('controllerchange',function(){window.location.reload();});}})();` }} />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Oria Care" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Oria Care" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600;700&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <PWAConfigProvider>
          {children}
        </PWAConfigProvider>
      </body>
    </html>
  )
}
