# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `3726b65` · model `auto`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
HRMS portal is a two-app repository. `frontend/` is a Vite + React 19 + TypeScript SPA (Tailwind 4, react-router) with screens for sign-in, home, timesheet, leave, approvals and administration. `backend/` is a FastAPI 0.115 service using SQLAlchemy 2 (SQLite by default, PostgreSQL via DATABASE_URL), bcrypt password hashing, Redis-backed sessions, role-based permissions and an audit log. The backend currently exposes only auth (login, logout, me), admin user management, a read-only audit-log endpoint and /health. According to the frontend README, the other screens still render seeded sample data. A GitHub Actions workflow builds and pushes the API image and deploys the frontend build to AWS Amplify.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Python 3.12 (the backend Dockerfile uses python:3.12-slim)
- Node.js and npm (version not pinned in the manifests; use a current LTS that supports Vite 6)
- Docker and Docker Compose (optional: PostgreSQL 16 and Redis 7 via docker-compose.yml; also used to build the backend image)
- Playwright's Chromium browser (only for end-to-end tests)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. cd backend
2. python -m venv .venv
3. .venv/bin/pip install -r requirements.txt
4. cd ../frontend
5. npm install
6. Optional: from the repository root run `docker compose up -d db` to start local PostgreSQL, then set DATABASE_URL to point at it. Without DATABASE_URL the backend uses the SQLite file ./app.db. Review .env.example (not shown here) for other settings.
7. Optional: for end-to-end tests, run `npm run test:e2e:install` in frontend/ to fetch Chromium
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| backend dev | `cd backend && .venv/bin/python -m uvicorn app.main:app --reload` | Starts the FastAPI API on port 8000 with auto-reload. Tables are created from the models on startup. Health check at /health. |
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server for the SPA. |
| frontend build | `cd frontend && npm run build` | Bundles the app with Vite. This does not typecheck. |
| frontend preview | `cd frontend && npm run preview` | Serves the built bundle locally. |
| typecheck | `cd frontend && npm run typecheck` | Runs tsc --noEmit on the frontend. |
| backend container | `docker build -t hrms-api ./backend` | Builds the backend image. It runs uvicorn on port 8000 as an unprivileged user and has a /health healthcheck. |
| local services | `docker compose up -d` | Starts PostgreSQL 16 and the two Redis containers defined in docker-compose.yml. |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `.devcontainer/` | Dev container configuration. |
| `.github/workflows/` | deploy.yml: builds and pushes the API image and deploys the frontend to AWS Amplify on push to main. |
| `.quorq/` | Platform metadata (handoff.json, prepared.json). |
| `backend/app/` | FastAPI application: main.py, config, database, models, schemas, security, authz, audit and services modules. |
| `backend/app/routers/` | API routers: auth (login, logout, me), admin (user management) and audit (audit-log view). |
| `backend/scripts/` | Helper scripts, e.g. check_connections.py. |
| `backend/tests/` | pytest suite: test_health.py plus integration tests for auth, auth NFRs, RBAC, departments and the audit log. |
| `frontend/e2e/` | Playwright acceptance specs. |
| `frontend/src/` | SPA source: App.tsx (navigation shell and routes), main.tsx, index.css and test setup. |
| `frontend/src/lib/` | Shared helpers: API client (api.ts), brand tokens, datetime utilities, icons, UI components and navigation helpers. |
| `frontend/src/screens/` | One module per screen: SignIn, Home, Timesheet, Leave, Approvals, Administration. |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Backend routes live under /api, one router module per component. Routers use `APIRouter(prefix=..., tags=[...])`.
- Handlers get a request-scoped DB session via `Depends(get_db)` and are protected with `require_permission("<permission>")` (e.g. users.manage, audit.view) or the `current_user` dependency.
- Authentication uses a bearer session token returned in the login response body, not a cookie. The frontend stores it in localStorage and `apiFetch` sends it as the Authorization header.
- Failed logins return one generic error message so the API does not reveal which emails have accounts.
- Admin changes write audit entries via `write_audit`.
- Schema is created with `Base.metadata.create_all` on startup. There are no migrations (main.py says to replace this with Alembic).
- Backend linting and formatting use Ruff (ruff.toml). Frontend uses ESLint and Prettier.
- Frontend imports use the `@/` alias for `src/`. Component tests (Vitest) sit beside the code in `src/`; Playwright specs live in `e2e/`.
- Frontend styling uses Tailwind 4 with brand CSS variables such as `var(--brand-fg)`.
- The frontend API base URL comes from VITE_API_BASE_URL and defaults to http://localhost:8000. CORS origins come from ALLOWED_ORIGINS, which is comma separated.
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && .venv/bin/pytest` | Runs the pytest suite in backend/tests (pytest.ini sets pythonpath and testpaths). |
| backend lint | `cd backend && .venv/bin/ruff check .` | Lints the backend with Ruff. |
| backend format | `cd backend && .venv/bin/ruff format .` | Formats the backend with Ruff. |
| frontend unit tests | `cd frontend && npm test` | Runs the Vitest component and unit tests under src/. |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint over the frontend. |
| frontend format check | `cd frontend && npm run format:check` | Checks Prettier formatting. |
| e2e tests | `cd frontend && npm run test:e2e` | Runs Playwright specs from e2e/. With E2E_BASE_URL set it targets that deployed URL. Otherwise it starts the backend from backend/.venv on port 8000 and a built preview on port 4173. |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| Playwright cannot start the backend (`.venv/bin/python` not found). | The Playwright config launches `cd ../backend && .venv/bin/python -m uvicorn ...`. Create backend/.venv and install requirements.txt into it, or set E2E_BASE_URL to run against an already deployed app. |
| `docker compose up` fails with a port 6379 conflict. | Both redis-queue and redis publish host port 6379. Change one host port mapping in docker-compose.yml, or start only the services you need, e.g. `docker compose up -d db redis`. |
| `import app` fails when running pytest. | Run pytest from the backend/ directory so pytest.ini's `pythonpath = .` applies. |
| `npm run build` succeeds but `npm run typecheck` reports errors. | This is expected: the build does not typecheck and the generated screens may not satisfy tsc. Fix the reported types, usually untyped `useState({})`. |
| Browser calls to the API are blocked by CORS. | Set ALLOWED_ORIGINS (comma separated) to the frontend's origin. Also check that VITE_API_BASE_URL points at the running backend. |
| Sign-in or sessions fail locally. | Login creates a Redis-backed session, so make sure Redis is running (`docker compose up -d redis`) and that the backend's Redis settings, e.g. in .env.example, point to it. |
| bcrypt or passlib errors on install or at runtime. | requirements.txt pins bcrypt==4.0.1 because passlib 1.7.4 breaks with bcrypt >= 4.1. Reinstall from requirements.txt. |
<!-- sdlc:auto:end troubleshooting -->
