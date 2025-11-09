import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/portal',
        headers: [
          { key: 'X-Frame-Options', value: ' ' }, 
          { 
            key: 'Content-Security-Policy', 
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline'; worker-src 'self' blob:;"
          }
        ],
      },
    ];
  },

  webpack: (config, { webpack, isServer }) => {
    config.experiments = {
      ...(config.experiments || {}),
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true,
    };

    config.resolve = config.resolve || {};
    
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        buffer: require.resolve("buffer/"),
      };

      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        })
      );
    }

    config.module = config.module || { rules: [] };
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
    });

    return config;
  },
};

export default nextConfig;