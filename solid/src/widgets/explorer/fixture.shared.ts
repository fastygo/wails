export type TreeNode = {
  name: string;
  path: string;
  dir: boolean;
  children?: TreeNode[];
};

/** Same data as fixtures/explorer.json. Kept as .shared.ts so --runtime solid installs it. */
export const fixture = {
  label: "Files",
  selected: "src/main.go",
  nodes: [
    {
      name: "src",
      path: "src",
      dir: true,
      children: [{ name: "main.go", path: "src/main.go", dir: false }],
    },
    { name: "README.md", path: "README.md", dir: false },
  ] as TreeNode[],
};
