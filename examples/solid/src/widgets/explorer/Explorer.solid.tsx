import { For, Show, createEffect, createSignal, type JSX } from "solid-js";
import { Block } from "@/ui/block/block.solid";
import { Box } from "@/ui/box/box.solid";
import { Button } from "@/ui/button/button.solid";
import { Icon } from "@/ui/icon/icon.solid";
import { List, ListItem } from "@/ui/list/list.solid";
import { Title } from "@/ui/title/title.solid";
import { fixture, type TreeNode } from "./fixture.shared";

export type ExplorerProps = {
  label?: string;
  nodes?: TreeNode[];
  selected?: string;
  onOpen?: (path: string) => void;
};

export function Explorer(props: ExplorerProps): JSX.Element {
  const nodes = () => props.nodes ?? fixture.nodes;
  const selected = () => props.selected ?? fixture.selected;
  const label = () => props.label ?? fixture.label;

  return (
    <Block
      tag="aside"
      class="flex h-full min-h-0 min-w-0 flex-col bg-card"
      aria-label={label()}
      data-surface="explorer"
    >
      <Box class="flex h-8 shrink-0 items-center border-b border-border px-2">
        <Title as="h2" class="text-xs font-medium">
          {label()}
        </Title>
      </Box>
      <List tag="ul" class="m-0 min-h-0 flex-1 list-none overflow-auto p-0">
        <For each={nodes()}>
          {(node) => <Branch node={node} depth={0} selected={selected()} onOpen={props.onOpen} />}
        </For>
      </List>
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
        <Icon type="text" size="sm" decorative>
          {props.node.dir ? (open() ? "v" : ">") : "-"}
        </Icon>
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
