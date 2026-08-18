import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// The `id` comes from the `rehype-slug` plugin configured in `next.config.ts`,
// which also disambiguates headings that share the same text.
function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const HeadingTag = `h${level}` as const;

  return function Heading({
    children,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof HeadingTag>) {
    return (
      <HeadingTag
        {...props}
        className={["scroll-mt-24", className].filter(Boolean).join(" ")}
      >
        {children}
      </HeadingTag>
    );
  };
}

const components: MDXComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  a: ({ href, ...props }) => {
    if (href?.startsWith("http")) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
      );
    }
    return <Link href={href ?? ""} {...props} />;
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
