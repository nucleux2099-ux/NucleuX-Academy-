import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/library/content': ['./content/**/*'],
    '/library/[subject]/[subspecialty]': ['./content/**/*'],
    '/library/[subject]/[subspecialty]/[topic]': ['./content/**/*'],
  },
  transpilePackages: ['lucide-react'],
};

export default nextConfig;
