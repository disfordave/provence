import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: {
    "/*": ["./src/content/**/*.mdx"],
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: ["remark-gfm"],
    // Gives every heading a unique id, so repeated headings get a numbered
    // suffix instead of colliding.
    rehypePlugins: ["rehype-slug"],
  },
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
