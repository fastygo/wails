export type GitFile = {
  path: string;
  orig?: string;
  index?: string;
  worktree?: string;
  kind?: string;
};

export type GitSnapshot = {
  branch?: string;
  upstream?: string;
  ahead?: number;
  behind?: number;
  files?: GitFile[];
};

export const fixture = {
  title: "Source Control",
  snapshot: {
    branch: "main",
    files: [{ path: "README.md", worktree: "M", kind: "modified" }],
  } as GitSnapshot,
};
