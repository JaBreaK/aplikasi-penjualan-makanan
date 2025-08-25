import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hhfjdkifsrugdgvfrciw.supabase.co', // Ganti dengan hostname Supabase-mu
      },
    ],
  },
};

export default nextConfig;