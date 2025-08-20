const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig = {
  reactStrictMode: false,
  experimental: {
    esmExternals: false,
  },
  transpilePackages: ['@mercadopago/sdk-react'],
  webpack: (config) => {
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false 
    };

    return config;
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
};

module.exports = withPWA(nextConfig);