import { For, Show, type JSX } from "solid-js";
import { Block } from "@/ui/block/block.solid";
import { Box } from "@/ui/box/box.solid";
import { Button } from "@/ui/button/button.solid";
import { Icon } from "@/ui/icon/icon.solid";
import { Text } from "@/ui/text/text.solid";
import { Textarea } from "@/ui/textarea/textarea.solid";
import { fixture, type GitFile, type GitSnapshot } from "./fixture.shared";

export type GitProps = {
  title?: string;
  snapshot?: GitSnapshot | null;
  message?: string;
  error?: string;
  empty?: string;
  onMessage?: (value: string) => void;
  onOpen?: (path: string) => void;
  onRefresh?: () => void;
  onStage?: (path: string) => void;
  onStageAll?: () => void;
  onUnstage?: (path: string) => void;
  onCommit?: () => void;
  onFetch?: () => void;
  onPull?: () => void;
  onPush?: () => void;
};

export function Git(props: GitProps): JSX.Element {
  const snapshot = () => (props.snapshot === undefined ? fixture.snapshot : props.snapshot);
  const files = () => snapshot()?.files ?? [];
  const staged = () => files().filter((file) => file.index && file.index !== " " && file.index !== "?");
  const changed = () => files().filter((file) => file.worktree && file.worktree !== " ");
  const title = () => snapshot()?.branch || props.title || fixture.title;
  const canCommit = () => Boolean(props.message?.trim() && staged().length);

  return (
    <Block tag="aside" class="flex h-full min-h-0 min-w-0 flex-col bg-card" data-surface="git" aria-label={title()}>
      <Box class="flex h-8 shrink-0 items-center justify-between gap-2 border-b border-border px-2">
        <Text class="min-w-0 truncate text-xs">
          <Icon type="svg" href="/icons.svg#git" /> {title()}
        </Text>
        <Show when={props.onRefresh}>
          <Button type="button" variant="ghost" class="h-8 w-8" aria-label="Refresh" onClick={() => props.onRefresh?.()}>
            <Icon type="svg" href="/icons.svg#refresh" />
          </Button>
        </Show>
      </Box>
      <Box class="flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2">
        <Show when={snapshot()} fallback={<Text class="text-xs text-muted-foreground">{props.empty ?? "Open a Git repository to manage changes."}</Text>}>
          <Show when={snapshot()?.upstream}>
            <Text class="text-xs text-muted-foreground">
              {snapshot()?.upstream} · +{snapshot()?.ahead ?? 0} · -{snapshot()?.behind ?? 0}
            </Text>
          </Show>
          <Show when={props.error}>
            <Text role="alert" class="text-xs text-destructive">
              {props.error}
            </Text>
          </Show>
          <Show when={props.onFetch || props.onPull || props.onPush}>
            <Box class="flex flex-wrap gap-2">
              <Show when={props.onFetch}>
                <Button type="button" variant="outline" size="sm" onClick={() => props.onFetch?.()}>
                  Fetch
                </Button>
              </Show>
              <Show when={props.onPull}>
                <Button type="button" variant="outline" size="sm" onClick={() => props.onPull?.()}>
                  Pull
                </Button>
              </Show>
              <Show when={props.onPush}>
                <Button type="button" variant="outline" size="sm" onClick={() => props.onPush?.()}>
                  <Icon type="svg" href="/icons.svg#send" /> Push
                </Button>
              </Show>
            </Box>
          </Show>
          <Show when={props.onCommit}>
            <Textarea
              class="min-h-20 resize-y text-xs"
              value={props.message ?? ""}
              placeholder="Commit message"
              aria-label="Commit message"
              onInput={(event) => props.onMessage?.(event.currentTarget.value)}
            />
            <Button type="button" size="sm" disabled={!canCommit()} onClick={() => props.onCommit?.()}>
              <Icon type="svg" href="/icons.svg#check" /> Commit staged changes
            </Button>
          </Show>
          <Box>
            <Box class="flex items-center justify-between gap-2 px-2 py-2">
              <Text class="text-xs font-semibold">Changes ({changed().length})</Text>
              <Show when={changed().length && props.onStageAll}>
                <Button type="button" variant="ghost" size="sm" class="h-8 px-2 text-xs" onClick={() => props.onStageAll?.()}>
                  Stage all
                </Button>
              </Show>
            </Box>
            <For each={changed()}>{(file) => <GitRow file={file} action="+" onOpen={props.onOpen} onAction={props.onStage} />}</For>
            <Show when={!changed().length}>
              <Text class="px-2 text-xs text-muted-foreground">No unstaged edits.</Text>
            </Show>
          </Box>
          <Box>
            <Text class="px-2 py-2 text-xs font-semibold">Staged Changes ({staged().length})</Text>
            <For each={staged()}>{(file) => <GitRow file={file} action="-" onOpen={props.onOpen} onAction={props.onUnstage} />}</For>
            <Show when={!staged().length}>
              <Text class="px-2 text-xs text-muted-foreground">Nothing staged yet.</Text>
            </Show>
          </Box>
          <Show when={!files().length}>
            <Text class="px-2 text-xs text-muted-foreground">Working tree clean</Text>
          </Show>
        </Show>
      </Box>
    </Block>
  );
}

function GitRow(props: { file: GitFile; action: string; onOpen?: (path: string) => void; onAction?: (path: string) => void }): JSX.Element {
  const label = () => (props.file.orig ? `${props.file.orig} → ${props.file.path}` : props.file.path);
  return (
    <Box class="flex items-center">
      <Button type="button" variant="ghost" class="h-8 min-w-0 flex-1 justify-start px-2 text-xs" title={label()} onClick={() => props.onOpen?.(props.file.path)}>
        <Icon type="svg" href="/icons.svg#file" />
        <Text class="truncate">{label()}</Text>
        <Text class="ml-auto text-muted-foreground">{props.file.kind ?? ""}</Text>
      </Button>
      <Show when={props.onAction}>
        <Button type="button" variant="ghost" class="h-8 w-8 shrink-0" aria-label={props.action} onClick={() => props.onAction?.(props.file.path)}>
          <Icon type="svg" href={props.action === "+" ? "/icons.svg#plus" : "/icons.svg#close"} />
        </Button>
      </Show>
    </Box>
  );
}
