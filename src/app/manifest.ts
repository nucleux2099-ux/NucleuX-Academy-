import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NucleuX Academy",
    short_name: "NucleuX",
    description:
      "Learn Atomically. Grow Exponentially. AI-powered medical education.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F172A",
    theme_color: "#7C3AED",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
