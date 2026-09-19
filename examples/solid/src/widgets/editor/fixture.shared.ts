export type EditorTab = { path: string; dirty?: boolean };

/** Same data as fixtures/editor.json. */
export const fixture = {
  tabs: [
    { path: "src/main.go", dirty: false },
    { path: "README.md", dirty: true },
  ] as EditorTab[],
  activePath: "src/main.go",
  value: "package main\n\nfunc main() {\n}\n",
};
