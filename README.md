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

## Environment Variables
Create a `.env` file or export the following:
- `CEREBRAS_API_KEY`: Your API key for AI swing tips.

## Running the Application

### Frontend (Vite)
```bash
bun run dev
```
The app will be available at the URL shown in the terminal.

### Backend (Bun HTTP Server)
```bash
bun run server/http.ts
```
The server will start on `http://localhost:3000`.

## Scripts
- `bun run dev`: Start development server
- `bun run build`: Build for production
- `bun run lint`: Run ESLint
- `bun run typecheck`: Run TypeScript type checking
- `bun run test`: Run unit tests
- `bun run coverage`: Run tests with coverage report
- `bun run e2e`: Run Playwright E2E tests
- `bun run verify`: Run all quality gates (lint, typecheck, test, coverage, complexity)

## PR Workflow
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Implement changes and ensure they follow quality gates.
3. Run verification: `bun run verify`
4. Push to remote and open a Pull Request to `main`.
5. PRs require review and passing checks before merging.

## Quality Gates
- No direct commits to `main`.
- Linting and Typechecking must pass.
- Unit test coverage >= 60%.
- Max file length: 600 lines.
- Max nesting level: 2.
