import { createSignal } from "solid-js";
import { AgentChat } from "./widgets/agent-chat/AgentChat.solid";
import { AssistantShell } from "./layouts/assistant-shell/AssistantShell.solid";
import { Browser } from "./widgets/browser/Browser.solid";
import { Editor } from "./widgets/editor/Editor.solid";
import { Explorer } from "./widgets/explorer/Explorer.solid";
import { Terminal } from "./widgets/terminal/Terminal.solid";
import { WorkshopShell } from "./layouts/workshop-shell/WorkshopShell.solid";
import { copy } from "./lib/copy";
import { hostMode, readText } from "./lib/host";
import { menus, type MenuId } from "./lib/menus";

export function App() {
  const [screen, setScreen] = createSignal<Exclude<MenuId, "open">>("workshop");
  const [path, setPath] = createSignal("src/main.go");
  const [value, setValue] = createSignal(readText("src/main.go"));
  const [status, setStatus] = createSignal(copy.statusFixture);

  const open = (next: string) => {
    setPath(next);
    setValue(readText(next));
    setStatus(`${copy.statusOpened} ${next}`);
  };

  const onMenu = (id: MenuId) => {
    if (id === "open") {
      open(path());
      return;
    }
    setScreen(id);
  };

  return (
    <div class="flex h-full min-h-0 flex-col bg-background text-foreground">
      <header class="flex h-8 shrink-0 items-center gap-3 border-b border-border px-2">
        <span class="text-xs font-medium">{copy.product}</span>
        <nav class="flex items-center gap-2" aria-label={copy.product}>
          {menus.map((item) => (
            <button type="button" class="text-xs" onClick={() => onMenu(item.id)}>
              {copy[item.label]}
            </button>
          ))}
        </nav>
        <span class="ml-auto text-xs text-muted-foreground">{status()} · {hostMode()}</span>
      </header>
      <div class="min-h-0 flex-1">
        {screen() === "workshop" ? (
          <WorkshopShell
            files={<Explorer selected={path()} onOpen={open} />}
            editor={<Editor activePath={path()} value={value()} onSelect={open} onChange={setValue} />}
            terminal={<Terminal />}
            agent={<AgentChat />}
          />
        ) : (
          <AssistantShell chat={<AgentChat />} browse={<Browser />} />
        )}
      </div>
    </div>
  );
}
