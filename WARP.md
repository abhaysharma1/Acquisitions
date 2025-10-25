# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Node.js (ESM) Express 5 API using Drizzle ORM with Neon Postgres.
- Path aliases are configured via package.json "imports" using the #prefix (e.g., #config/logger.js).
- Logging via Winston to console (non-prod) and files under logs/.
- Validation with Zod; authentication utilities using jsonwebtoken and bcrypt.

Required environment variables (define in .env; do not commit secrets)
- PORT, NODE_ENV, LOG_LEVEL
- DATABASE_URL (Neon Postgres connection string)
- JWT_SECRET

Common commands
- Install dependencies
```bash path=null start=null
npm ci
```
- Start (production-like)
```bash path=null start=null
npm run start
```
- Start in watch mode (development)
```bash path=null start=null
npm run dev
```
- Lint and fix
```bash path=null start=null
npm run lint
npm run lint:fix
```
- Format and check formatting
```bash path=null start=null
npm run format
npm run format:check
```
- Database migrations (Drizzle)
```bash path=null start=null
# Generate SQL from models (requires DATABASE_URL)
npm run db:generate
# Apply migrations to the database
npm run db:migrate
# Explore schema/data locally
npm run db:studio
```
- Tests
```text path=null start=null
No test script is configured in package.json.
```

Quick verification
- Health check: GET /health returns { status, timestamp, uptime }.
- Base API: GET /api returns a simple running message.
- Auth: POST /api/auth/sign-up with { name, email, password, role? } creates a user and sets a JWT cookie.

High-level architecture
- Entry point: src/index.js loads dotenv and boots src/server.js, which binds Express on PORT.
- HTTP server: src/app.js wires middleware (helmet, cors, parsers, cookie-parser, morgan->Winston), health endpoints, and mounts feature routes.
- Feature module pattern (Auth example):
  - Route: src/routes/auth.routes.js defines endpoints.
  - Controller: src/controllers/auth.controller.js validates with Zod, orchestrates service calls, signs JWT, sets cookie, and shapes responses; logs via Winston.
  - Service: src/services/auth.service.js contains business logic; interacts with the database through Drizzle; hashes passwords with bcrypt.
  - Model/Schema: src/models/user.models.js defines the users table via drizzle-orm/pg-core.
  - Utilities: src/utils/jwt.js (sign/verify), src/utils/cookies.js (cookie helpers), src/utils/format.js (validation error formatting).
- Data access: src/config/database.js creates a Neon HTTP client and Drizzle instance; drizzle.config.js controls codegen/migration output to drizzle/.
- Logging: src/config/logger.js configures Winston (JSON files, colored console in non-production). Morgan writes HTTP logs to Winston.
- Path resolution: package.json imports map enables #namespace/* aliases resolved by Node.

Conventions and tooling
- ESM only ("type": "module"); use import/export.
- ESLint (eslint.config.js) enforces 2-space indent, LF line endings, single quotes, no-unused-vars, etc.; ignores node_modules, coverage, logs, drizzle.
- Prettier configured via .prettierrc (LF endOfLine). On Windows, ensure your editor uses LF to satisfy lint rules.

Notes for future changes
- If you add new feature areas, mirror the Auth module layout: routes -> controllers -> services -> models/utils.
- When introducing tests, add a test runner (e.g., Jest or Vitest) and corresponding npm scripts so single-test runs are possible (e.g., npm test -- <pattern>), then update this file.
