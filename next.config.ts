import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const securityHeaders = [
  // Empêche le clickjacking (iframe malveillant)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Empêche le MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Force HTTPS pendant 1 an (actif en prod uniquement)
  ...(isDev ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]),
  // Contrôle les infos envoyées au site référent
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Désactive les fonctionnalités sensibles du navigateur
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // Protection XSS basique navigateurs anciens
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Content Security Policy — autorise uniquement nos sources
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",   // unsafe-eval requis Next.js dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self' http://localhost:8001 ws://localhost:8001 ws://localhost:8765 https://*.shidoos.ci https://api.emiyacosmetics.com",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]

let finalConfig: NextConfig = {
  images: { unoptimized: true },
  turbopack: {},
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
};

if (!isDev) {
  const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: false,
  });
  finalConfig = withPWA(finalConfig);
}

export default finalConfig;
