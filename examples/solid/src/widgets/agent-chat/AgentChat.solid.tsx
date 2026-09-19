import { For, createSignal, type JSX } from "solid-js";
import { fixture, type ChatMessage } from "./fixture.shared";

export type AgentChatProps = {
  title?: string;
  messages?: ChatMessage[];
  onSend?: (text: string) => void;
};

export function AgentChat(props: AgentChatProps): JSX.Element {
  const [messages, setMessages] = createSignal(props.messages ?? fixture.messages);
  const [draft, setDraft] = createSignal("");
  const title = () => props.title ?? fixture.title;

  const send = () => {
    const text = draft().trim();
    if (!text) return;
    const id = String(Date.now());
    setMessages((prev) => [
      ...prev,
      { id, role: "user", text },
      { id: `${id}-fixture`, role: "assistant", text: "Fixture reply. No agent runtime is connected." },
    ]);
    setDraft("");
    props.onSend?.(text);
  };

  return (
    <aside class="flex h-full min-h-0 min-w-0 flex-col bg-card" data-surface="agent-chat" aria-label={title()}>
      <div class="flex h-8 shrink-0 items-center border-b border-border px-2 text-xs font-medium">{title()}</div>
      <div class="min-h-0 flex-1 space-y-2 overflow-auto p-2 text-xs" aria-live="polite">
        <For each={messages()}>
          {(message) => (
            <p class={message.role === "user" ? "text-foreground" : "text-muted-foreground"}>{message.text}</p>
          )}
        </For>
      </div>
      <form
        class="flex border-t border-border"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        <input
          class="h-8 min-w-0 flex-1 bg-background px-2 text-xs"
          aria-label="Agent message"
          value={draft()}
          onInput={(event) => setDraft(event.currentTarget.value)}
        />
      </form>
    </aside>
  );
}
