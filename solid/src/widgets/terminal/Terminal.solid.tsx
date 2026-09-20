import { FitAddon } from "@xterm/addon-fit";
import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { Show, createSignal, onCleanup, onMount, type JSX } from "solid-js";
import { Block } from "@/ui/block/block.solid";
import { Box } from "@/ui/box/box.solid";
import { Button } from "@/ui/button/button.solid";
import { Text } from "@/ui/text/text.solid";
import { fixture } from "./fixture.shared";

export type TerminalSession = {
  start: (cols: number, rows: number, shell: string) => Promise<string>;
  read: (id: string) => Promise<{ data?: string; done?: boolean }>;
  input: (id: string, data: string) => Promise<void>;
  resize?: (id: string, cols: number, rows: number) => Promise<void>;
  close?: (id: string) => Promise<void>;
};

export type TerminalShell = { id: string; label: string; available?: boolean };

export type TerminalProps = {
  title?: string;
  problems?: string;
  lines?: string[];
  shells?: TerminalShell[];
  onSubmit?: (line: string) => void;
  session?: TerminalSession;
};

export function Terminal(props: TerminalProps): JSX.Element {
  let host: HTMLDivElement | undefined;
  const title = () => props.title ?? fixture.title;
  const [tab, setTab] = createSignal<"problems" | "terminal">("terminal");
  const [shell, setShell] = createSignal(props.shells?.find((item) => item.available !== false)?.id ?? "powershell");

  onMount(() => {
    const term = new XTerm({
      convertEol: true,
      fontFamily: '"Cascadia Code", Consolas, monospace',
      fontSize: 12,
      cursorBlink: true,
      scrollback: 3000,
      theme: { background: "#0b0f14", foreground: "#e6edf3", cursor: "#e6edf3" },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(host!);
    fit.fit();

    if (!props.session) {
      for (const line of props.lines ?? fixture.lines) term.writeln(line);
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
      return;
    }

    let id = "";
    let done = false;
    let polling = false;
    const session = props.session;
    const fail = (error: unknown) => term.writeln(String(error));
    void session.start(term.cols, term.rows, shell()).then((next) => {
      id = next;
    }).catch(fail);
    const input = term.onData((data) => {
      if (!id || done) return;
      void session.input(id, data).catch(fail);
    });
    const timer = setInterval(async () => {
      if (!id || polling || done) return;
      polling = true;
      try {
        const result = await session.read(id);
        if (result.data) term.write(Uint8Array.from(atob(result.data), (char) => char.charCodeAt(0)));
        if (result.done) done = true;
      } catch (error) {
        fail(error);
      } finally {
        polling = false;
      }
    }, 60);
    const observer = new ResizeObserver(() => {
      if (!host?.clientWidth || !id || done) return;
      fit.fit();
      void session.resize?.(id, term.cols, term.rows);
    });
    observer.observe(host!);
    onCleanup(() => {
      done = true;
      clearInterval(timer);
      observer.disconnect();
      input.dispose();
      if (id) void session.close?.(id);
      term.dispose();
    });
  });

  return (
    <Block tag="section" class="flex h-full min-h-0 flex-col bg-background" data-surface="terminal" aria-label={title()}>
      <Box class="flex h-8 shrink-0 items-center gap-2 border-b border-border px-2">
        <Button type="button" variant={tab() === "problems" ? "secondary" : "ghost"} size="sm" class="h-7 px-2 text-xs" aria-pressed={tab() === "problems"} onClick={() => setTab("problems")}>
          Problems
        </Button>
        <Button type="button" variant={tab() === "terminal" ? "secondary" : "ghost"} size="sm" class="h-7 px-2 text-xs" aria-pressed={tab() === "terminal"} onClick={() => setTab("terminal")}>
          {title()}
        </Button>
        <Show when={tab() === "terminal" && (props.shells?.length ?? 0) > 0}>
          <select class="h-7 border-0 bg-transparent text-xs" aria-label="Shell" value={shell()} onChange={(event) => setShell(event.currentTarget.value)}>
            {(props.shells ?? []).map((item) => (
              <option value={item.id} disabled={item.available === false}>
                {item.label}
              </option>
            ))}
          </select>
        </Show>
      </Box>
      <Show when={tab() === "problems"}>
        <Text class="min-h-0 flex-1 overflow-auto p-2 text-xs text-muted-foreground">{props.problems ?? "No checks yet."}</Text>
      </Show>
      {/* xterm owns this node. Kit Box does not forward ref. */}
      <div ref={host} class={tab() === "terminal" ? "min-h-0 flex-1 overflow-hidden" : "hidden"} />
    </Block>
  );
}
