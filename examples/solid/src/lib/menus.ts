export type MenuId = "workshop" | "assistant" | "open";

export const menus: { id: MenuId; label: "workshop" | "assistant" | "open" }[] = [
  { id: "workshop", label: "workshop" },
  { id: "assistant", label: "assistant" },
  { id: "open", label: "open" },
];
