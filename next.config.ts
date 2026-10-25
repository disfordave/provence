import path from "node:path";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: ["remark-gfm"],
    // Gives every heading a unique id, so repeated headings get a numbered
    // suffix instead of colliding. The local plugin needs an absolute path:
    // the loader resolves plugins from the folder of each MDX file.
    rehypePlugins: [
      "rehype-slug",
      path.join(process.cwd(), "src/lib/rehype-examples.mjs"),
    ],
  },
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
