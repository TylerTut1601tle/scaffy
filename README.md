# scaffy

> Opinionated project scaffolding CLI that generates boilerplate from composable template modules.

---

## Installation

```bash
npm install -g scaffy
```

## Usage

Run the interactive scaffolder in any directory:

```bash
scaffy init
```

Compose multiple template modules to generate your project structure:

```bash
scaffy init --modules typescript,eslint,jest,github-actions --name my-app
```

Scaffy will prompt you for any missing options and write the generated boilerplate into your project directory.

### Available Modules

| Module           | Description                          |
|------------------|--------------------------------------|
| `typescript`     | tsconfig, type definitions           |
| `eslint`         | ESLint config with sensible defaults |
| `jest`           | Jest setup with ts-jest              |
| `github-actions` | CI/CD workflow templates             |
| `prettier`       | Prettier config and ignore file      |

### Example Output

```
my-app/
├── src/
│   └── index.ts
├── .eslintrc.js
├── jest.config.ts
├── tsconfig.json
└── .github/
    └── workflows/
        └── ci.yml
```

## Requirements

- Node.js >= 18
- npm >= 9

## License

[MIT](./LICENSE)