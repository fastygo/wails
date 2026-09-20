import { javascript } from "@codemirror/lang-javascript";
import { go } from "@codemirror/lang-go";
import { markdown } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { For, Show, createEffect, createSignal, onCleanup, onMount, type JSX } from "solid-js";
import { basicSetup } from "codemirror";
import { Block } from "@/ui/block/block.solid";
import { Box } from "@/ui/box/box.solid";
import { Button } from "@/ui/button/button.solid";
import { Icon } from "@/ui/icon/icon.solid";
import { Text } from "@/ui/text/text.solid";
import { fixture, type EditorTab } from "./fixture.shared";

export type EditorProps = {
  tabs?: EditorTab[];
  activePath?: string;
  value?: string;
  status?: string;
  onSelect?: (path: string) => void;
  onClose?: (path: string) => void;
  onChange?: (value: string) => void;
};

function languageFor(path: string) {
  if (path.endsWith(".md")) return markdown();
  if (path.endsWith(".go")) return go();
  if (path.endsWith(".json")) return javascript();
  return javascript();
}

function languageLabel(path: string) {
  const ext = path.split(".").pop() ?? "";
  if (ext === "go") return "Go";
  if (ext === "ts" || ext === "tsx") return "TypeScript";
  if (ext === "js" || ext === "jsx") return "JavaScript";
  if (ext === "md") return "Markdown";
  return ext.toUpperCase() || "Plain text";
}

function CodeSurface(props: {
  path: string;
  value: string;
  onChange?: (value: string) => void;
  onCursor?: (line: number, column: number) => void;
}): JSX.Element {
  let host: HTMLDivElement | undefined;

  onMount(() => {
    const view = new EditorView({
      parent: host,
      state: EditorState.create({
        doc: props.value,
        extensions: [
          basicSetup,
          languageFor(props.path),
          oneDark,
          EditorView.theme({
            "&": { height: "100%" },
            ".cm-scroller": { overflow: "auto" },
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) props.onChange?.(update.state.doc.toString());
            const pos = update.state.selection.main.head;
            const line = update.state.doc.lineAt(pos);
            props.onCursor?.(line.number, pos - line.from + 1);
          }),
        ],
      }),
    });
    onCleanup(() => view.destroy());
  });

  return <div ref={host} class="h-full min-h-0" aria-label="Editor buffer" />;
}

export function Editor(props: EditorProps): JSX.Element {
  const tabs = () => props.tabs ?? fixture.tabs;
  const [active, setActive] = createSignal(props.activePath ?? fixture.activePath);
  const [value, setValue] = createSignal(props.value ?? fixture.value);
  const [cursor, setCursor] = createSignal({ line: 1, column: 1 });
  const label = (path: string) => path.split("/").pop() || path;
  createEffect(() => {
    if (props.activePath !== undefined) setActive(props.activePath);
    if (props.value !== undefined) setValue(props.value);
  });

  return (
    <Block tag="section" class="flex h-full min-h-0 min-w-0 flex-col bg-background" data-surface="editor" aria-label="Editor">
      <Box class="flex h-8 shrink-0 overflow-x-auto border-b border-border bg-card" role="tablist">
        <For each={tabs()}>
          {(tab) => (
            <Box class="flex shrink-0 items-center border-r border-border">
              <Button
                type="button"
                variant="ghost"
                role="tab"
                aria-selected={active() === tab.path}
                class={`h-8 rounded-none px-2 text-xs ${active() === tab.path ? "bg-background" : ""}`}
                onClick={() => {
                  setActive(tab.path);
                  props.onSelect?.(tab.path);
                }}
              >
                <Icon type="svg" href="/icons.svg#file" />
                {label(tab.path)}
                <Show when={tab.dirty}>
                  <span class="text-primary"> •</span>
                </Show>
              </Button>
              <Show when={props.onClose}>
                <Button type="button" variant="ghost" class="h-8 w-8 rounded-none" aria-label={`Close ${tab.path}`} onClick={() => props.onClose?.(tab.path)}>
                  <Icon type="svg" href="/icons.svg#close" size="xs" />
                </Button>
              </Show>
            </Box>
          )}
        </For>
      </Box>
      <Show when={active()}>
        <Box class="flex h-6 shrink-0 items-center border-b border-border px-2">
          <Text class="truncate text-xs text-muted-foreground">{active().replaceAll("\\", " / ").replaceAll("/", " / ")}</Text>
        </Box>
      </Show>
      <Box class="min-h-0 flex-1">
        <Show when={active()} fallback={<Text class="flex h-full items-center justify-center p-8 text-xs text-muted-foreground">Select a file</Text>} keyed>
          {(path) => (
            <CodeSurface
              path={path}
              value={value()}
              onCursor={(line, column) => setCursor({ line, column })}
              onChange={(next) => {
                setValue(next);
                props.onChange?.(next);
              }}
            />
          )}
        </Show>
      </Box>
      <Box class="flex h-6 shrink-0 items-center gap-3 border-t border-border px-2 text-xs text-muted-foreground">
        <Text class="truncate">{props.status ?? "No checks yet"}</Text>
        <Text>Ln {cursor().line} Col {cursor().column}</Text>
        <Show when={active()}>
          <Text>{languageLabel(active())}</Text>
        </Show>
      </Box>
    </Block>
  );
}
