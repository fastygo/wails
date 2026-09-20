import { For, Show, createEffect, createSignal, type JSX } from "solid-js";
import { Block } from "@/ui/block/block.solid";
import { Box } from "@/ui/box/box.solid";
import { Button } from "@/ui/button/button.solid";
import { Icon } from "@/ui/icon/icon.solid";
import { Input } from "@/ui/input/input.solid";
import { List, ListItem } from "@/ui/list/list.solid";
import { Text } from "@/ui/text/text.solid";
import { Title } from "@/ui/title/title.solid";
import { fixture, type TreeNode } from "./fixture.shared";

export type SearchHit = { path: string; line?: number; preview?: string };

export type ExplorerProps = {
  label?: string;
  empty?: string;
  nodes?: TreeNode[];
  selected?: string;
  hits?: SearchHit[];
  git?: string;
  onOpen?: (path: string) => void;
  onOpenFolder?: () => void;
  onSearch?: (query: string) => void;
};

function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return nodes;
  const keep = (node: TreeNode): TreeNode | null => {
    const kids = (node.children ?? []).map(keep).filter((child): child is TreeNode => child !== null);
    if (node.name.toLowerCase().includes(needle) || kids.length > 0) {
      return { ...node, children: kids.length ? kids : node.children };
    }
    return null;
  };
  return nodes.map(keep).filter((node): node is TreeNode => node !== null);
}

export function Explorer(props: ExplorerProps): JSX.Element {
  const [query, setQuery] = createSignal("");
  const nodes = () => filterTree(props.nodes ?? fixture.nodes, query());
  const selected = () => props.selected ?? fixture.selected;
  const label = () => props.label ?? fixture.label;
  const empty = () => props.empty ?? "Open a folder.";
  const hits = () => props.hits ?? [];

  return (
    <Block tag="aside" class="flex h-full min-h-0 min-w-0 flex-col bg-card" aria-label={label()} data-surface="explorer">
      <Box class="flex h-8 shrink-0 items-center border-b border-border px-2">
        <Title as="h2" class="min-w-0 truncate text-xs font-medium">
          {label()}
        </Title>
      </Box>
      <Box class="border-b border-border p-2">
        <Input
          class="h-7 text-xs"
          value={query()}
          placeholder="Search"
          aria-label="Search"
          onInput={(event) => {
            const next = event.currentTarget.value;
            setQuery(next);
            props.onSearch?.(next);
          }}
        />
      </Box>
      <Show when={hits().length > 0}>
        <List tag="ul" class="m-0 max-h-40 list-none overflow-auto border-b border-border p-0">
          <For each={hits()}>
            {(hit) => (
              <ListItem tag="li" class="m-0 list-none">
                <Button
                  type="button"
                  variant="ghost"
                  class="h-auto w-full justify-start px-2 py-1 text-left text-xs"
                  onClick={() => props.onOpen?.(hit.path)}
                >
                  <Text class="truncate">{hit.path}{hit.line ? `:${hit.line}` : ""}</Text>
                </Button>
              </ListItem>
            )}
          </For>
        </List>
      </Show>
      <Show when={nodes().length > 0} fallback={<Text class="min-h-0 flex-1 p-2 text-xs text-muted-foreground">{empty()}</Text>}>
        <List tag="ul" class="m-0 min-h-0 flex-1 list-none overflow-auto p-0">
          <For each={nodes()}>
            {(node) => <Branch node={node} depth={0} selected={selected()} onOpen={props.onOpen} />}
          </For>
        </List>
      </Show>
      <Box class="flex h-8 shrink-0 items-center gap-2 border-t border-border px-2">
        <Show when={props.onOpenFolder}>
          <Button type="button" variant="ghost" size="sm" class="h-7 px-2 text-xs" onClick={() => props.onOpenFolder?.()}>
            Open Folder
          </Button>
        </Show>
        <Show when={props.git}>
          <Text class="ml-auto truncate text-xs text-muted-foreground">{props.git}</Text>
        </Show>
      </Box>
    </Block>
  );
}

function Branch(props: {
  node: TreeNode;
  depth: number;
  selected: string;
  onOpen?: (path: string) => void;
}): JSX.Element {
  const kids = () => props.node.children ?? [];
  const [open, setOpen] = createSignal(props.depth < 1);
  createEffect(() => {
    if (props.node.dir && props.selected.startsWith(`${props.node.path}/`)) setOpen(true);
  });

  return (
    <ListItem tag="li" class="m-0 list-none">
      <Button
        type="button"
        variant="ghost"
        class="h-6 w-full justify-start gap-2 px-2 text-xs"
        style={{ "padding-left": `${8 + props.depth * 16}px` }}
        aria-current={!props.node.dir && props.selected === props.node.path ? "page" : undefined}
        aria-expanded={props.node.dir ? open() : undefined}
        onClick={() => {
          if (props.node.dir) setOpen((value) => !value);
          else props.onOpen?.(props.node.path);
        }}
      >
        <Icon type="svg" href={`/icons.svg#${props.node.dir ? (open() ? "chevron-down" : "chevron-right") : "file"}`} size="xs" />
        {props.node.name}
      </Button>
      <Show when={props.node.dir && open() && kids().length > 0}>
        <List tag="ul" class="m-0 list-none p-0">
          <For each={kids()}>
            {(child) => (
              <Branch node={child} depth={props.depth + 1} selected={props.selected} onOpen={props.onOpen} />
            )}
          </For>
        </List>
      </Show>
    </ListItem>
  );
}
