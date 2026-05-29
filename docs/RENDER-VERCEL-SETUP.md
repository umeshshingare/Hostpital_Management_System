# Step-by-step: Render (backend) + Vercel (frontend)

Use this checklist while filling each form. Repo: [Hostpital_Management_System](https://github.com/umeshshingare/Hostpital_Management_System)

---

## Part A — Railway MySQL (already done)

You have Railway MySQL. Write down:

- [ ] `MYSQLHOST` = ___________________
- [ ] `MYSQLPORT` = ___________________
- [ ] `MYSQLUSER` = ___________________
- [ ] `MYSQLPASSWORD` = ___________________
- [ ] `MYSQLDATABASE` = ___________________ (often `railway`)

Build JDBC URL (keep this for Render):

```
jdbc:mysql://[HOST]:[PORT]/[DATABASE]?useSSL=true&requireSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

Details: [RAILWAY-MYSQL.md](./RAILWAY-MYSQL.md)

---

## Part B — Render Web Service (backend)

### B1. Create service

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. **New +** → **Web Service**
3. Connect **GitHub** → select repo **`Hostpital_Management_System`**
4. Click **Connect**

### B2. Fill the form (important)

| Field | What to enter |
|-------|----------------|
| **Name** | `hospital-management-api` (or any name) |
| **Project** | `HMS` (optional — matches your screenshot) |
| **Region** | `Oregon (US West)` or same as your other services |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime / Language** | **Docker** (Java is not in Render’s list — our `backend/Dockerfile` builds the Spring Boot app) |
| **Dockerfile Path** | `./Dockerfile` (default when root is `backend`) |
| **Build Command** | *(leave empty — Docker builds everything)* |
| **Start Command** | *(leave empty — defined in Dockerfile)* |
| **Instance type** | Free (or paid) |

> **Important:** Do **not** pick Rust, Node, or Python. Select **Docker** only.

### B3. Advanced (expand if hidden)

| Field | Value |
|-------|--------|
| **Health Check Path** | `/actuator/health` |

### B4. Environment variables

Click **Add Environment Variable** for each:

| Key | Value |
|-----|--------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_URL` | Your full JDBC URL from Part A |
| `DB_USERNAME` | Railway `MYSQLUSER` |
| `DB_PASSWORD` | Railway `MYSQLPASSWORD` |
| `CORS_ALLOWED_ORIGIN_PATTERNS` | `https://*.vercel.app` |
| `CORS_ALLOWED_ORIGINS` | Leave empty for now; add Vercel URL after Part C |

### B5. Deploy

1. Click **Create Web Service**
2. Wait for build (5–10 min first time)
3. Copy your service URL, e.g. `https://hospital-management-api.onrender.com`

### B6. Test backend

Open in browser:

```
https://YOUR-SERVICE.onrender.com/actuator/health
```

Expected: `{"status":"UP"}`

Optional:

```
https://YOUR-SERVICE.onrender.com/api/doctors
```

Expected: JSON array with 5 doctors (Flyway seed).

If **502 / failed deploy**: open **Logs** → check DB_URL, username, password.

---

## Part C — Vercel (frontend)

Deploy **after** Render URL works.

### C1. Import project

1. [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import **`Hostpital_Management_System`** from GitHub

### C2. Configure project

| Field | Value |
|-------|--------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` (click Edit → set to `frontend`) |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### C3. Environment variables

Before first deploy, add:

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://YOUR-SERVICE.onrender.com` |

Rules:
- Use **https**
- **No** trailing slash
- Must be Render URL from Part B5

### C4. Deploy

1. Click **Deploy**
2. Wait for build (~1–2 min)
3. Copy production URL, e.g. `https://hostpital-management-system.vercel.app`

### C5. Fix CORS on Render

Go back to **Render** → your service → **Environment**:

| Key | Value |
|-----|--------|
| `CORS_ALLOWED_ORIGINS` | `https://YOUR-APP.vercel.app` (exact URL from C4) |

Save → Render will redeploy automatically.

### C6. Test full app

1. Open Vercel URL
2. Dashboard should show stats (doctors count ≥ 5)
3. Register a patient → should succeed
4. Book appointment

---

## Part D — Quick reference

| Platform | Root folder | Main env vars |
|----------|-------------|----------------|
| Railway | — | `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD` |
| Render | `backend` | `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `CORS_*` |
| Vercel | `frontend` | `VITE_API_URL` |

**Deploy order:** Railway (done) → Render → Vercel → update `CORS_ALLOWED_ORIGINS` on Render

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Wrong language (Rust, Node, etc.) | Select **Docker**; Root Directory = `backend` |
| Root Directory empty | Set `backend` on Render, `frontend` on Vercel |
| `VITE_API_URL` missing | Add on Vercel, redeploy |
| CORS error | Set `CORS_ALLOWED_ORIGINS` to exact Vercel URL |
| DB access denied | Recheck Railway host/port/user/password in `DB_URL` |
| First API call slow | Render free tier cold start ~50 seconds |
