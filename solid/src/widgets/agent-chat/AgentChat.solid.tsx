import { For, Show, createEffect, createSignal, type JSX } from "solid-js";
import { Block } from "@/ui/block/block.solid";
import { Box } from "@/ui/box/box.solid";
import { Button } from "@/ui/button/button.solid";
import { Icon } from "@/ui/icon/icon.solid";
import { Label } from "@/ui/label/label.solid";
import { List, ListItem } from "@/ui/list/list.solid";
import { Text } from "@/ui/text/text.solid";
import { Textarea } from "@/ui/textarea/textarea.solid";
import { Title } from "@/ui/title/title.solid";
import { fixture, type ChatMessage } from "./fixture.shared";

export type AgentChatProps = {
  title?: string;
  messages?: ChatMessage[];
  placeholder?: string;
  hint?: string;
  offline?: string;
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
          <Icon type="svg" href="/icons.svg#chat" /> {title()}
        </Title>
      </Box>
      <Show
        when={messages().length > 0}
        fallback={<Text class="flex-1 p-4 text-xs text-muted-foreground">{props.offline ?? "Agent offline"}</Text>}
      >
        <List tag="ul" class="m-0 min-h-0 flex-1 list-none space-y-4 overflow-auto p-4" aria-live="polite">
          <For each={messages()}>
            {(message) => (
              <ListItem tag="li" class="m-0 list-none">
                <Text class={message.role === "user" ? "whitespace-pre-wrap text-xs text-foreground" : "whitespace-pre-wrap text-xs text-muted-foreground"}>
                  {message.text}
                </Text>
              </ListItem>
            )}
          </For>
        </List>
      </Show>
      <Box class="m-2 shrink-0 rounded-lg border border-border bg-background p-2">
        <Label for="agent-draft" class="sr-only">
          Agent message
        </Label>
        <Textarea
          id="agent-draft"
          class="min-h-24 resize-none border-0 bg-transparent p-2 text-xs shadow-none"
          placeholder={props.placeholder ?? "Ask a question or describe a change..."}
          value={draft()}
          onInput={(event) => setDraft(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
        />
        <Box class="flex items-center justify-between gap-2 px-1">
          <Text class="text-xs text-muted-foreground">{props.offline ?? "Agent offline"}</Text>
          <Button type="button" size="sm" class="h-8 w-8" disabled={!draft().trim()} aria-label="Send" onClick={send}>
            <Icon type="svg" href="/icons.svg#send" />
          </Button>
        </Box>
      </Box>
      <Show when={props.hint}>
        <Text class="px-4 pb-2 text-xs text-muted-foreground">{props.hint}</Text>
      </Show>
    </Block>
  );
}
