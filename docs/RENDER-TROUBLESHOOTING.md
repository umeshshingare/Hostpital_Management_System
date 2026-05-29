# Render backend failed — fix checklist

## Render dashboard settings (required)

| Field | Value |
|-------|--------|
| Language | **Docker** |
| Root Directory | `backend` |
| Dockerfile Path | `Dockerfile` |
| Build Command | *(empty)* |
| Start Command | *(empty)* |
| Health Check Path | `/actuator/health` |

---

## Environment variables on Render

Use **either** full `DB_URL` **or** Railway split variables:

### Option A — single JDBC URL (recommended)

| Key | Value |
|-----|--------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_URL` | `jdbc:mysql://HOST:PORT/railway?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true` |
| `DB_USERNAME` | from Railway `MYSQLUSER` |
| `DB_PASSWORD` | from Railway `MYSQLPASSWORD` |

Use Railway **public** host (TCP proxy), not `mysql.railway.internal`.

### Option B — Railway variable names

| Render key | Railway source |
|------------|----------------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `MYSQLHOST` | `MYSQLHOST` |
| `MYSQLPORT` | `MYSQLPORT` |
| `MYSQLUSER` | `MYSQLUSER` |
| `MYSQLPASSWORD` | `MYSQLPASSWORD` |
| `MYSQLDATABASE` | `MYSQLDATABASE` (often `railway`) |
| `DB_USERNAME` | same as `MYSQLUSER` |
| `DB_PASSWORD` | same as `MYSQLPASSWORD` |

Also set:

| Key | Value |
|-----|--------|
| `CORS_ALLOWED_ORIGIN_PATTERNS` | `https://*.vercel.app` |
| `CORS_ALLOWED_ORIGINS` | your Vercel URL, e.g. `https://xxx.vercel.app` |

---

## Common error → fix

| Log / symptom | Fix |
|---------------|-----|
| `COPY failed: multiple files...` | Fixed in Dockerfile — redeploy latest `main` from GitHub |
| `Access denied for user` | Wrong `DB_PASSWORD` or user; match Railway exactly |
| `Communications link failure` | Use Railway **public** host; enable public networking on MySQL |
| `requireSSL` / SSL errors | Use `useSSL=true` but remove `requireSSL=true` from URL if needed |
| Health check failed / timed out | Wait 3–5 min on first deploy; set Health Check Path `/actuator/health` |
| Build timeout | Free tier is slow; retry deploy |
| App starts then dies | Check **Logs** tab for Flyway or SQL errors |

---

## Verify after deploy

1. `https://YOUR-SERVICE.onrender.com/actuator/health` → `"status":"UP"`
2. `https://YOUR-SERVICE.onrender.com/api/doctors` → JSON with 5 doctors
3. Vercel: `VITE_API_URL` = same Render URL (no trailing `/`)

---

## Redeploy latest code

1. GitHub repo has latest `main`
2. Render → **Manual Deploy** → **Clear build cache & deploy**
