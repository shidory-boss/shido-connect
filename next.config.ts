import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const CSP_PROD = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",                          // unsafe-eval retiré en prod
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://*.shidoos.ci wss://*.shidoos.ci https://api.emiyacosmetics.com wss://api.emiyacosmetics.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ')

const CSP_DEV = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self' http://localhost:8001 ws://localhost:8001 ws://localhost:8765 https://*.shidoos.ci https://api.emiyacosmetics.com wss://api.emiyacosmetics.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const securityHeaders = [
  { key: 'X-Frame-Options',                    value: 'DENY' },
  { key: 'X-Content-Type-Options',             value: 'nosniff' },
  { key: 'X-XSS-Protection',                   value: '1; mode=block' },
  { key: 'Referrer-Policy',                     value: 'strict-origin-when-cross-origin' },
  { key: 'X-Permitted-Cross-Domain-Policies',  value: 'none' },
  { key: 'Cross-Origin-Opener-Policy',         value: 'same-origin' },
  { key: 'Cross-Origin-Embedder-Policy',       value: 'require-corp' },
  { key: 'Cross-Origin-Resource-Policy',       value: 'same-origin' },
  { key: 'Permissions-Policy',                  value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), serial=()' },
  { key: 'Content-Security-Policy',            value: isDev ? CSP_DEV : CSP_PROD },
  ...(isDev ? [] : [
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  ]),
]

let finalConfig: NextConfig = {
  poweredByHeader: false,          // masque "X-Powered-By: Next.js"
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      { protocol: 'https', hostname: 'api.emiyacosmetics.com' },
      { protocol: 'http', hostname: 'localhost', port: '8001' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
};

// next-pwa désactivé — sw.js est géré manuellement (public/sw.js)
// Le sw.js actuel est un kill switch qui se désinstalle sur tous les appareils

export default finalConfig;
