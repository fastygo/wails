import { javascript } from "@codemirror/lang-javascript";
import { go } from "@codemirror/lang-go";
import { markdown } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { For, Show, createSignal, onCleanup, onMount, type JSX } from "solid-js";
import { basicSetup } from "codemirror";
import { Block } from "@/ui/block/block.solid";
import { Box } from "@/ui/box/box.solid";
import { Button } from "@/ui/button/button.solid";
import { fixture, type EditorTab } from "./fixture.shared";

export type EditorProps = {
  tabs?: EditorTab[];
  activePath?: string;
  value?: string;
  onSelect?: (path: string) => void;
  onChange?: (value: string) => void;
};

function languageFor(path: string) {
  if (path.endsWith(".md")) return markdown();
  if (path.endsWith(".go")) return go();
  return javascript();
}

function CodeSurface(props: { path: string; value: string; onChange?: (value: string) => void }): JSX.Element {
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
          }),
        ],
      }),
    });
    onCleanup(() => view.destroy());
  });

  // CodeMirror owns this node. Kit Box does not forward ref.
  return <div ref={host} class="h-full min-h-0" aria-label="Editor buffer" />;
}

export function Editor(props: EditorProps): JSX.Element {
  const tabs = () => props.tabs ?? fixture.tabs;
  const [active, setActive] = createSignal(props.activePath ?? fixture.activePath);
  const [value, setValue] = createSignal(props.value ?? fixture.value);
  const label = (path: string) => path.split("/").pop() || path;

  return (
    <Block tag="section" class="flex h-full min-h-0 min-w-0 flex-col bg-background" data-surface="editor" aria-label="Editor">
      <Box class="flex h-8 shrink-0 overflow-x-auto border-b border-border bg-card" role="tablist">
        <For each={tabs()}>
          {(tab) => (
            <Button
              type="button"
              variant="ghost"
              role="tab"
              aria-selected={active() === tab.path}
              class={`h-8 rounded-none border-r border-border px-2 text-xs ${active() === tab.path ? "bg-background" : ""}`}
              onClick={() => {
                setActive(tab.path);
                props.onSelect?.(tab.path);
              }}
            >
              {label(tab.path)}
              <Show when={tab.dirty}>
                <span class="text-primary"> *</span>
              </Show>
            </Button>
          )}
        </For>
      </Box>
      <Box class="min-h-0 flex-1">
        <Show when={active()} keyed>
          {(path) => (
            <CodeSurface
              path={path}
              value={value()}
              onChange={(next) => {
                setValue(next);
                props.onChange?.(next);
              }}
            />
          )}
        </Show>
      </Box>
    </Block>
  );
}
