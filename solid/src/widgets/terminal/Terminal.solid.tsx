import { FitAddon } from "@xterm/addon-fit";
import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { onCleanup, onMount, type JSX } from "solid-js";
import { Block } from "@/ui/block/block.solid";
import { Box } from "@/ui/box/box.solid";
import { Title } from "@/ui/title/title.solid";
import { fixture } from "./fixture.shared";

export type TerminalProps = {
  title?: string;
  lines?: string[];
  onSubmit?: (line: string) => void;
};

export function Terminal(props: TerminalProps): JSX.Element {
  let host: HTMLDivElement | undefined;
  const title = () => props.title ?? fixture.title;

  onMount(() => {
    const term = new XTerm({ convertEol: true, fontSize: 13, cursorBlink: false });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(host!);
    for (const line of props.lines ?? fixture.lines) term.writeln(line);
    fit.fit();

    let draft = "";
    term.onData((data) => {
      if (data === "\r") {
        term.write("\r\n");
        const line = draft;
        draft = "";
        if (line) props.onSubmit?.(line);
        return;
      }
      if (data === "\u007f") {
        if (!draft) return;
        draft = draft.slice(0, -1);
        term.write("\b \b");
        return;
      }
      if (data < " " || data.startsWith("\u001b")) return;
      draft += data;
      term.write(data);
    });

    onCleanup(() => term.dispose());
  });

  return (
    <Block tag="section" class="flex h-full min-h-0 flex-col bg-card" data-surface="terminal" aria-label={title()}>
      <Box class="flex h-8 shrink-0 items-center border-b border-border px-2">
        <Title as="h2" class="text-xs font-medium">
          {title()}
        </Title>
      </Box>
      {/* xterm owns this node. Kit Box does not forward ref. */}
      <div ref={host} class="min-h-0 flex-1" />
    </Block>
  );
}
