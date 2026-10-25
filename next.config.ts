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
    // Footnotes come with English labels by default: screen readers read them,
    // and the heading also appears in the Sommaire. Turbopack only passes plain
    // values to the loader, so every back link shares one label.
    remarkRehypeOptions: {
      footnoteLabel: "Notes",
      footnoteBackLabel: "Retour au texte",
    },
    // Gives every heading a unique id, so repeated headings get a numbered
    // suffix instead of colliding. The local plugin needs an absolute path:
    // the loader resolves plugins from the folder of each MDX file. Turbopack
    // does not see changes to it, so delete `.next` after editing it.
    rehypePlugins: [
      "rehype-slug",
      path.join(process.cwd(), "src/lib/rehype-examples.mjs"),
    ],
  },
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
