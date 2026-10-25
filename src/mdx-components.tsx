import type { MDXComponents } from "mdx/types";
import Link from "next/link";

function joinClassNames(...classNames: (string | false | undefined)[]) {
  return classNames.filter(Boolean).join(" ");
}

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
        className={joinClassNames("scroll-mt-24", className)}
      >
        {children}
      </HeadingTag>
    );
  };
}

type ParagraphProps = React.ComponentPropsWithoutRef<"p"> & {
  "data-example"?: string;
};

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
  // `rehype-examples.mjs` takes the "Exemple" label out of its paragraph and
  // passes it here. It becomes a small caption, above the sentence on the same
  // line, or close above the list or quotes when it stands alone.
  p: ({ children, "data-example": label, ...props }: ParagraphProps) => {
    if (!label) return <p {...props}>{children}</p>;

    return (
      <p
        {...props}
        className={joinClassNames(
          !children && "mb-2 [&+blockquote]:mt-2 [&+ol]:mt-2 [&+ul]:mt-2",
          props.className,
        )}
      >
        <span className="block text-xs font-semibold tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
          {label}
        </span>
        {children}
      </p>
    );
  },
  // The courses state their rules and formulas in blockquotes, so each one is
  // a card that stands out from the explanation around it. Cards in a row,
  // like a series of examples, stay together.
  blockquote: ({ className, ...props }) => (
    <blockquote
      {...props}
      className={joinClassNames(
        "border-l-4 border-neutral-950 bg-neutral-100 px-5 py-3 *:first:mt-0 *:last:mb-0 dark:border-neutral-50 dark:bg-neutral-800 [&+blockquote]:mt-1 [&:has(+blockquote)]:mb-1",
        className,
      )}
    />
  ),
  table: ({ className, ...props }) => (
    <div className="my-6 overflow-auto border border-neutral-200 dark:border-neutral-800">
      <table
        {...props}
        className={joinClassNames("w-full overflow-auto", className)}
      />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th
      {...props}
      className={joinClassNames(
        "bg-neutral-100 px-3 py-2 dark:bg-neutral-800",
        className,
      )}
    />
  ),
  td: ({ className, ...props }) => (
    <td {...props} className={joinClassNames("px-3", className)} />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
