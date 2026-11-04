# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `688a7f9` · model `auto`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
HRMS portal is a two-app repository. `backend/` is a FastAPI service using SQLAlchemy 2 and Pydantic 2. It defaults to a local SQLite file (`DATABASE_URL` switches it to Postgres), creates tables from the models on startup, and uses Redis-backed bearer-token sessions. It exposes `/api/*` routes for auth, admin user management, an audit log, departments, employees, a manager's team view, and relationship-scoped timesheets, attendance, leave and projects. `frontend/` is a Vite + React 19 SPA with React Router, TanStack Query and Tailwind. It has screens for sign-in, change-password, home, timesheet, leave, profile, my team, approvals and administration. The app shell and sign-in call the API through `src/lib/api.ts`; the README says some screens still run on seeded sample data. Deployment is a GitHub Actions workflow that pushes the backend image to ECR and publishes the frontend to AWS Amplify.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Python 3.12 (the backend Dockerfile uses python:3.12-slim)
- Node.js and npm (React 19 / Vite 6 / Vitest 2 toolchain; the exact version is not pinned in the files)
- Docker with Docker Compose (optional; for local Postgres 16 and Redis 7 from docker-compose.yml, and for building the backend image)
- A running Redis instance (login sessions are Redis-backed; see troubleshooting)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. cd backend && python -m venv .venv && source .venv/bin/activate
2. pip install -r requirements.txt
3. docker compose up -d db redis   # run from the repo root; optional for Postgres, but needed for Redis sessions
4. cd frontend && npm install
5. npm run test:e2e:install   # only needed for Playwright end-to-end tests
6. Optional: set DATABASE_URL (default sqlite:///./app.db), ALLOWED_ORIGINS (comma-separated CORS origins) for the backend, and VITE_API_BASE_URL (default http://localhost:8000) for the frontend. See .env.example and ENVIRONMENT.md for the full list; they were not in the provided files.
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| backend dev | `cd backend && uvicorn app.main:app --reload` | Starts the FastAPI API on port 8000 with auto-reload; the health check is at GET /health. |
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server for the SPA. |
| frontend build | `cd frontend && npm run build` | Bundles the SPA with Vite. It does not typecheck. |
| frontend preview | `cd frontend && npm run preview` | Serves the built bundle locally. |
| typecheck | `cd frontend && npm run typecheck` | Runs tsc --noEmit over the frontend sources. |
| local services | `docker compose up -d db redis` | Starts Postgres 16 (user, password and database all 'app') and Redis from docker-compose.yml. |
| backend image | `docker build -t hrms-backend ./backend` | Builds the backend container image, which runs uvicorn on port 8000 as a non-root user. |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `.devcontainer/` | Dev container configuration. |
| `.github/workflows/` | deploy.yml: on push to main, builds and pushes the API image to ECR and deploys the frontend to AWS Amplify. |
| `.quorq/` | Quorq platform metadata (handoff.json, prepared.json). |
| `backend/app/` | FastAPI application: main.py (app, CORS, health), models.py, schemas.py, database.py, config.py, security.py (sessions, hashing), authz.py (roles and permissions), audit.py, services.py. |
| `backend/app/routers/` | Route modules: auth, admin, audit, employees (departments, employees, my team) and scoped (projects, timesheets, attendance, leave). |
| `backend/scripts/` | Helper scripts (check_connections.py). |
| `backend/tests/` | Pytest suite: test_health.py plus integration/ tests. |
| `backend/tests/integration/` | Integration tests for auth, RBAC, relationship scoping, employees, departments, audit log, password reset, user creation, leaver erasure and my-team. |
| `frontend/e2e/` | Playwright acceptance specs. |
| `frontend/src/` | SPA source: App.tsx (shell and routes), main.tsx, index.css, test-setup.ts. |
| `frontend/src/lib/` | Shared helpers: api.ts (fetch client and session token), mustChange.ts, datetime.ts, navigate.ts, ui.tsx, icons.tsx, brand.ts. |
| `frontend/src/screens/` | One module per screen, with Vitest tests beside them. |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Backend routers use the /api prefix and FastAPI dependency injection: get_db for a per-request session, current_user for authentication, require_permission('<perm>') for RBAC.
- A user with must_change_password gets 403 'Password change required' from current_user. Only /api/me, change-password and logout use current_user_allow_change.
- Relationship-scoped endpoints fail closed: ensure_relationship produces one identical 403 for unknown, malformed or foreign ids.
- Mutating endpoints write to the audit log via write_audit, with before/after values.
- Ids are UUIDs, serialised as strings in responses. List endpoints take limit (1-200) and offset and return {items, total}.
- The frontend uses the '@' alias for src/, calls the API only through apiFetch, and sends the session token as a Bearer header. A 401 clears the token and returns the user to sign-in.
- Frontend tests sit next to the code as *.test.ts(x). Playwright specs live in frontend/e2e.
- Python style is enforced with ruff (backend/ruff.toml). Frontend style uses ESLint and Prettier.
- There are no migrations. Tables are created with Base.metadata.create_all at startup; main.py notes this should be replaced with Alembic before the database holds data worth keeping.
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs the pytest suite in backend/tests (pytest.ini sets pythonpath to the backend directory). |
| backend lint | `cd backend && ruff check .` | Lints the backend with ruff. |
| backend format | `cd backend && ruff format .` | Formats the backend code with ruff. |
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component and unit tests under src/ (jsdom). |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint over the frontend. |
| frontend format check | `cd frontend && npm run format:check` | Checks Prettier formatting. |
| e2e | `cd frontend && npm run test:e2e` | Runs Playwright specs from e2e/. Without E2E_BASE_URL it starts the backend from backend/.venv and builds and serves the frontend on port 4173. With E2E_BASE_URL set it runs against that URL instead. |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| Login or authenticated calls fail, or the sessions code cannot reach Redis. | Sessions are stored in Redis (create_session and get_redis in app/security.py). Start Redis with `docker compose up -d redis` and check the Redis settings in .env.example / ENVIRONMENT.md; security.py was not provided, so the variable name is not confirmed here. |
| `docker compose up` fails with a port 6379 already allocated error. | Both redis-queue and redis publish host port 6379. Start only what you need, e.g. `docker compose up -d db redis`, or change one of the port mappings. |
| The browser blocks API calls with a CORS error. | The SPA and API run on different origins. Set ALLOWED_ORIGINS (comma-separated) on the backend to the frontend's origin. |
| The frontend calls the wrong API host. | The API URL is baked in at build time from VITE_API_BASE_URL, defaulting to http://localhost:8000. Set it before `npm run dev` or `npm run build`. |
| `npm run build` succeeds but `npm run typecheck` reports errors. | The build does not typecheck (per frontend/README.md). Run `npm run typecheck` and fix the reported types. |
| Playwright e2e cannot start the backend (missing .venv/bin/python). | Create backend/.venv and install requirements first: `cd backend && python -m venv .venv && .venv/bin/pip install -r requirements.txt`. Also run `npm run test:e2e:install` for the browser. |
| A user gets 403 'Password change required' after signing in. | The account has must_change_password set (new or admin-reset accounts). Change the password at /change-password, which calls POST /api/auth/change-password. The new password must be 12-72 characters and differ from the current one. |
| Password hashing errors with bcrypt. | requirements.txt pins bcrypt==4.0.1 because passlib 1.7.4 breaks with bcrypt 4.1 or later. Reinstall from requirements.txt. |
| Schema changes do not appear in an existing database. | create_all only creates missing tables and there are no migrations. With the default SQLite file, delete backend/app.db to recreate it, or add Alembic. |
| Credentials are committed in the deploy workflow. | deploy.yml sets VITE_API_SECRET_KEY and NEXT_PUBLIC_API_SECRET_KEY as literals in the build env, and the frontend bundle exposes the Vite one. Treat that value as public, and move any real secret out of the repository. |
<!-- sdlc:auto:end troubleshooting -->
