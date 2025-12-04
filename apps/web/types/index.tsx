export interface UIMessage<METADATA = unknown> {
  id: string;
  role: "system" | "user" | "assistant";
  parts: UIMessagePart[];
  metadata?: METADATA;
}

// Discriminated union for message parts
export type UIMessagePart = TextUIPart | ToolUIPart;

// Individual part types
export interface TextUIPart {
  type: "text";
  text: string;
}

export interface ToolUIPart<INPUT = unknown, OUTPUT = unknown> {
  type: "tool";
  state: "call" | "executed";
  toolName: string;
  input: INPUT;
  output?: OUTPUT;
  providerExecuted?: boolean;
}
