# Using the database after deployment

The app does **not** ship a database on Vercel or Render. You host **MySQL separately**, and the Spring Boot API connects to it.

## How schema is created (automatic)

On every backend start, **Flyway** runs migrations from `backend/src/main/resources/db/migration/`:

| Migration | Purpose |
|-----------|---------|
| `V1__schema.sql` | Creates `patients`, `doctors`, `appointments` tables |
| `V2__seed_doctors.sql` | Inserts 5 sample doctors |

You do **not** need to run SQL manually unless you want extra seed data.

## Recommended cloud MySQL providers

| Provider | Notes |
|----------|--------|
| [Railway](https://railway.app) | Easy MySQL plugin, connection URL in dashboard |
| [Aiven](https://aiven.io) | Free trial MySQL |
| [PlanetScale](https://planetscale.com) | MySQL-compatible (check JDBC URL format) |

## Connect Render backend to MySQL

1. Create a MySQL instance on your provider.
2. Create database `hospital` (or let JDBC URL create it if supported).
3. Copy host, port, user, password.
4. In **Render → your Web Service → Environment**, set:

```env
DB_URL=jdbc:mysql://HOST:PORT/hospital?useSSL=true&requireSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=your_user
DB_PASSWORD=your_password
SPRING_PROFILES_ACTIVE=prod
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

5. Redeploy. Check logs for `Successfully applied` Flyway messages.

## Managing data after deploy

### Via the web UI (normal use)

- **Patients / Doctors / Appointments** pages call the API; data is stored in MySQL automatically.

### Via provider console

- Railway / Aiven dashboards often include a **Query** or **Connect** tab.
- Run read-only checks, e.g.:

```sql
SELECT * FROM patients;
SELECT * FROM doctors;
SELECT * FROM appointments;
```

### Via MySQL client (Workbench, DBeaver, CLI)

Use the **public host** and credentials from your provider. Enable **SSL** if required.

```bash
mysql -h HOST -P PORT -u USER -p hospital
```

### Backup

Use your provider’s backup feature or:

```bash
mysqldump -h HOST -u USER -p hospital > backup.sql
```

## Local Docker MySQL (development)

```bash
docker compose up mysql -d
# Port 3307 on host — see README.md
```
