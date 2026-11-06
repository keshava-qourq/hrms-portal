# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `8dd2714` · model `auto`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
HRMS portal is a two-app repository. `frontend/` is a Vite + React 19 + TypeScript SPA (React Router, TanStack Query, Tailwind 4) with screens for Sign in, Home, Timesheet, Leave, Profile, My Team, Approvals, Administration and Change Password. `backend/` is a FastAPI 0.115 service using SQLAlchemy 2 and Pydantic 2. It defaults to a local SQLite database and can use PostgreSQL through DATABASE_URL. Sign-in is session-token based (bearer token, Redis-backed sessions) with role-based permissions. The API covers auth, admin user management, an audit log, employees and departments, a manager's team view, relationship-scoped reads, weekly timesheets and project assignments. The frontend README says some screens still use seeded sample data. Auth, /api/me and the other API-backed flows go through `frontend/src/lib/api.ts`.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Node.js and npm (React 19 / Vite 6 / Vitest 2 toolchain; the Node version is not pinned in the files shown)
- Python 3.12 (the backend Dockerfile uses python:3.12-slim)
- pip
- Docker with Docker Compose (optional: the compose file provides PostgreSQL 16 and Redis 7)
- A Redis instance reachable by the backend (login sessions are Redis-backed)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. Start the optional local services from the repo root: docker compose up -d
2. Create a virtualenv in the backend (Playwright's webServer expects backend/.venv): cd backend && python -m venv .venv && source .venv/bin/activate
3. Install the backend dependencies (this includes the test and lint tools): pip install -r requirements.txt
4. Review .env.example and ENVIRONMENT.md for configuration (not shown here). The backend reads DATABASE_URL and falls back to sqlite:///./app.db when it is unset.
5. Start the API from backend/: uvicorn app.main:app --reload
6. In a second terminal install the frontend dependencies: cd frontend && npm install
7. Start the frontend: npm run dev
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| backend dev | `cd backend && uvicorn app.main:app --reload` | Runs the FastAPI app with reload on port 8000. Tables are created on startup, and /health reports liveness. |
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server for the SPA. |
| frontend build | `cd frontend && npm run build` | Bundles the app with Vite. It does not typecheck. |
| frontend preview | `cd frontend && npm run preview` | Serves the built bundle locally. |
| typecheck | `cd frontend && npm run typecheck` | Runs tsc --noEmit over src. |
| frontend format | `cd frontend && npm run format` | Runs Prettier over the frontend. Use npm run format:check to only verify. |
| backend lint | `cd backend && ruff check .` | Lints the backend. Use ruff format . to format it. |
| local services | `docker compose up -d` | Starts PostgreSQL 16 and two Redis 7 containers (redis-queue and redis) defined in docker-compose.yml. |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `.devcontainer/` | Dev container configuration. |
| `.github/workflows/` | deploy.yml: on push to main, builds and pushes the API image to ECR and deploys the frontend build to AWS Amplify. |
| `.quorq/` | Quorq platform metadata (handoff.json, prepared.json). |
| `backend/app/` | FastAPI application: main.py entrypoint, config, database, models, schemas, authz, security, audit, services and demo_seed. |
| `backend/app/routers/` | API routers: auth, admin, audit, employees, scoped, timesheets, project_assignments. |
| `backend/scripts/` | Helper scripts: check_connections.py and seed_demo.py. |
| `backend/tests/` | pytest suite: test_health.py plus integration/ tests for auth, RBAC, relationship scoping, employees, departments, timesheets, audit log, password reset, leaver erasure and more. |
| `frontend/src/` | SPA source: App.tsx (shell and routes), main.tsx, index.css, test-setup.ts. |
| `frontend/src/screens/` | One module per screen, with Vitest tests beside them. |
| `frontend/src/lib/` | Shared helpers: api.ts (fetch client and session token), ui.tsx and icons.tsx (component vocabulary), brand.ts, datetime.ts, mustChange.ts, navigate.ts. |
| `frontend/e2e/` | Playwright acceptance specs (employee create, forced password change, timesheet grid, navigation gating, and others). |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Backend: one router per area under app/routers, each with an /api prefix, and Pydantic request/response models declared with response_model.
- Access control is enforced server-side: require_permission(...) for role permissions and ensure_relationship(...) for record ownership. Out-of-scope access returns one identical 403, and the checks fail closed.
- Identity comes from the verified bearer session token, never from the request body. Most routes use the current_user dependency, which returns 403 while a password change is pending.
- State-changing operations write to the append-only audit log through write_audit, with before/after values.
- Models use SQLAlchemy 2 typed Mapped columns with UUID primary keys. There are no migrations: tables are created from the models on startup.
- Backend style is enforced by ruff (backend/ruff.toml). Frontend style uses ESLint (flat config) and Prettier.
- Frontend: screens are default-exported components in src/screens, imported through the '@' alias for src. Server calls go through apiFetch from '@/lib/api'.
- Tests sit beside the components they cover, as src/**/*.test.tsx. Playwright specs live in frontend/e2e.
- The frontend is configured with build-time VITE_ variables: VITE_API_BASE_URL falls back to http://localhost:8000.
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs the pytest suite in backend/tests (pytest.ini sets pythonpath to the backend directory). |
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component and unit tests under src/ once (vitest run --passWithNoTests). |
| install e2e browser | `cd frontend && npm run test:e2e:install` | Installs Chromium for Playwright. Run this once before the e2e tests. |
| e2e tests | `cd frontend && npm run test:e2e` | Runs the Playwright specs in e2e/. Without E2E_BASE_URL it starts the backend from backend/.venv and builds and previews the frontend on port 4173. With E2E_BASE_URL set it targets that deployment. |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint over the frontend (npm run lint:fix applies the fixes it can). |
| backend lint | `cd backend && ruff check .` | Runs the ruff linter over the backend. |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| npm run build succeeds but tsc reports type errors. | This is expected: the build does not typecheck. Run npm run typecheck in frontend/ and fix the reported errors. |
| `import app` fails or pytest cannot find the app module. | Run pytest from the backend/ directory so pytest.ini's pythonpath applies, and run uvicorn from backend/ as well. |
| docker compose up fails with a port 6379 conflict. | Both the redis-queue and redis services in docker-compose.yml publish host port 6379. Change one host port mapping (or start only one with docker compose up -d db redis) and point the backend's Redis setting at it. |
| Sign-in or session calls fail because Redis is unavailable. | Sessions are created through Redis, so make sure a Redis instance is running (for example via docker compose up -d redis). Check .env.example and ENVIRONMENT.md for the connection settings. |
| Playwright's e2e run cannot start the backend. | The Playwright config runs backend/.venv/bin/python -m uvicorn. Create the virtualenv in backend/ and install requirements.txt into it first, or set E2E_BASE_URL to run against an existing deployment. |
| The browser blocks API calls from the frontend with a CORS error. | The API only allows the origins in its configured list. In deployment this is the ALLOWED_ORIGINS variable (comma separated). Make sure it includes your frontend's origin. |
| You need a fresh database or demo sign-ins. | By default the backend uses a SQLite file (app.db) in the working directory, so delete it to reset. Demo accounts are created on startup when SEED_DEMO_ACCOUNTS is true (the Dockerfile sets it). backend/scripts/seed_demo.py is also available. |
<!-- sdlc:auto:end troubleshooting -->
