# Componentlook

Componentlook is a static analysis toolkit for identifying how components are written in React and Vue codebases. It is designed for teams that maintain mixed frontend stacks and need a fast way to inventory component styles before migration, refactoring, code review, or architectural cleanup.

The project currently detects common React and Vue component authoring patterns and reports the files where each pattern appears.

## What It Detects

### React

- Function components: files that contain JSX elements or self-closing JSX elements.
- Class components: classes that extend `React.Component`, `React.PureComponent`, `Component`, or `PureComponent`, plus classes with a `render` method.

### Vue

- Options API: object-literal components that use options such as `data`, `methods`, `computed`, or `watch`.
- Composition API: code that uses Composition API signals such as `setup`, `ref`, `reactive`, `computed`, or `watch`.
- Class API: Vue class components that use `@Component` or extend `Vue`.
- Vue JSX / TSX: render methods or function expressions that return JSX.

## Use Cases

- Audit a repository before migrating from class components to function components.
- Find Vue Options API files before moving toward Composition API.
- Measure how much JSX / TSX is used in Vue projects.
- Build reports for technical debt cleanup, framework upgrades, and style-guide enforcement.
- Support codemod planning by grouping files by component style.

## Packages

```text
componentlook/
|-- packages/core/      # CLI and scanner library
|-- packages/web/       # Svelte/Vite demo site
`-- packages/core/fixtures/
    |-- react/          # React fixture project
    `-- vue/            # Vue fixture project
```

## Installation

Use the published CLI globally:

```bash
npm install -g componentlook
```

Or install it in a project:

```bash
pnpm add -D componentlook
```

## CLI Usage

Run the scanner from the workspace root of the project you want to inspect. The target project should have both `package.json` and `tsconfig.json`.

```bash
componentlook src/index.tsx
```

Use a custom TypeScript config when needed:

```bash
componentlook src/index.tsx --tsconfig ./tsconfig.app.json
```

Example output:

```text
React Function Component(2):
/path/to/project/src/head.tsx
/path/to/project/src/foot.tsx

React Class Component(1):
/path/to/project/src/index.tsx
```

## Programmatic API

```js
import { projectScanner, convertResult } from "componentlook";

const resultMap = await projectScanner(["src/index.tsx"]);
const report = convertResult(resultMap);

console.log(report.reactFunctionFileList);
console.log(report.vueCompositionFileList);
```

For lightweight single-file or pre-compiled use cases, see the `componentlook/slim` export.

## Local Development

Install dependencies:

```bash
pnpm install
```

Run core tests:

```bash
pnpm --filter componentlook test
```

Run the demo site:

```bash
pnpm --filter @componentlook/web dev
```

Build the demo site:

```bash
pnpm --filter @componentlook/web build
```

## Current Limitations

- Detection is syntax-based and intentionally lightweight. It does not perform full semantic type analysis for every framework alias.
- Some Vue class component patterns can vary by decorator library and may require additional rules.
- React function component detection is JSX-oriented, so non-JSX factories may not be classified as function components.
- A file is currently grouped by the first matching component style discovered during traversal.

## Roadmap Ideas

- Add JSON output for CI and dashboard integrations.
- Add confidence levels for ambiguous detections.
- Expand React detection to support memo, forwardRef, and typed function component aliases.
- Expand Vue detection for `<script setup>` and additional macro patterns.
- Add repository-wide summary statistics and trend reports.

## License

MIT. See the `license` field in `packages/core/package.json`.
