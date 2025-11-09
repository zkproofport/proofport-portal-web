import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/portal-premium',
        destination: '/portal',
      },
    ];
  },
  // async headers() {
  //   return [
  //     {
  //       source: "/:path*",
  //       headers: [
  //         { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
  //         { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  //       ],
  //     },
  //     {
  //       source: '/portal',
  //       headers: [
  //         { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  //         { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
  //       ],
  //     },
  //   ];
  // },

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