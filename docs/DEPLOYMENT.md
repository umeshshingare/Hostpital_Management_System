# Deploy: Vercel (frontend) + Render (backend)

## Architecture in production

```
User → Vercel (React static) → HTTPS → Render (Spring Boot API) → Cloud MySQL
```

| Service | Hosts | Does NOT host |
|---------|--------|----------------|
| **Vercel** | React build (`frontend/`) | API, database |
| **Render** | Spring Boot JAR (`backend/`) | MySQL (use external provider) |
| **MySQL** | Railway / Aiven / etc. | Application code |

---

## Step 1 — MySQL (database)

1. Create a MySQL 8 instance (e.g. [Railway](https://railway.app) → New → Database → MySQL).
2. Note: **host**, **port**, **user**, **password**, database name `hospital`.
3. Build JDBC URL:

```
jdbc:mysql://HOST:PORT/hospital?useSSL=true&requireSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

See [DATABASE.md](./DATABASE.md) for managing data after deploy.

---

## Step 2 — Render (backend)

1. Push this repo to GitHub.
2. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint** (or Web Service).
3. Connect repo `umeshshingare/Hostpital_Management_System`.
4. Use `render.yaml` or manual settings:

| Setting | Value |
|---------|--------|
| Root Directory | `backend` |
| Runtime | **Docker** (Render has no native Java; uses `backend/Dockerfile`) |
| Dockerfile Path | `./Dockerfile` |
| Build / Start Command | *(leave empty)* |
| Health Check Path | `/actuator/health` |

5. **Environment variables:**

| Key | Example |
|-----|---------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_URL` | `jdbc:mysql://...` (from Step 1) |
| `DB_USERNAME` | `root` |
| `DB_PASSWORD` | *(from provider)* |
| `CORS_ALLOWED_ORIGINS` | `https://your-project.vercel.app` |
| `CORS_ALLOWED_ORIGIN_PATTERNS` | `https://*.vercel.app` |

6. Deploy and copy URL, e.g. `https://hospital-management-api.onrender.com`.

7. Verify: open `https://YOUR-API.onrender.com/actuator/health` → `"status":"UP"`.

---

## Step 3 — Vercel (frontend)

1. [Vercel Dashboard](https://vercel.com) → **Add New Project** → import GitHub repo.
2. Settings:

| Setting | Value |
|---------|--------|
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

3. **Environment variable** (required at build time):

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://YOUR-API.onrender.com` (no trailing slash) |

4. Deploy. Open your `*.vercel.app` URL.

---

## Common problems

| Problem | Cause | Fix |
|---------|--------|-----|
| **CORS error** in browser | Frontend origin not allowed | Set `CORS_ALLOWED_ORIGINS` to exact Vercel URL; keep `CORS_ALLOWED_ORIGIN_PATTERNS=https://*.vercel.app` for previews |
| **Network Error / API unreachable** | Wrong `VITE_API_URL` or Render asleep | Set `VITE_API_URL` to Render URL; redeploy Vercel after changing env; wake Render (free tier sleeps ~50s) |
| **502 / DB connection failed** | Wrong `DB_URL` or firewall | Check credentials; allow external connections on MySQL host; use SSL params in URL |
| **Flyway / schema error** | Old DB state | Use fresh database or repair Flyway; see provider docs |
| **Blank page on refresh** | SPA routing | `frontend/vercel.json` rewrites to `index.html` (included) |
| **Build fails on Render** | Wrong root directory | Set Root Directory to `backend`; use `mvn clean package -DskipTests` |
| **Data empty but app works** | New empty DB | Use UI to add patients; 5 doctors seeded by Flyway V2 |
| **Env not applied on Vercel** | `VITE_*` baked at build | Change env → **Redeploy** frontend |

---

## Order of deployment

1. MySQL → 2. Render (backend) → 3. Vercel (frontend with `VITE_API_URL`)

Never deploy frontend before backend URL is known.
