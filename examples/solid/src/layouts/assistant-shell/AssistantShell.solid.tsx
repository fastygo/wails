import { Show, type JSX } from "solid-js";
import { fixture } from "./fixture.shared";

export type AssistantShellProps = {
  title?: string;
  chat?: JSX.Element;
  browse?: JSX.Element;
};

export function AssistantShell(props: AssistantShellProps): JSX.Element {
  const title = () => props.title ?? fixture.title;
  return (
    <div class="flex h-full min-h-0 min-w-0 flex-col" data-surface="assistant-shell">
      <header class="flex h-8 shrink-0 items-center border-b border-border px-2 text-xs font-medium">{title()}</header>
      <div class="flex min-h-0 flex-1">
        <div class="min-w-0 flex-1 border-r border-border" aria-label={fixture.chat}>
          <Show when={props.chat} fallback={<p class="p-2 text-xs text-muted-foreground">{fixture.empty}</p>}>
            {props.chat}
          </Show>
        </div>
        <div class="min-w-0 flex-1" aria-label={fixture.browse}>
          <Show when={props.browse} fallback={<p class="p-2 text-xs text-muted-foreground">{fixture.empty}</p>}>
            {props.browse}
          </Show>
        </div>
      </div>
    </div>
  );
}
