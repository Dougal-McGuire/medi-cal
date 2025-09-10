/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Turbopack for development (new config format)
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