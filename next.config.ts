import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable Turbopack for development
  turbopack: {
    // Turbopack configuration
  },
  // Ensure static assets are served properly  
  async rewrites() {
    return [
      {
        source: '/bmi.html',
        destination: '/calculators/bmi',
      },
    ];
  },
};

export default nextConfig;