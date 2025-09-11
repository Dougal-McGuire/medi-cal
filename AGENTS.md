# Repository Guidelines

## Project Structure & Module Organization
- `pages/` Next.js routes. API lives in `pages/api/` (e.g., `pages/api/calculators/bmi.js`).
- `components/ui/` Reusable UI primitives (Radix + Tailwind), lowercase filenames (e.g., `button.jsx`).
- `commons/components/` Shared composite components, PascalCase filenames (e.g., `PrintButton.js`).
- `commons/utils/` Cross-cutting utilities (e.g., `printUtils.js`).
- `lib/` Small helpers (e.g., `lib/utils.js` with `cn`).
- `styles/` Global CSS and Tailwind setup.
- `docs/` Specs and usage notes.

## Build, Test, and Development Commands
- `nvm use` Use Node 22 from `.nvmrc`.
- `npm ci` Clean, reproducible install.
- `npm run dev` Start Next.js dev server at `http://localhost:3000`.
- `npm run build` Production build (`.next/`).
- `npm start` Run the built app.
- `npm run lint` Lint with ESLint (Next.js defaults).
- `npm test` Run Node’s built-in test runner.

## Coding Style & Naming Conventions
- JavaScript/React (ES modules). Prefer function components and hooks.
- Indentation 2 spaces; aim for consistent semicolons; keep imports sorted logically.
- Filenames: UI primitives lowercase in `components/ui/`; composite/shared components PascalCase in `commons/components/`; API routes lowercase under `pages/api/`.
- Styling: Tailwind CSS; use the `cn` helper from `lib/utils.js`. Keep class lists readable.

## Testing Guidelines
- Use Node’s `node:test` for unit tests (utilities, API logic). Name tests `*.test.js` and co-locate or place in `tests/` mirroring source paths.
- Focus on validating calculation logic and API input validation. Run with `npm test` locally.

## Commit & Pull Request Guidelines
- Commits: imperative, present tense, concise (e.g., “Add BMI formula variants”, “Fix API validation”). Group related changes.
- PRs: clear description, rationale, test plan, and screenshots/GIFs for UI changes. Link issues and note any env/config updates (`.env`, `vercel.json`).

## Security & Configuration Tips
- Never commit secrets. Use `.env` (see `.env.example`).
- Node 22 is required (`.nvmrc`, `package.json.engines`). Use `npm ci` in CI.
- Avoid breaking API contracts in `pages/api/*`; if changed, update docs and frontend call sites.
