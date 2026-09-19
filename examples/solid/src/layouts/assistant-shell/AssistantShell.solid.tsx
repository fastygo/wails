import { Show, type JSX } from "solid-js";
import { Block } from "@/ui/block/block.solid";
import { Box } from "@/ui/box/box.solid";
import { Text } from "@/ui/text/text.solid";
import { Title } from "@/ui/title/title.solid";
import { fixture } from "./fixture.shared";

export type AssistantShellProps = {
  title?: string;
  chat?: JSX.Element;
  browse?: JSX.Element;
};

export function AssistantShell(props: AssistantShellProps): JSX.Element {
  const title = () => props.title ?? fixture.title;

  return (
    <Block class="flex h-full min-h-0 min-w-0 flex-col" data-surface="assistant-shell">
      <Box class="flex h-8 shrink-0 items-center border-b border-border px-2">
        <Title as="h2" class="text-xs font-medium">
          {title()}
        </Title>
      </Box>
      <Box class="flex min-h-0 flex-1">
        <Box class="min-w-0 flex-1 border-r border-border" aria-label={fixture.chat}>
          <Show when={props.chat} fallback={<Text class="p-2 text-xs text-muted-foreground">{fixture.empty}</Text>}>
            {props.chat}
          </Show>
        </Box>
        <Box class="min-w-0 flex-1" aria-label={fixture.browse}>
          <Show when={props.browse} fallback={<Text class="p-2 text-xs text-muted-foreground">{fixture.empty}</Text>}>
            {props.browse}
          </Show>
        </Box>
      </Box>
    </Block>
  );
}
