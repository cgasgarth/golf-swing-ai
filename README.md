# Golf Swing AI

Multi-user golf swing analysis application.

## Tech Stack
- Runtime: Bun
- Frontend: React 19, Vite, TypeScript (Strict)
- Testing: Vitest, Playwright
- Quality: ESLint, Prettier, Husky

## Setup
```bash
bun install
```

## Scripts
- `bun run dev`: Start development server
- `bun run build`: Build for production
- `bun run lint`: Run ESLint
- `bun run typecheck`: Run TypeScript type checking
- `bun run test`: Run unit tests
- `bun run coverage`: Run tests with coverage report
- `bun run e2e`: Run Playwright E2E tests
- `bun run verify`: Run all quality gates (lint, typecheck, test, coverage, complexity)

## Quality Gates
- No direct commits to `main`.
- Linting and Typechecking must pass.
- Unit test coverage >= 60%.
- Max file length: 600 lines.
- Max nesting level: 2.
