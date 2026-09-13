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
  // O minificador SWC do Next 13 quebra o destroy() do driver.js 1.8:
  // ao embutir uma função auxiliar, uma chamada passa a apontar para o
  // handler de clique no overlay, que chama destroy() de novo em loop.
  // Em produção o guia não fechava (Concluir, X, clique no fundo).
  // O Terser compila o mesmo código corretamente.
  swcMinify: false,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
};

module.exports = withPWA(nextConfig);