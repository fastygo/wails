# wails

https://github.com/fastygo/wails.git

Desktop host BFF, plus UI screens installed by `ui8kit`. Screens do not import the host. The same item names will exist for each runtime.

| Path | Role |
| --- | --- |
| `fixtures/` | Runtime-neutral sample data. One JSON file per item. |
| `solid/` | Solid package. Source, `registry.json`, and built `solid/r`. |
| `svelte/`, `react/`, `vue/` | Same item names, later. Not in this tree yet. |

Items: `explorer`, `editor`, `terminal`, `agent-chat`, `browser`, `workshop-shell`, `assistant-shell`.

A shell takes panels as props. A widget renders its fixture until the app passes data. Copy, menus, and the host client stay in the IDE starter, not in these files.

Build the digest from the repo root:

```bash
ui8kit build solid/registry.json -o solid/r
```

Install one item from a pinned commit:

```bash
bunx ui8kit add explorer \
  --registry-url https://raw.githubusercontent.com/fastygo/wails/<sha>/solid/r \
  --strict-cdn \
  --runtime solid
```

`--runtime solid` keeps `*.solid.tsx` and `*.shared.ts`. Fixture modules use the `.shared.ts` suffix for that reason.

## Example

`examples/solid` is a normal Vite app. Screens are not copied by hand. From that folder:

```bash
bun install
bunx ui8kit@2.0.1 init --yes --framework solid --runtime solid --dir src --skip-core \
  --registry-url https://raw.githubusercontent.com/fastygo/wails/refs/heads/main/solid/r \
  --strict-cdn
bunx ui8kit@2.0.1 add --all --runtime solid --force \
  --registry-url https://raw.githubusercontent.com/fastygo/wails/refs/heads/main/solid/r \
  --strict-cdn
bun run build
```
