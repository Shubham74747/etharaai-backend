# HRMS Backend

Run locally:

- Copy `.env.example` to `.env` and set `DATABASE_URL`.
- Either run Postgres + API using the top-level `docker-compose.yml` (`docker-compose up --build`) or run standalone:
  - `npm install`
  - Ensure Postgres is running and `DATABASE_URL` points to it
  - `npm run migrate` (optional when using docker-compose)
  - `npm run dev`

API base: `http://localhost:4000`

Endpoints:
- GET /api/employees
- POST /api/employees
- DELETE /api/employees/:id
- POST /api/employees/:id/attendance
- GET /api/employees/:id/attendance

Deployment hints:
- Use Dockerfile or deploy to Render (create a Web Service, connect repo) and set `DATABASE_URL` as an env var.

Deployment details and tips:
- The Docker image does **not** include the `psql` client and will **not** run migrations automatically. Run migrations manually before deploy (see below).
- On Render: set the `DATABASE_URL` env var in the service's Environment settings (sync is enabled in `render.yaml`).
- Render will perform container health checks on `/api/health` (configured in `render.yaml`).
- Migrations are a one-time/manual step. Run them locally before deploying using one of these approaches:
  - `npm run migrate` (requires `psql` client), or
  - Run a one-off job/container to execute `psql $DATABASE_URL -f migrations/init.sql` (preferred on hosting platforms like Render).
- Do not rely on automatic migrations on container start; manage migrations explicitly to avoid accidental repeated changes.
- Ensure the database user in `DATABASE_URL` has sufficient privileges to create tables.
