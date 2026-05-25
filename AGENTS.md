# AGENTS.md

## Project Purpose

Componentlook detects React and Vue component writing styles in existing frontend codebases. The main goal is to help maintainers understand whether a repository uses React function/class components and which Vue styles are present: Options API, Composition API, Class API, and Vue JSX / TSX.

## Repository Layout

- `packages/core/`: scanner library, CLI entrypoint, AST pattern rules, TypeScript host helpers, and tests.
- `packages/core/src/pattern/react/`: React style detectors.
- `packages/core/src/pattern/vue/`: Vue style detectors.
- `packages/core/tests/`: focused detector and project-scanner tests.
- `packages/core/fixtures/`: sample React and Vue projects used by tests.
- `packages/web/`: Svelte + Vite demo site for trying the scanner in a browser.

## Development Commands

Run from the repository root unless noted otherwise.

```bash
pnpm install
pnpm --filter componentlook test
pnpm --filter @componentlook/web dev
pnpm --filter @componentlook/web build
```

## Implementation Notes

- The core package is ESM (`"type": "module"`). Use `import` / `export` syntax.
- Detector rules should stay small and focused. Add or update tests in `packages/core/tests/` whenever detector behavior changes.
- Prefer adding fixture files under `packages/core/fixtures/` for new framework patterns instead of testing only synthetic AST nodes.
- The scanner expects a target project to have `package.json` and `tsconfig.json` unless callers pass explicit options.
- Preserve the current public exports from `packages/core/src/index.js` unless a breaking change is intentional.

## Detection Scope

React detectors currently cover:

- JSX-based function components.
- Class components that extend React component base classes or define a `render` method.

Vue detectors currently cover:

- Options API object patterns.
- Composition API usage signals.
- Class API decorators and Vue inheritance.
- JSX / TSX returned from render-style functions.

## Quality Bar

- Keep scanner output deterministic.
- Avoid broad rules that classify unrelated files as components.
- Add tests for both positive and negative examples when changing pattern detection.
- Run `pnpm --filter componentlook test` before committing core changes.
- Run `pnpm --filter @componentlook/web build` before committing demo-site changes.

## Documentation

- Update `README.md` for repository-level purpose, supported styles, and usage.
- Update `packages/core/readme.md` when CLI behavior, exports, or examples change.
