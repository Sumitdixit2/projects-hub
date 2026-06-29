import type { NextConfig } from "next";

const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    return url;
  }
  return "http://localhost:4000/api/v1";
};

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = getApiUrl().replace(/\/+$/, '');
    return [
      {
        source: "/api/v1//:path*",
        destination: `${apiUrl}/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;

