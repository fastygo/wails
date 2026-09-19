import { For, createSignal, type JSX } from "solid-js";
import { fixture } from "./fixture.shared";

export type TerminalProps = {
  title?: string;
  lines?: string[];
  onSubmit?: (line: string) => void;
};

export function Terminal(props: TerminalProps): JSX.Element {
  const [lines, setLines] = createSignal(props.lines ?? fixture.lines);
  const [draft, setDraft] = createSignal("");
  const title = () => props.title ?? fixture.title;

  const submit = () => {
    const line = draft().trim();
    if (!line) return;
    setLines((prev) => [...prev, `$ ${line}`]);
    setDraft("");
    props.onSubmit?.(line);
  };

  return (
    <section class="flex h-full min-h-0 flex-col bg-card" data-surface="terminal" aria-label={title()}>
      <div class="flex h-8 shrink-0 items-center border-b border-border px-2 text-xs font-medium">{title()}</div>
      <pre class="m-0 min-h-0 flex-1 overflow-auto p-2 font-mono text-xs">
        <For each={lines()}>{(line) => <div>{line}</div>}</For>
      </pre>
      <form
        class="flex border-t border-border"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <input
          class="h-8 min-w-0 flex-1 bg-background px-2 font-mono text-xs"
          aria-label="Terminal input"
          value={draft()}
          onInput={(event) => setDraft(event.currentTarget.value)}
        />
      </form>
    </section>
  );
}
