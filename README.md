# FactoryIQ Manufacturing Excellence Portal (MVP)

End-to-end MVP: **Django REST API (JWT + RBAC + MySQL)** + **React portal UI**.

## What’s included

- **Auth**: Register + Login (JWT)
- **RBAC**:
  - `customer`: only sees their own `Project`, `ProductionRecord`, `NCR`
  - non-customer roles: see all
  - `Inventory` / `Shipment`: blocked for `customer` (engineer/admin/quality only)
- **Modules (MVP)**:
  - Projects
  - Production tracking
  - Quality (NCR)
  - Supply chain (Inventory + Shipments)
- **Dashboard**: basic KPIs + chart (Output vs Defects)

## Folder structure

- `backend/` Django + DRF
- `frontend/` React (Vite)

## Backend setup (Django + MySQL)

1) Create a MySQL database (or let the app create it automatically via the included script).

2) Configure env:

- Copy `backend/.env.example` → `backend/.env`
- Update MySQL values if needed.

3) Create venv + install:

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
```

4) Migrate:

```bash
.\.venv\Scripts\python manage.py migrate
```

5) Run API:

```bash
.\.venv\Scripts\python manage.py runserver 8000
```

### Default test admin user

Created automatically for local testing:

- **username**: `admin`
- **password**: `admin12345`

## Frontend setup (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://127.0.0.1:5173/` and talks to the API at `http://127.0.0.1:8000/`.

## API endpoints

- `POST /api/auth/register/`
- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`
- `GET/POST /api/projects/`
- `GET/POST /api/production/`
- `GET/POST /api/quality/ncrs/`
- `GET/POST /api/supplychain/inventory/`
- `GET/POST /api/supplychain/shipments/`

