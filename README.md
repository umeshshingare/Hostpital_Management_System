# Hospital Management System

Modern full-stack Hospital Management System built using React, Spring Boot, and MySQL.

## 🚀 Live Deployment

### Frontend (Vercel)
https://hostpital-management-system-lyart.vercel.app

### Backend API (Render)
https://hostpital-management-system.onrender.com


---

## ✨ Features

- Patient registration & management
- Doctor management system
- Appointment booking
- Appointment cancellation
- Dashboard statistics
- RESTful API architecture
- MySQL database integration
- Flyway database migrations
- Docker support
- Cloud deployment ready

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Axios, React Router |
| Backend | Spring Boot, JPA, Hibernate |
| Database | MySQL |
| Deployment | Vercel, Render |
| Tools | Docker, Flyway |

---

## 📁 Project Structure

```bash
Hospital-Management-System/
│
├── frontend/
├── backend/
├── docs/
├── docker-compose.yml
├── render.yaml
└── README.md
```

---

## ⚙️ Local Setup

### Clone Repository

```bash
git clone https://github.com/umeshshingare/Hostpital_Management_System.git
cd Hostpital_Management_System
```

---

## 🔧 Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs on:

```bash
http://localhost:8080
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend

```env
DB_URL=
DB_USERNAME=
DB_PASSWORD=
CORS_ALLOWED_ORIGINS=
```

### Frontend

```env
VITE_API_URL=
```

---

## 📌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | Get patients |
| POST | `/api/patients` | Add patient |
| GET | `/api/doctors` | Get doctors |
| POST | `/api/doctors` | Add doctor |
| GET | `/api/appointments` | Get appointments |
| POST | `/api/appointments` | Book appointment |
| DELETE | `/api/appointments/{id}` | Cancel appointment |

---

## 🌍 Deployment

### Frontend
Deployed on Vercel.

### Backend
Deployed on Render using Docker.

### Database
Hosted on Railway MySQL.
