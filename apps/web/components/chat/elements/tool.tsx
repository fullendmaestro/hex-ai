"use client";

import { Badge } from "@hex-ai/ui/components/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@hex-ai/ui/components/collapsible";
import { cn } from "@hex-ai/ui/lib/utils";
import type { ToolUIPart } from "@/types";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  WrenchIcon,
} from "lucide-react";
import type {
  ComponentProps,
  ReactNode,
  PropsWithChildren,
  ReactElement,
} from "react";
import { isValidElement } from "react";
import { CodeBlock } from "./code-block";

export type ToolProps = PropsWithChildren<
  Partial<ComponentProps<typeof Collapsible>> & { className?: string }
>;

export const Tool = ({
  className,
  children,
  ...props
}: ToolProps): ReactElement => (
  <Collapsible
    className={cn("not-prose mb-4 w-full rounded-md border", className)}
    {...(props as any)}
  >
    {children}
  </Collapsible>
);

export type ToolHeaderProps = {
  title?: string;
  toolType?: string;
  state: ToolUIPart["state"];
  className?: string;
};

const getStatusBadge = (status: ToolUIPart["state"]) => {
  const labels: Record<ToolUIPart["state"], string> = {
    call: "Calling",
    executed: "Completed",
  };

  const icons: Record<ToolUIPart["state"], ReactNode> = {
    call: <CircleIcon className="size-4 animate-pulse" />,
    executed: <CheckCircleIcon className="size-4 text-green-600" />,
  };

  return (
    <Badge className="gap-1.5 rounded-full text-xs" variant="secondary">
      {icons[status]}
      {labels[status]}
    </Badge>
  );
};

export const ToolHeader = ({
  className,
  title,
  toolType = "tool",
  state,
  ...props
}: ToolHeaderProps &
  ComponentProps<typeof CollapsibleTrigger>): ReactElement => (
  <CollapsibleTrigger
    className={cn(
      "flex w-full items-center justify-between gap-4 p-3",
      className
    )}
    {...(props as any)}
  >
    <div className="flex items-center gap-2">
      <WrenchIcon className="size-4 text-muted-foreground" />
      <span className="font-medium text-sm">{title ?? toolType}</span>
      {getStatusBadge(state)}
    </div>
    <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
  </CollapsibleTrigger>
);

export type ToolContentProps = {
  className?: string;
  children?: ReactNode;
} & Record<string, any>;

export const ToolContent = ({
  className,
  children,
  ...props
}: ToolContentProps): ReactElement => (
  <CollapsibleContent
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
      className
    )}
    {...(props as any)}
  >
    {children}
  </CollapsibleContent>
);

export type ToolInputProps = ComponentProps<"div"> & {
  input: ToolUIPart["input"];
};

export const ToolInput = ({
  className,
  input,
  ...props
}: ToolInputProps): ReactElement => (
  <div
    className={cn("space-y-2 overflow-hidden p-4", className)}
    {...(props as any)}
  >
    <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
      Parameters
    </h4>
    <div className="rounded-md bg-muted/50">
      <CodeBlock code={JSON.stringify(input, null, 2)} language="json" />
    </div>
  </div>
);

export type ToolOutputProps = ComponentProps<"div"> & {
  output: ToolUIPart["output"];
};

export const ToolOutput = ({
  className,
  output,
  ...props
}: ToolOutputProps): ReactElement | null => {
  if (!output) {
    return null;
  }

  let Output: any = <div>{output as any}</div>;

  if (typeof output === "object" && !isValidElement(output)) {
    Output = (
      <CodeBlock code={JSON.stringify(output, null, 2)} language="json" />
    );
  } else if (typeof output === "string") {
    Output = <CodeBlock code={output} language="json" />;
  }

  return (
    <div className={cn("space-y-2 p-4", className)} {...(props as any)}>
      <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        Result
      </h4>
      <div
        className={cn(
          "overflow-x-auto rounded-md text-xs [&_table]:w-full bg-muted/50 text-foreground"
        )}
      >
        {Output}
      </div>
    </div>
  );
};
