# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `92f33dd` · model `auto`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
HRMS portal is a two-app repository. `frontend/` is a Vite + React 19 + TypeScript SPA (React Router, TanStack Query, Tailwind 4) with screens for sign-in, home, timesheet, leave, approvals and administration. Per its README, most screens still render seeded sample data. `backend/` is a FastAPI 0.115 service using SQLAlchemy 2 and Pydantic 2. It defaults to a local SQLite file and can use PostgreSQL via DATABASE_URL. It implements bearer-token sign-in with Redis-backed sessions, role/permission checks, admin user management, an audit log, departments, employees, a manager team view, and relationship-scoped reads of timesheets, attendance, leave and projects. Tables are created from the models on startup (no migrations). A GitHub Actions workflow deploys the API image and the frontend bundle.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Python 3.12 (the version used in backend/Dockerfile)
- Node.js and npm (no version is pinned in the repo; use a current LTS that supports Vite 6)
- Docker with Docker Compose (optional, for the local PostgreSQL 16 and Redis 7 services in docker-compose.yml)
- A Redis instance reachable by the backend (sessions are Redis-backed per backend/app/routers/auth.py; the backend depends on redis and rq)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. (Optional) Start the local services: docker compose up -d
2. Create the backend virtualenv: cd backend && python -m venv .venv && source .venv/bin/activate
3. Install backend dependencies (includes the test and lint tools): pip install -r requirements.txt
4. Review .env.example and ENVIRONMENT.md for the environment variables the backend needs (not shown in the inspected files). DATABASE_URL and ALLOWED_ORIGINS are referenced in the code; DATABASE_URL defaults to sqlite:///./app.db
5. Install frontend dependencies: cd frontend && npm install
6. (Optional) Point the frontend at a backend by setting VITE_API_BASE_URL at build/dev time; it defaults to http://localhost:8000
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| backend dev | `cd backend && uvicorn app.main:app --reload` | Starts the FastAPI API on port 8000 with auto-reload. Health check at GET /health, OpenAPI docs at /docs. |
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server for the React SPA. |
| frontend build | `cd frontend && npm run build` | Bundles the app with Vite. This does not typecheck. |
| frontend preview | `cd frontend && npm run preview` | Serves the built bundle locally. |
| frontend typecheck | `cd frontend && npm run typecheck` | Runs tsc --noEmit. |
| local services | `docker compose up -d` | Starts PostgreSQL 16 and the Redis containers defined in docker-compose.yml. |
| frontend format | `cd frontend && npm run format` | Formats the frontend with Prettier (npm run format:check only checks). |
| backend format | `cd backend && ruff format .` | Formats the backend code with Ruff. |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `.devcontainer/` | Dev container configuration. |
| `.github/workflows/` | deploy.yml: on push to main, builds and pushes the API image to ECR and publishes the frontend build to AWS Amplify. |
| `.quorq/` | Quorq platform handoff/prepared metadata. |
| `backend/app/` | FastAPI application: main.py entry point, config, database, models, schemas, security (sessions/passwords), authz (roles/permissions), audit, services. |
| `backend/app/routers/` | Route modules: auth, admin, audit, employees (departments, employees, team) and scoped (projects, timesheets, attendance, leave). |
| `backend/scripts/` | Utility scripts, e.g. check_connections.py. |
| `backend/tests/` | Pytest suite: test_health.py plus integration/ tests for auth, RBAC, audit log, departments, employees, user creation and relationship scoping. |
| `frontend/e2e/` | Playwright acceptance specs (employee create, navigation gating, no self-registration, timestamps). |
| `frontend/src/` | SPA source: main.tsx, App.tsx (shell and route table), index.css, test setup. |
| `frontend/src/lib/` | Shared helpers: api.ts (fetch client and session token), brand tokens, datetime, icons, navigate, ui components. |
| `frontend/src/screens/` | One module per screen (SignIn, Home, Timesheet, Leave, Approvals, Administration, EmployeesTab) with Vitest tests beside them. |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Backend routers live in backend/app/routers and use /api-prefixed paths, except GET /health.
- Endpoints are guarded with dependencies: current_user for authentication and require_permission("<permission>") for role-based access (e.g. users.manage, employees.manage, audit.view).
- Relationship-scoped endpoints fail closed with one identical 403 via ensure_relationship, whether an id is unknown, malformed or not the caller's.
- Mutating endpoints write to the append-only audit log (write_audit, changed_fields) with before/after values.
- Models use SQLAlchemy 2 typed Mapped columns with UUID primary keys, and API schemas return ids as strings.
- The API returns the session token in the login response body (not a cookie); the frontend stores it in localStorage and sends it as a Bearer token.
- Frontend uses the "@" alias for src/, function components, and Vitest tests beside components in src/.
- Backend linting/formatting uses Ruff; frontend uses ESLint and Prettier.
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs the pytest suite in backend/tests (pytest.ini sets pythonpath and testpaths). |
| backend lint | `cd backend && ruff check .` | Lints the backend with Ruff. |
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component/unit tests (vitest run, scoped to src/). |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint over the frontend (npm run lint:fix applies fixes). |
| install e2e browser | `cd frontend && npm run test:e2e:install` | Installs Chromium for Playwright. |
| e2e tests | `cd frontend && npm run test:e2e` | Runs Playwright specs from frontend/e2e. Without E2E_BASE_URL it starts the backend from backend/.venv on port 8000 and builds/previews the frontend on port 4173; with E2E_BASE_URL set it tests that deployed URL. |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| Playwright cannot start the backend (.venv/bin/python not found). | playwright.config.ts launches the API with backend/.venv/bin/python. Create the venv in backend/ and run pip install -r requirements.txt, or set E2E_BASE_URL to test an already running deployment. |
| Browser calls from the SPA are blocked by CORS. | The API only allows origins from settings.cors_origins(). Set ALLOWED_ORIGINS (comma separated) to the frontend's origin. |
| The frontend calls the wrong API or requests return 401. | The API base URL comes from VITE_API_BASE_URL, falling back to http://localhost:8000. Rebuild or restart the dev server after changing it. Protected screens redirect to /sign-in until a session token is stored. |
| `docker compose up` fails with a port 6379 conflict. | Both the redis-queue and redis services in docker-compose.yml publish host port 6379. Start only one (e.g. docker compose up -d db redis) or change one host port mapping. |
| `npm run build` succeeds but `npm run typecheck` reports errors. | This is expected: the build does not typecheck and generated screens may have type errors. Fix the errors reported by tsc --noEmit. |
| The backend uses a local SQLite file instead of PostgreSQL. | DATABASE_URL defaults to sqlite:///./app.db. Set it to a PostgreSQL URL for the psycopg driver (the compose db service uses user, password and database `app`). |
| Login or session errors when Redis is unavailable. | Sessions are Redis-backed. Start Redis (docker compose up -d redis) and check the Redis settings in .env.example / ENVIRONMENT.md. |
<!-- sdlc:auto:end troubleshooting -->
