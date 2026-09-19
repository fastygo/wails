import { createSignal, type JSX } from "solid-js";
import { Block } from "@/ui/block/block.solid";
import { Box } from "@/ui/box/box.solid";
import { Button } from "@/ui/button/button.solid";
import { Input } from "@/ui/input/input.solid";
import { Text } from "@/ui/text/text.solid";
import { Title } from "@/ui/title/title.solid";
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
    <Block tag="section" class="flex h-full min-h-0 flex-col bg-card" data-surface="browser" aria-label={title()}>
      <Box class="flex h-8 shrink-0 items-center border-b border-border px-2">
        <Title as="h2" class="text-xs font-medium">
          {title()}
        </Title>
      </Box>
      <form
        class="flex gap-2 border-b border-border p-2"
        onSubmit={(event) => {
          event.preventDefault();
          go();
        }}
      >
        <Input
          type="url"
          class="h-8 min-w-0 flex-1 text-xs"
          aria-label="Browse URL"
          value={url()}
          onInput={(event) => setUrl(event.currentTarget.value)}
        />
        <Button type="submit" size="sm">
          Go
        </Button>
      </form>
      <Box class="min-h-0 flex-1 p-4" role="region" aria-label="Browse preview">
        <Text class="text-sm">{props.note ?? fixture.note}</Text>
        <Text class="text-sm text-muted-foreground">{loaded()}</Text>
      </Box>
    </Block>
  );
}
