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
