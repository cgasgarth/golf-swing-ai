# Repository Agent Rules

## Manager And Worker Model

- The parent Codex agent is the engineering manager for this repository.
- The parent Codex agent must NOT directly run repo/product/GitHub-management commands or edit repo files, except to:
    - Invoke or steer OpenCode Gemma sessions.
    - Install or provision system dependencies.
    - Manually test or review in browser/Chrome.
- All repo edits, GitHub labels/issues/milestones/branch protection/PR work, app implementation, tests, and docs MUST be performed by OpenCode sessions using `cerebras/gemma-4-31b`.
- If an action cannot technically be performed by OpenCode, the manager must ask the user for permission before doing it directly, unless it is system dependency provisioning or browser/manual testing.
- Product implementation work must go through OpenCode sessions using `cerebras/gemma-4-31b`.
- Codex-native subagents must not be used for Gemma implementation work unless they can run `gemma-4-31b` directly without ChatGPT-account model restrictions.
- Treat every OpenCode session running `cerebras/gemma-4-31b` as the Gemma subagent mechanism for this project.

## OpenCode Gemma Sessions

- Use `opencode run --model cerebras/gemma-4-31b ...` for delegated Gemma work.
- Keep prompts scoped, concrete, and explicit about owned files or responsibilities.
- Tell each OpenCode worker that other workers may be active and that it must not revert unrelated changes.
- For substantial work, keep at least two independent Gemma workstreams active whenever practical.
- Workers must report changed files, commands run, verification results, and remaining risks.

## Branch And PR Workflow

- Do not commit directly to `main`.
- All product changes must land through a feature branch and pull request.
- The precommit hook must reject commits on `main`.
- GitHub branch protection must require PR review and passing checks before merge.
- Use GitHub issues and milestones to track planned work, implementation slices, and verification tasks.

## Quality Gates

- Use Bun for dependency installation, scripts, tests, and local development.
- Keep TypeScript strict and React linting enabled.
- Keep source files at or below 600 lines.
- Keep code nesting at two levels or less unless a documented exception is approved in review.
- Precommit must run linting, typechecking, tests, file length checks, nesting checks, and branch protection checks.
- Unit test coverage must stay at or above 60%.
- E2E coverage must exist for the core login, upload, analysis, and tips/drills workflows.

## Product Direction

- Build a multi-user golf swing analysis app.
- Use username/password login and SQLite for the initial persistence layer.
- Support swing video upload, automatic swing phase tagging, body tracking, club tracking, angle metrics, and TrackMan-like analysis views.
- Generate suggested drills and swing tips through the app server with Gemma-backed AI calls where available.
- Generate and refine UI mockups before implementing major UI surfaces.

## Goal Interpretation

- The active project goal still applies.
- The active working window runs until June 29, 2026 at 12:00 PM America/Chicago.
- Do not stop at a merely complete first pass before that cutoff.
- If the requested core app, repo workflow, and GitHub setup are finished before the cutoff, keep finding and building valuable improvements: stronger tests, better UX, richer swing analysis, cleaner architecture, better documentation, improved automation, issue hygiene, performance, accessibility, and demo polish.
- Use the free `gemma-4-31b` Cerebras capacity aggressively but responsibly during the working window.
- Because Codex-native subagents cannot currently run `gemma-4-31b` under the ChatGPT-account model gate, references to Gemma subagents in this repo mean OpenCode sessions using `cerebras/gemma-4-31b`.
- If Codex-native Gemma subagents become available later, update this file before switching worker mechanisms.
