# Hospital Management System

Full-stack hospital management web app: **React** frontend, **Spring Boot** REST API, and **MySQL** database.

**Repository:** [github.com/umeshshingare/Hostpital_Management_System](https://github.com/umeshshingare/Hostpital_Management_System)

## Features

- Patient registration and listing (validated)
- Doctor management (CRUD via API)
- Appointment booking (one per doctor per day, DB-enforced)
- Appointment cancellation
- Dashboard statistics
- Flyway migrations (schema + seed doctors)
- Docker Compose for local full stack
- Ready for **Vercel** (frontend) + **Render** (backend) + **cloud MySQL**

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router, Axios |
| Backend | Spring Boot 3.2, JPA, Validation, Flyway, Actuator |
| Database | MySQL 8 |
| Local deploy | Docker Compose |
| Cloud deploy | Vercel + Render + external MySQL |

## Project structure

```
├── frontend/           React SPA (deploy to Vercel)
├── backend/            Spring Boot API (deploy to Render)
├── docs/
│   ├── DEPLOYMENT.md   Vercel + Render step-by-step
│   └── DATABASE.md     Using MySQL after deploy
├── legacy-console/     Original CLI Java app
├── render.yaml         Render blueprint (backend)
├── docker-compose.yml  Local MySQL + optional full stack
└── README.md
```

## Quick start (local)

### Option A — Docker (full stack)

```bash
docker compose up --build -d
```

- UI: http://localhost  
- API: http://localhost:8080  

### Option B — Dev servers

**1. MySQL**

```bash
docker compose up mysql -d
```

Uses host port **3307** (see `.env.example`).

**2. Backend**

```bash
cd backend
# PowerShell:
$env:DB_URL="jdbc:mysql://localhost:3307/hospital?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_PASSWORD="hospital_secret"
.\mvnw.cmd spring-boot:run
```

**3. Frontend**

```bash
cd frontend
npm install
npm run dev
```

- UI: http://localhost:5173 (proxies `/api` → backend)

## Deploy to production (Vercel + Render)

Neither Vercel nor Render hosts MySQL. You need a **cloud MySQL** instance (e.g. Railway, Aiven).

| Step | Platform | What |
|------|----------|------|
| 1 | Railway / Aiven / etc. | Create MySQL, get JDBC URL |
| 2 | [Render](https://render.com) | Deploy `backend/` as **Docker** Web Service |
| 3 | [Vercel](https://vercel.com) | Deploy `frontend/` with `VITE_API_URL` = Render URL |

**Detailed guides:**

- **[docs/RENDER-VERCEL-SETUP.md](docs/RENDER-VERCEL-SETUP.md)** — **Step-by-step form fields** for Render + Vercel  
- [docs/RAILWAY-MYSQL.md](docs/RAILWAY-MYSQL.md) — Map Railway MySQL credentials to Render  
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Overview, env vars, common problems  
- [docs/DATABASE.md](docs/DATABASE.md) — Schema, Flyway, backups  

Copy `.env.railway.example` → `.env` for local testing with Railway (do not commit `.env`).

### Render (backend) — summary

| Setting | Value |
|---------|--------|
| Language | **Docker** (Java is not in Render’s dropdown) |
| Root Directory | `backend` |
| Dockerfile | `./Dockerfile` (builds Java 17 + Spring Boot inside Docker) |
| Health check | `/actuator/health` |

Env: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `SPRING_PROFILES_ACTIVE=prod`, `CORS_ALLOWED_ORIGINS`, `CORS_ALLOWED_ORIGIN_PATTERNS`

### Vercel (frontend) — summary

| Setting | Value |
|---------|--------|
| Root Directory | `frontend` |
| Build | `npm run build` |
| Output | `dist` |
| Env | `VITE_API_URL=https://your-api.onrender.com` |

Redeploy Vercel after changing `VITE_API_URL`.

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard/stats` | Dashboard counts |
| GET/POST | `/api/patients` | List / create |
| GET/POST | `/api/doctors` | List / create |
| GET/POST | `/api/appointments` | List / book |
| DELETE | `/api/appointments/{id}` | Cancel |
| GET | `/actuator/health` | Health check |

## Environment variables

Copy `.env.example`. Never commit `.env` with real passwords.

| Variable | Where | Purpose |
|----------|--------|---------|
| `DB_URL` | Render | JDBC connection to cloud MySQL |
| `DB_USERNAME` / `DB_PASSWORD` | Render | DB credentials |
| `CORS_ALLOWED_ORIGINS` | Render | Your Vercel production URL |
| `CORS_ALLOWED_ORIGIN_PATTERNS` | Render | e.g. `https://*.vercel.app` |
| `VITE_API_URL` | Vercel | Render API base URL (build-time) |

## Common deployment issues

| Issue | Fix |
|-------|-----|
| CORS blocked | Set `CORS_ALLOWED_ORIGINS` to exact Vercel URL |
| API not found | Set `VITE_API_URL` on Vercel, redeploy |
| Slow first request | Render free tier cold start (~50s) |
| DB connection failed | SSL in JDBC URL; check host allows external connections |
| Empty doctors list | Check Flyway logs; V2 seeds 5 doctors on first run |

## License

MIT (or your choice — add `LICENSE` if needed).

## Author

[umeshshingare](https://github.com/umeshshingare)
