import { createSignal, type JSX } from "solid-js";
import { fixture } from "./fixture.shared";

export type BrowserProps = {
  title?: string;
  url?: string;
  note?: string;
  onNavigate?: (url: string) => void;
};

export function Browser(props: BrowserProps): JSX.Element {
  const [url, setUrl] = createSignal(props.url ?? fixture.url);
  const [loaded, setLoaded] = createSignal(props.url ?? fixture.url);
  const title = () => props.title ?? fixture.title;

  const go = () => {
    const next = url().trim() || fixture.url;
    setUrl(next);
    setLoaded(next);
    props.onNavigate?.(next);
  };

  return (
    <section class="flex h-full min-h-0 flex-col bg-card" data-surface="browser" aria-label={title()}>
      <div class="flex h-8 shrink-0 items-center border-b border-border px-2 text-xs font-medium">{title()}</div>
      <form
        class="flex gap-2 border-b border-border p-2"
        onSubmit={(event) => {
          event.preventDefault();
          go();
        }}
      >
        <input
          type="url"
          class="h-8 min-w-0 flex-1 bg-background px-2 text-xs"
          aria-label="Browse URL"
          value={url()}
          onInput={(event) => setUrl(event.currentTarget.value)}
        />
        <button type="submit" class="h-8 px-2 text-xs">
          Go
        </button>
      </form>
      <div class="min-h-0 flex-1 p-4 text-sm" role="region" aria-label="Browse preview">
        <p>{props.note ?? fixture.note}</p>
        <p class="text-muted-foreground">{loaded()}</p>
      </div>
    </section>
  );
}
