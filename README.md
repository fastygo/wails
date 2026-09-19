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

Screens import kit bricks from `@/ui/...`. Those bricks come from `@ui8kit/registry`, not from this repo. `ui8kit` 2.0.1 does not install `registryDependencies` on its own, so primitives are a separate `add`.

`fw.yaml` is the install order `fwyml` can resolve. From this repo:

```bash
fwyml validate
fwyml resolve --json
```

`quality.validators` runs as `fwyml generate` (phase `generate`), after a lock exists:

1. `ui8kit init` against `https://unpkg.com/@ui8kit/registry@2.0.0/r` (utils included; do not `--skip-core`)
2. `ui8kit add` the primitives that screens import (`block`, `box`, `button`, `icon`, `input`, `label`, `list`, `stack`, `text`, `textarea`, `title`). `add` will not install `utils`; that is init. `slot` has no Solid file.
3. Copy `src/utils` to `src/components/utils`. Bricks import `../../utils` from `components/ui`, and `ui8kit` 2.0.1 writes utils to `src/utils` instead.
4. `ui8kit add` the screens from `solid/r`

The raw screen URL in step 4 is `refs/heads/main`. It stays on the previous digest until this tree is pushed.

`--runtime solid` keeps `*.solid.tsx` and `*.shared.ts`. Fixture modules use the `.shared.ts` suffix for that reason. npm packages named on an item (`codemirror`, `@xterm/xterm`, and the rest) are installed by `ui8kit add`.

## Example

`examples/solid` is a normal Vite app. Screens are not copied by hand. After this digest is pushed, from that folder:

```bash
bun install
bunx ui8kit@2.0.1 init --yes --framework solid --runtime solid --dir src \
  --registry-url https://unpkg.com/@ui8kit/registry@2.0.0/r \
  --strict-cdn
bunx ui8kit@2.0.1 add block box button icon input label list stack text textarea title \
  --runtime solid --force \
  --registry-url https://unpkg.com/@ui8kit/registry@2.0.0/r \
  --strict-cdn
bunx ui8kit@2.0.1 add explorer editor terminal agent-chat browser workshop-shell assistant-shell \
  --runtime solid --force \
  --registry-url https://raw.githubusercontent.com/fastygo/wails/refs/heads/main/solid/r \
  --strict-cdn
cp -a src/utils src/components/utils
bun run build
```

The same sequence is `fw.yaml` → `registry/install.yaml`. Do not `--skip-core` on init, or `utils` never lands.

`src/lib` is the starter and is not installed by `ui8kit`: `copy.ts`, `menus.ts`, and `host.ts`. `App.tsx` passes those into the screens. `host.ts` stays on fixture data until a Wails binding replaces `readText`.
