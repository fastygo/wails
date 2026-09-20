import { For, createEffect, createSignal, type JSX } from "solid-js";
import { Block } from "@/ui/block/block.solid";
import { Box } from "@/ui/box/box.solid";
import { Button } from "@/ui/button/button.solid";
import { Label } from "@/ui/label/label.solid";
import { List, ListItem } from "@/ui/list/list.solid";
import { Text } from "@/ui/text/text.solid";
import { Textarea } from "@/ui/textarea/textarea.solid";
import { Title } from "@/ui/title/title.solid";
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
  createEffect(() => {
    if (props.messages) setMessages(props.messages);
  });

  const send = () => {
    const text = draft().trim();
    if (!text) return;
    const id = String(Date.now());
    setMessages((prev) => {
      const next: ChatMessage[] = [...prev, { id, role: "user", text }];
      if (!props.onSend) {
        next.push({ id: `${id}-fixture`, role: "assistant", text: "Fixture reply. No agent runtime is connected." });
      }
      return next;
    });
    setDraft("");
    props.onSend?.(text);
  };

  return (
    <Block tag="aside" class="flex h-full min-h-0 min-w-0 flex-col bg-card" data-surface="agent-chat" aria-label={title()}>
      <Box class="flex h-8 shrink-0 items-center border-b border-border px-2">
        <Title as="h2" class="text-xs font-medium">
          {title()}
        </Title>
      </Box>
      <List tag="ul" class="m-0 min-h-0 flex-1 list-none space-y-2 overflow-auto p-2" aria-live="polite">
        <For each={messages()}>
          {(message) => (
            <ListItem tag="li" class="m-0 list-none">
              <Text class={message.role === "user" ? "text-xs text-foreground" : "text-xs text-muted-foreground"}>
                {message.text}
              </Text>
            </ListItem>
          )}
        </For>
      </List>
      <form
        class="flex flex-col gap-2 border-t border-border p-2"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        <Label for="agent-draft" class="sr-only">
          Agent message
        </Label>
        <Textarea
          id="agent-draft"
          class="min-h-16 resize-none text-xs"
          value={draft()}
          onInput={(event) => setDraft(event.currentTarget.value)}
        />
        <Button type="submit" size="sm">
          Send
        </Button>
      </form>
    </Block>
  );
}
