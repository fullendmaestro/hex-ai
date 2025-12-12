"use client";

import { type FC, memo } from "react";
import ReactMarkdown, { type Options, type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { CodeBlock, CodeBlockCopyButton } from "./code-block";
import { cn } from "@hex-ai/ui/lib/utils";
import "katex/dist/katex.min.css";

const defaultComponents: Components = {
  a({ children, ...props }) {
    return (
      <a
        className="text-primary hover:underline font-medium"
        {...props}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  },
  // @ts-expect-error - inline prop exists
  code({ children, className, inline, ...props }) {
    if (Array.isArray(children) && children.length) {
      if (children[0] === "▍") {
        return <span className="animate-pulse mt-1 inline-block">▍</span>;
      }

      children[0] = (children?.[0] as string).replace("`▍`", "▍");
    }

    const match = /language-(\w+)/.exec(className || "");
    const content = String(children);
    const hasNewlines = content.includes("\n");
    const hasLanguage = match && match[1];
    const isInline = inline || (!hasLanguage && !hasNewlines);

    if (isInline) {
      return (
        <code
          className={cn(
            "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
            className
          )}
          {...props}
        >
          {children}
        </code>
      );
    }

    const language = (match && match[1]) || "plaintext";
    const codeString = content.replace(/\n$/, "");

    return (
      <CodeBlock
        code={codeString}
        language={language as any}
        showLineNumbers={false}
      >
        <CodeBlockCopyButton />
      </CodeBlock>
    );
  },
  h1: ({ children, ...props }) => (
    <h1 className="scroll-m-20 text-3xl font-bold tracking-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="scroll-m-20 text-xl font-semibold tracking-tight" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5
      className="scroll-m-20 text-base font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className="scroll-m-20 text-sm font-semibold tracking-tight" {...props}>
      {children}
    </h6>
  ),
  p: ({ children, ...props }) => (
    <p className="leading-7 [&:not(:first-child)]:mt-4" {...props}>
      {children}
    </p>
  ),
  pre: ({ children }) => (
    <div className="my-4 w-full overflow-x-auto">{children}</div>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mt-4 border-l-2 border-muted-foreground/30 pl-4 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  ul: ({ children, ...props }) => (
    <ul className="my-4 ml-6 list-disc [&>li]:mt-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="my-4 ml-6 list-decimal [&>li]:mt-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),
  table: ({ children, ...props }) => (
    <div className="my-4 w-full overflow-y-auto">
      <table className="w-full border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-muted" {...props}>
      {children}
    </thead>
  ),
  tr: ({ children, ...props }) => (
    <tr
      className="border-b border-border transition-colors hover:bg-muted/50"
      {...props}
    >
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border border-border px-4 py-2 text-left font-semibold [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="border border-border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </td>
  ),
  hr: ({ ...props }) => <hr className="my-4 border-border" {...props} />,
  img: ({ alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rounded-md my-4 max-w-full" alt={alt || ""} {...props} />
  ),
};

const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.components === nextProps.components
);

type MarkdownProps = {
  content: string;
  components?: Components;
  className?: string;
};

export const Markdown = ({ content, components, className }: MarkdownProps) => {
  return (
    <div
      className={cn("prose prose-sm dark:prose-invert max-w-none", className)}
    >
      <MemoizedReactMarkdown
        components={{ ...defaultComponents, ...components }}
        remarkPlugins={[
          remarkGfm,
          [remarkMath, { singleDollarTextMath: false }],
        ]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
      >
        {content}
      </MemoizedReactMarkdown>
    </div>
  );
};
