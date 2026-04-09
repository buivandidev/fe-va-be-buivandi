/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // CRITICAL: Disable ALL parallelization to prevent process leak
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  
  // Disable webpack worker pool
  webpack: (config, { isServer }) => {
    // Disable worker pool completely
    config.parallelism = 1;
    
    // Disable thread-loader if present
    if (config.module && config.module.rules) {
      config.module.rules.forEach((rule) => {
        if (rule.use && Array.isArray(rule.use)) {
          rule.use = rule.use.filter((loader) => 
            !loader.loader || !loader.loader.includes('thread-loader')
          );
        }
      });
    }
    
    return config;
  },
  
  // Optimize for production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
  
  async redirects() {
    return [
      {
        source: '/',
        destination: '/admin/login',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
