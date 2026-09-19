import { createSignal } from "solid-js";
import { AgentChat } from "./widgets/agent-chat/AgentChat.solid";
import { AssistantShell } from "./layouts/assistant-shell/AssistantShell.solid";
import { Browser } from "./widgets/browser/Browser.solid";
import { Editor } from "./widgets/editor/Editor.solid";
import { Explorer } from "./widgets/explorer/Explorer.solid";
import { Terminal } from "./widgets/terminal/Terminal.solid";
import { WorkshopShell } from "./layouts/workshop-shell/WorkshopShell.solid";

export function App() {
  const [screen, setScreen] = createSignal<"workshop" | "assistant">("workshop");

  return (
    <div class="flex h-full min-h-0 flex-col">
      <div class="flex h-8 shrink-0 items-center gap-2 border-b border-border px-2">
        <button type="button" class="text-xs" onClick={() => setScreen("workshop")}>
          Workshop
        </button>
        <button type="button" class="text-xs" onClick={() => setScreen("assistant")}>
          Assistant
        </button>
      </div>
      <div class="min-h-0 flex-1">
        {screen() === "workshop" ? (
          <WorkshopShell
            files={<Explorer />}
            editor={<Editor />}
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
