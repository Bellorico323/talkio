AGENTS Guide for This Repo

Monorepo Overview
- Package manager: pnpm 9; Node >= 18
- Workspace managed by Turbo; apps live under `apps/*`, shared configs under `packages/*`
- Two main apps:
- `apps/server`: Fastify API + domain logic (DDD), Vitest tests
- `apps/web`: Vite + React app

Install And Bootstrap
- Install deps: `pnpm install`
- Ensure correct Node/pnpm versions (`package.json#engines` and `packageManager`)

Turbo Tasks
- Build all: `pnpm build` (runs `turbo run build`)
- Dev all: `pnpm dev` (runs all `dev` scripts; persistent)
- Lint all with Turbo: `pnpm lint` (delegates to each package's `lint`)
- Type check all (if defined in packages): `pnpm check-types`

App Commands
- Server (Fastify)
- Dev: `pnpm -C apps/server dev`
- Tests (see detailed section below)
- Database (Drizzle): `pnpm -C apps/server db:generate | db:migrate | db:studio`
- Web (Vite + React)
- Dev: `pnpm -C apps/web dev`
- Build: `pnpm -C apps/web build`
- Lint: `pnpm -C apps/web lint`

Testing (Vitest in apps/server)
- Config: `apps/server/vitest.config.mts` defines two projects
- `unit`: includes `**/*.spec.ts`
- `e2e`: includes `**/*.e2e-spec.ts`
- Run all tests: `pnpm -C apps/server test`
- Run unit only: `pnpm -C apps/server test:unit`
- Run e2e only: `pnpm -C apps/server test:e2e`
- Coverage: `pnpm -C apps/server coverage` (reports: text, summary, html; v8 provider)
- E2E DB setup: before e2e, `pretest:e2e` runs `dotenv -e .env.test drizzle-kit migrate`

Run A Single Test (important)
- By file (unit project):
- `pnpm -C apps/server vitest run --project unit src/shared/domain/entities/watched-list.spec.ts`
- By file (e2e project):
- `pnpm -C apps/server vitest run --project e2e src/path/to/suite.e2e-spec.ts`
- By test name pattern:
- `pnpm -C apps/server vitest run --project unit -t "partial test name"`
- Using package script passthrough (alternate):
- `pnpm -C apps/server run test -- run --project unit src/.../file.spec.ts`

Linting
- Root: `pnpm lint` uses Turbo to run each package’s `lint`
- Web: `pnpm -C apps/web lint` (ESLint flat config via `@talkio/eslint-config`)
- Server: no explicit script; you can lint with `pnpm -C apps/server exec eslint .`
- ESLint config packages:
- Base: `packages/eslint-config/base.js`
- React: `packages/eslint-config/react-internal.js`
- Next.js: `packages/eslint-config/next.js` (not currently used by apps)
- Notable rules/plugins: `typescript-eslint` recommended, `eslint-config-prettier`, `eslint-plugin-turbo` (`turbo/no-undeclared-env-vars`), `eslint-plugin-only-warn` (downgrades errors to warnings), React and hooks rules in React config

Formatting
- Root Prettier config: `"prettier": "@talkio/prettier-config"` in `package.json`
- Config file: `packages/prettier-config/index.js`
- Key options: `semi: false`, `singleQuote: true`, `trailingComma: 'es5'`, `printWidth: 80`, `tabWidth: 2`, `bracketSameLine: false`
- Plugin: `prettier-plugin-tailwindcss` (sorts Tailwind class names when present)
- Run format (root): `pnpm format` (writes `**/*.{ts,tsx,md}`)

TypeScript Settings
- Shared base: `packages/typescript-config/base.json`
- `strict: true`, `noUncheckedIndexedAccess: true`, `isolatedModules: true`, `moduleResolution: NodeNext`, `target: ES2022`
- Web extends `@talkio/typescript-config/nextjs.json` with bundler resolution and `jsx: preserve` in node tsconfig; app tsconfig sets `jsx: react-jsx`
- Server extends base and defines a path alias: `@/*` -> `src/*` (see `apps/server/tsconfig.json`)

Project Structure And Layering (Server)
- Layered by DDD:
- `domain`: entities, value objects, domain events, errors
- `application`: use cases, repositories (interfaces), subscribers
- `infra`: database schemas/repositories, controllers, websocket handlers, main server, DI/module wiring
- Keep domain/application free of infra dependencies; implement repository interfaces in `infra`
- Publish domain events via `DomainEvents`; event subscribers live under `application/subscriber` and infra handlers under `infra/domain-handlers`

Error Handling
- Prefer `Either` for use-case results: `Either<L, R>` with `left(err)` and `right(value)` from `src/shared/domain/either.ts`
- Use domain errors implementing `UseCaseError` (e.g., `NotAllowedError`, `ResourceNotFoundError`)
- In HTTP or WS handlers, map domain errors to transport responses; avoid throwing exceptions for expected flows
- Aggregate roots can raise domain events; `DomainEvents.dispatchEventsForAggregate(id)` will publish queued events

Imports And Module Boundaries
- Use ESM imports everywhere; no `require`
- Order convention (not enforced):
- Node/std libs -> external packages -> workspace packages -> absolute alias (`@/...`) -> relative (`./`, `../`)
- Server: prefer alias `@/x` over long relatives
- Web: default to relative imports; no alias configured here

Naming Conventions
- Files: kebab-case for filenames (e.g., `send-friendship-request.ts`, `resource-not-found-error.ts`)
- Tests: unit `*.spec.ts`; e2e `*.e2e-spec.ts`; colocate under the relevant module (see `application/use-cases/tests` and `src/shared/domain/...`)
- Classes and types: PascalCase (`UniqueEntityID`, `ValueObject`)
- Functions, variables: camelCase (`makeConversation`, `sendGroupMessage`)
- Constants: UPPER_SNAKE only for true constants
- Events: PascalCase class names; include `occurredAt` and `getAggregateId()` per `DomainEvent`

Testing Patterns
- Use `vitest` APIs: `describe`, `it`, `expect`, `beforeEach`, `vi`
- Unit tests mock repositories with in-memory implementations under `test/repositories/**`
- Factories live under `test/factories/**` for creating domain entities
- Keep e2e tests isolated; `pretest:e2e` migrates DB using `.env.test`

Server Runtime
- Dev uses `tsx` with `dotenv -e .env` to start `src/infra/main.ts`
- WebSocket support via Fastify WS plugin in `src/infra/websocket`
- Swagger and API reference enabled in dependencies; wire as needed in infra

Database
- Drizzle ORM with `drizzle-kit`
- Schemas under `apps/server/src/infra/database/schema` (and per-module schema folders)
- Generate: `pnpm -C apps/server db:generate`
- Migrate: `pnpm -C apps/server db:migrate`
- Studio: `pnpm -C apps/server db:studio`

Contributing Workflow For Agents
- Prefer small, focused changes per PR
- Follow layering: do not import from `infra` into `domain`/`application`
- When adding a use case, create:
- Input/output types, use-case class/function returning `Either`
- Domain errors under `application/use-cases/errors`
- Interface methods on `application/repositories/*-repository.ts`
- Infra implementation under `infra/repositories/...`
- Add unit tests under `application/use-cases/tests` with `*.spec.ts`

Cursor/Copilot Rules
- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` were found in this repo at the time of writing. If added later, reflect them here.

Quick Reference
- Install: `pnpm install`
- Dev (all): `pnpm dev`
- Dev (server): `pnpm -C apps/server dev`
- Dev (web): `pnpm -C apps/web dev`
- Build (all): `pnpm build`
- Build (web): `pnpm -C apps/web build`
- Lint (all): `pnpm lint`
- Lint (web): `pnpm -C apps/web lint`
- Test (all server): `pnpm -C apps/server test`
- Test (unit): `pnpm -C apps/server test:unit`
- Test (single file): `pnpm -C apps/server vitest run --project unit src/.../file.spec.ts`
- Test (single name): `pnpm -C apps/server vitest run --project unit -t "name"`
- Coverage: `pnpm -C apps/server coverage`

Notes
- ESLint uses `eslint-config-prettier`; formatting issues are enforced by Prettier, not ESLint
- Many ESLint rules are warnings (`only-warn`); still fix them in PRs
- Keep imports clean; avoid circular deps across domain/application/infra
- Commit messages and CI are not prescribed here; follow team norms
