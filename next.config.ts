// next.config.ts
import withMDX from "@next/mdx"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // recognize .mdx files as routable pages/components
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/featured/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/random/**",
      },
      // Dodana nowa konfiguracja dla images.unsplash.com
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**", // Zezwala na wszystkie ścieżki
      },
    ],
  },

  // if you need to import server-only packages in server components
  serverExternalPackages: ["pdf-parse"],
}

// wrap your NextConfig with MDX support
export default withMDX({
  extension: /\.mdx?$/,
  options: {
    // providerImportSource: "@mdx-js/react", // if you need MDXProvider
    // remarkPlugins: [],         // add any remark plugins here
    // rehypePlugins: [],         // add any rehype plugins here
  },
})(nextConfig)