import { For, Show, createSignal, type JSX } from "solid-js";
import { fixture, type EditorTab } from "./fixture.shared";

export type EditorProps = {
  tabs?: EditorTab[];
  activePath?: string;
  value?: string;
  onSelect?: (path: string) => void;
  onChange?: (value: string) => void;
};

export function Editor(props: EditorProps): JSX.Element {
  const tabs = () => props.tabs ?? fixture.tabs;
  const [active, setActive] = createSignal(props.activePath ?? fixture.activePath);
  const [value, setValue] = createSignal(props.value ?? fixture.value);
  const label = (path: string) => path.split("/").pop() || path;

  return (
    <section class="flex min-h-0 min-w-0 flex-1 flex-col bg-background" data-surface="editor" aria-label="Editor">
      <div class="flex h-8 shrink-0 overflow-x-auto border-b border-border bg-card" role="tablist">
        <For each={tabs()}>
          {(tab) => (
            <button
              type="button"
              role="tab"
              aria-selected={active() === tab.path}
              class={`h-8 border-r border-border px-2 text-xs ${active() === tab.path ? "bg-background" : ""}`}
              onClick={() => {
                setActive(tab.path);
                props.onSelect?.(tab.path);
              }}
            >
              {label(tab.path)}
              <Show when={tab.dirty}>
                <span class="text-primary"> *</span>
              </Show>
            </button>
          )}
        </For>
      </div>
      <textarea
        class="min-h-0 flex-1 resize-none bg-background p-2 font-mono text-sm"
        aria-label="Editor buffer"
        value={value()}
        onInput={(event) => {
          const next = event.currentTarget.value;
          setValue(next);
          props.onChange?.(next);
        }}
      />
    </section>
  );
}
