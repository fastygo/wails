import { Show, type JSX } from "solid-js";
import { fixture } from "./fixture.shared";

export type WorkshopShellProps = {
  files?: JSX.Element;
  editor?: JSX.Element;
  terminal?: JSX.Element;
  agent?: JSX.Element;
};

export function WorkshopShell(props: WorkshopShellProps): JSX.Element {
  return (
    <div class="flex h-full min-h-0 min-w-0" data-surface="workshop-shell">
      <div class="flex w-64 min-w-0 shrink-0 flex-col border-r border-border" aria-label={fixture.files}>
        <Show when={props.files} fallback={<p class="p-2 text-xs text-muted-foreground">{fixture.empty}</p>}>
          {props.files}
        </Show>
      </div>
      <div class="flex min-h-0 min-w-0 flex-1 flex-col">
        <div class="min-h-0 flex-1" aria-label={fixture.editor}>
          <Show when={props.editor} fallback={<p class="p-2 text-xs text-muted-foreground">{fixture.empty}</p>}>
            {props.editor}
          </Show>
        </div>
        <div class="h-40 shrink-0 border-t border-border" aria-label={fixture.terminal}>
          <Show when={props.terminal} fallback={<p class="p-2 text-xs text-muted-foreground">{fixture.empty}</p>}>
            {props.terminal}
          </Show>
        </div>
      </div>
      <div class="flex w-80 min-w-0 shrink-0 flex-col border-l border-border" aria-label={fixture.agent}>
        <Show when={props.agent} fallback={<p class="p-2 text-xs text-muted-foreground">{fixture.empty}</p>}>
          {props.agent}
        </Show>
      </div>
    </div>
  );
}
