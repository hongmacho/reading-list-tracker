import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    turbopack: {
      rules: {
        "*.stories.{js,cjs,mjs,ts,mts,tsx}": {
          loaders: ["@storybook/nextjs/loader"],
          as: "*.tsx",
        },
      },
    },
  },
};

export default config;
