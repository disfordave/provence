import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Children, isValidElement } from "react";

// The knowledge check at the end of a course: numbered questions, each answer
// hidden until the reader has thought it through.
export function Quiz({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 flex flex-col gap-3 [counter-reset:question]">
      {children}
    </div>
  );
}

// The first paragraph is the question, and the rest is the answer:
//
// <Question>
// Traduisez « When I arrive, I'll call you ».
//
// **Quand j'arriverai, je t'appellerai.**
// </Question>
export function Question({ children }: { children: React.ReactNode }) {
  const [question, ...answer] = Children.toArray(children);

  return (
    <details className="group border border-neutral-200 [counter-increment:question] dark:border-neutral-800">
      <summary className="flex cursor-pointer list-none items-start gap-4 p-4 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center bg-neutral-950 text-sm font-bold text-white before:content-[counter(question)] dark:bg-neutral-50 dark:text-black"
        />
        {/* A summary only takes inline content, so the paragraph is unwrapped. */}
        <span className="flex-1 pt-0.5 font-medium">
          {isValidElement<{ children?: React.ReactNode }>(question)
            ? question.props.children
            : question}
        </span>
        <span className="flex shrink-0 items-center gap-1 pt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {/* On a phone, the chevron alone leaves the question more room. */}
          <span className="group-open:hidden max-sm:hidden">Réponse</span>
          <span className="hidden sm:group-open:inline">Masquer</span>
          <ChevronDownIcon className="size-4 transition-transform group-open:rotate-180" />
        </span>
      </summary>
      <div className="border-t border-neutral-200 bg-neutral-100 px-4 py-3 *:first:mt-0 *:last:mb-0 sm:pl-15 dark:border-neutral-800 dark:bg-neutral-800">
        {answer}
      </div>
    </details>
  );
}
