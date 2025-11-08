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
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },

      {
        source: "/portal-lite/:path*",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Origin-Agent-Cluster", value: "?1" },
          { key: "Timing-Allow-Origin", value: "*" },
          { key: "Permissions-Policy", value: "shared-array-buffer=(self)" },
        ],
      },

      {
        source: "/portal-iso/:path*",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Origin-Agent-Cluster", value: "?1" },
          { key: "Timing-Allow-Origin", value: "*" },
          { key: "Permissions-Policy", value: "shared-array-buffer=(self)" },
        ],
      },

      {
        source: "/(portal-lite|portal-iso)/:path*\\.wasm",
        headers: [
          { key: "Content-Type", value: "application/wasm" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      {
        source: "/(portal-lite|portal-iso)/:path*\\.json",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Cache-Control", value: "public, max-age=3600" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
          { key: "Access-Control-Allow-Origin", value: "*" },
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