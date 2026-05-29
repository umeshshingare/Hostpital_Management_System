# Railway MySQL → Project configuration

**Never commit real passwords to GitHub.** Put credentials only in:
- Render → Environment (backend)
- Local file `.env` (gitignored)

---

## 1. Find credentials in Railway

1. Open [Railway Dashboard](https://railway.app) → your project → **MySQL** service.
2. Go to **Variables** or **Connect**.
3. Copy these (names may vary slightly):

| Railway variable | Used for |
|------------------|----------|
| `MYSQLHOST` | Host in JDBC URL |
| `MYSQLPORT` | Port (often `3306`) |
| `MYSQLUSER` | `DB_USERNAME` on Render |
| `MYSQLPASSWORD` | `DB_PASSWORD` on Render |
| `MYSQLDATABASE` | Database name (use `railway` or create `hospital`) |

If Railway shows **`MYSQL_URL`** or **`DATABASE_URL`** like:
`mysql://user:pass@host:port/railway`  
convert it to JDBC (see below).

---

## 2. Build `DB_URL` for Render (Spring Boot)

Replace placeholders with your Railway values:

```
jdbc:mysql://MYSQLHOST:MYSQLPORT/MYSQLDATABASE?useSSL=true&requireSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

**Example** (fake values):

```
jdbc:mysql://containers-us-west-123.railway.app:6543/railway?useSSL=true&requireSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

### Optional: use database name `hospital`

Railway default DB is often `railway`. Both work. To use `hospital`:

1. Connect with Railway’s MySQL client / Query tab.
2. Run: `CREATE DATABASE IF NOT EXISTS hospital;`
3. Use `/hospital` in `DB_URL` instead of `/railway`.

Flyway will create tables on first backend start.

---

## 3. Map to Render environment variables

| Render key | Value from Railway |
|------------|-------------------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_URL` | Full JDBC string (section 2) |
| `DB_USERNAME` | `MYSQLUSER` |
| `DB_PASSWORD` | `MYSQLPASSWORD` |
| `CORS_ALLOWED_ORIGINS` | Your Vercel URL (after Step 3 in DEPLOYMENT.md) |
| `CORS_ALLOWED_ORIGIN_PATTERNS` | `https://*.vercel.app` |

---

## 4. Local testing with Railway DB (optional)

Create `.env` in project root (already gitignored):

```env
DB_URL=jdbc:mysql://YOUR_HOST:YOUR_PORT/railway?useSSL=true&requireSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=root
DB_PASSWORD=your_railway_password
SPRING_PROFILES_ACTIVE=prod
```

Run backend:

```powershell
cd backend
# Load env manually or use IDE run config
.\mvnw.cmd spring-boot:run
```

---

## 5. Verify database after deploy

1. Render logs: search for `Successfully applied` (Flyway).
2. Browser: `https://YOUR-API.onrender.com/actuator/health` → `"status":"UP"`.
3. Railway → MySQL → Query:

```sql
SHOW TABLES;
SELECT * FROM doctors;
```

You should see `patients`, `doctors`, `appointments` and 5 seeded doctors.
