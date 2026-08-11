import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ReactNode } from "react";

function getTextContent(children: ReactNode): string {
  if (children == null || typeof children === "boolean") {
    return "";
  }

  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(getTextContent).join("");
  }

  if (typeof children === "object" && "props" in children) {
    return getTextContent(
      (children as { props?: { children?: ReactNode } }).props?.children,
    );
  }

  return "";
}

function slugify(children: ReactNode): string {
  const text = getTextContent(children)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return text || "section";
}

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
        id={slugify(children)}
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
