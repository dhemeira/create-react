# @dhemeira/create-react

An interactive command-line interface to instantly scaffold a new project from the [@dhemeira/react-ts-starter](https://github.com/dhemeira/react-ts-starter) starter template.

Built with `@clack/prompts` for a streamlined, developer-friendly setup experience.

---

## Features

- **Zero Configuration** - Get a fully configured development workspace in seconds.
- **Multi-Package Manager Support** - Automatically detects and plays nice with `npm`, `yarn`, `pnpm`, or `bun`.
- **Customizable** - Option to automatically initialize a Git repository and pre-install dependencies.

---

## Usage

You don't need to install anything globally. Simply run the initialization command using your preferred package manager in your terminal:

### Using npm

```bash
npm create @dhemeira/react@latest
```

### Using pnpm

```bash
pnpm create @dhemeira/react@latest
```

### Using yarn

```bash
yarn create @dhemeira/react@latest
```

### Using bun

```bash
bun create @dhemeira/react@latest
```

---

## Command Line Flags

Prefer to skip the interactive prompts? You can pass your project name as a positional argument and use flags to automate the scaffolding layout:

```bash
# Example: Scaffold a project without installing dependencies or starting git
npm create @dhemeira/react@latest my-app -- --no-install --no-git
```

| Flag           | Description                                                                 |
| :------------- | :-------------------------------------------------------------------------- |
| `--no-install` | Skips running the automatic dependency installation process.                |
| `--no-git`     | Skips initializing a local Git repository and setting up the `main` branch. |

---

### License

MIT © dhemeira
