import { Show, type JSX } from "solid-js";
import { Block } from "@/ui/block/block.solid";
import { Box } from "@/ui/box/box.solid";
import { Text } from "@/ui/text/text.solid";
import { fixture } from "./fixture.shared";

export type WorkshopShellProps = {
  files?: JSX.Element;
  editor?: JSX.Element;
  terminal?: JSX.Element;
  agent?: JSX.Element;
};

export function WorkshopShell(props: WorkshopShellProps): JSX.Element {
  return (
    <Block class="flex h-full min-h-0 min-w-0" data-surface="workshop-shell">
      <Box class="flex w-[20%] min-w-48 max-w-80 shrink-0 flex-col border-r border-border" aria-label={fixture.files}>
        <Show when={props.files} fallback={<Text class="p-2 text-xs text-muted-foreground">{fixture.empty}</Text>}>
          {props.files}
        </Show>
      </Box>
      <Box class="flex min-h-0 min-w-0 flex-1 flex-col">
        <Box class="min-h-0 flex-1" aria-label={fixture.editor}>
          <Show when={props.editor} fallback={<Text class="p-2 text-xs text-muted-foreground">{fixture.empty}</Text>}>
            {props.editor}
          </Show>
        </Box>
        <Box class="h-52 shrink-0 border-t border-border" aria-label={fixture.terminal}>
          <Show when={props.terminal} fallback={<Text class="p-2 text-xs text-muted-foreground">{fixture.empty}</Text>}>
            {props.terminal}
          </Show>
        </Box>
      </Box>
      <Box class="flex w-[28%] min-w-64 max-w-96 shrink-0 flex-col border-l border-border" aria-label={fixture.agent}>
        <Show when={props.agent} fallback={<Text class="p-2 text-xs text-muted-foreground">{fixture.empty}</Text>}>
          {props.agent}
        </Show>
      </Box>
    </Block>
  );
}
