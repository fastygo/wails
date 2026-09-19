export type HostMode = "fixture";

const files: Record<string, string> = {
  "src/main.go": "package main\n\nfunc main() {\n}\n",
  "README.md": "# Fixture\n\nNo host is connected.\n",
};

export function hostMode(): HostMode {
  return "fixture";
}

export function readText(path: string): string {
  return files[path] ?? "";
}
