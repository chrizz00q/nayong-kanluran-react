# RBIS — Registry of Barangay Inhabitants System

This repo now has two parts:

- **`/` (PHP backend)** — your original PHP app. Untouched except for a handful of
  **new files added to `/api/`** so the React frontend has clean JSON endpoints to
  talk to (see below). Nothing existing was deleted or rewritten; the old
  page-based views (`dashboard.php`, `login.php`, `inhabitants/*.php`,
  `certification/index.php`, etc.) still work if you ever need them, but the
  React app supersedes them for day-to-day use.
- **`/frontend` (new)** — a Vite + React + TypeScript single-page app that
  re-implements Login, Dashboard, Inhabitants (Citizens & Households),
  Certification, and Demographics against the PHP API.

## Why some new PHP files were added

Your original `/api/` had two different shapes:

1. Some endpoints (`demographics.php`, `certificate_create/update/details/stats.php`)
   already returned clean JSON — the React app uses these **as-is**.
2. Others (`citizen.php`, `households.php`, `certificates.php`) were built for
   jQuery DataTables and return HTML pre-rendered inside each JSON cell
   (badges, `<img>` tags, `onclick="..."` handlers). That's fine for the old
   pages but unusable for a React table. There was also no login/dashboard
   JSON API at all (`login.php`/`dashboard.php` render full HTML pages), and
   no create/update/delete API for citizens or households (only page-based
   forms under `inhabitants/`).

To avoid rewriting your backend, small new files were added **next to** the
originals, following the same conventions already used by `pet_create.php` /
`vehicle_create.php` etc.:

| New file | Purpose |
|---|---|
| `api/auth.php` | JSON login / logout / "who am I" (`?action=login\|logout\|me`) |
| `api/dashboard_stats.php` | JSON version of the dashboard's stat cards |
| `api/citizens_list.php` | Clean paginated/sortable/searchable list of `individual_records` |
| `api/citizen_details.php` | Fetch one citizen |
| `api/citizen_create.php` | Create a citizen |
| `api/citizen_update.php` | Update a citizen |
| `api/citizen_delete.php` | Delete a citizen (JSON, unlike the old redirect-based delete) |
| `api/households_list.php` | Clean list of `household_records` |
| `api/household_details.php` / `_create.php` / `_update.php` / `_delete.php` | CRUD for household records |
| `api/certificates_list.php` | Clean list of certificates (plain fields, not HTML) |
| `api/certificate_delete.php` | Delete a certificate (JSON) |
| `api/citizens_search.php` | Lightweight resident search, used by the certificate form's resident picker |

All of these `require_once '../config.php'` and reuse your existing
`requireLogin()`, `requirePermission()`, `logAudit()`, `uploadFile()`, etc., so
permissions and audit logging behave exactly like the rest of the app.

**Nothing else in `/api/`, `/config.php`, or the database schema was changed.**

## Running it locally

### 1. Backend (unchanged setup)

Keep serving the PHP app the way you already do (XAMPP/MAMP/etc.), e.g.:

```
C:\xampp\htdocs\RBI   ->  http://localhost/RBI
```

Make sure `rbis_db.sql` is imported and `config.php`'s DB credentials are correct,
exactly as before.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

By default the dev server proxies `/api` and `/uploads` to
`http://localhost/RBI`. If your PHP app lives at a different URL, set an env
var before starting Vite:

```bash
PHP_BACKEND_URL=http://localhost/RBI npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`) and log in
with an existing user account. The proxy means the browser sees everything as
same-origin, so PHP's session cookie works with no CORS configuration needed.

### 3. Building for production

```bash
cd frontend
npm run build
```

This produces `frontend/dist/`. Copy its contents into your PHP web root (or a
subfolder) so that `/api` and `/uploads` resolve to the same PHP app — e.g.
serve `dist/index.html` at `http://localhost/RBI/app/` while `/api/*.php`
continues to live at `http://localhost/RBI/api/*.php`. Because it's all one
origin in production, no proxy config is needed there either.

## What's implemented in React

- **Login** — talks to `api/auth.php`, session-cookie based, redirects to
  `/dashboard` on success.
- **Dashboard** — households/population/male/female stat cards + today's
  birthday celebrants, pulled from `api/dashboard_stats.php`.
- **Inhabitants → Citizens** — searchable/sortable/paginated table, add/edit
  (modal form covering the `individual_records` fields), view detail modal,
  delete, profile picture upload.
- **Inhabitants → Households** — same pattern for `household_records`.
- **Certification** — stats cards (total/issued/pending/expired), list with
  search/status filter, add/edit with a resident search-picker, print (opens
  the existing `certificate_print.php` in a new tab), delete.
- **Demographics** — Population and Household tabs (via the sidebar) with
  pie/bar/line charts (gender, civil status, age brackets, education,
  citizenship, occupations, 12-month registration trend), from
  `api/demographics.php`.

## What's intentionally out of scope for now

Sections like **Extras (pets/vehicles)**, **Reports**, and **System
(users/roles/audit/settings)** were not converted — the sidebar only links to
the five modules above. Their PHP pages still work standalone if needed. The
existing `/api/pet_*`, `/api/vehicle_*`, and `/api/owners.php` endpoints are
already clean JSON, so porting those screens later is mostly "copy the
Citizens/Households pattern" — no further backend work should be required for
Extras. Reports and System would need a similar small set of new JSON
endpoints (they're currently page-rendered PHP, like `login.php` was).
