import type { NextConfig } from "next";

// next-pwa uniquement en production (pas de webpack en dev Turbopack)
const isDev = process.env.NODE_ENV === 'development';

let finalConfig: NextConfig = {
  images: { unoptimized: true },
  turbopack: {},  // silence l'erreur Turbopack/webpack
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
