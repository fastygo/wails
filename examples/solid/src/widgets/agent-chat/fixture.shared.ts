export type ChatMessage = { id: string; role: "assistant" | "user"; text: string };

/** Same data as fixtures/agent-chat.json. */
export const fixture = {
  title: "Agent",
  messages: [
    {
      id: "1",
      role: "assistant" as const,
      text: "Fixture reply. No agent runtime is connected.",
    },
  ] as ChatMessage[],
};
