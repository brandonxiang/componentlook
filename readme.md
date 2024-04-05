# Componentlook

## The writing styles of React and Vue components

We can write React components in two ways, just as function component or class component.

In the Vue project, maybe we have several api styles, such as:

1. Vue JSX
2. Composition API
3. Option API
4. Vue Class API

There may be many different coding styles in the codebase, and we want to use tools to differentiate them and do some appropriate refactoring.

## Usage

```bash
npm i componentlook -g

componentlook --help

  Description
    find component types in your project

  Usage
    $ componentlook [options]

  Options
    --tsconfig       Specify a tsconfig file
    -v, --version    Displays current version
    -h, --help       Displays this message

  Examples
    $ componentlook my-entry
```

## Example

The tsconfig is needed in the workspace root.

```bash
# you type
componentlook fixtures/react/index.tsx

# output
#React Function Component(2):
#/Users/weipingxiang/github/componentlook/fixtures/react/head.tsx
#/Users/weipingxiang/github/componentlook/fixtures/react/foot.tsx

#React Class Component(1):
#/Users/weipingxiang/github/componentlook/fixtures/react/index.tsx

```



## License

[MIT@brandonxiang](LICENSE)