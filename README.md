# TaskFlow

> A clean, professional full-stack task manager built with Next.js 14, ASP.NET Core 8, MySQL, and Firebase Authentication.

[![Frontend: Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-000?logo=next.js)](https://nextjs.org/)
[![Backend: ASP.NET Core](https://img.shields.io/badge/Backend-ASP.NET%20Core%208-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![Database: MySQL](https://img.shields.io/badge/Database-MySQL%208-4479A1?logo=mysql)](https://www.mysql.com/)
[![Auth: Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28?logo=firebase)](https://firebase.google.com/)

---

## ✨ Features

- 🔐 **Email/Password Authentication** powered by Firebase
- ✅ **Full Task CRUD** — create, read, update, delete with real-time UI
- 🎯 **Filtering** — view *All*, *Pending*, or *Completed* tasks
- 🚨 **Priority Levels** — set tasks as Low, Medium, or High priority
- 📅 **Due Dates** — schedule tasks with optional due date and time
- 🎨 **Clean responsive UI** — Tailwind CSS, modern design language with dark mode
- ⚡ **Loading & error states** everywhere
- 🛡️ **Per-user data isolation** — every row scoped to your Firebase UID
- 📦 **Production-ready** — Vercel-deployable frontend, Dockerized MySQL

## 🏗 Architecture

```
┌─────────────────┐      HTTPS + Bearer ID Token      ┌──────────────────┐
│   Next.js 14    │  ────────────────────────────►    │  ASP.NET Core 8  │
│   (Frontend)    │  ◄────────────────────────────    │     Web API      │
│  Firebase SDK   │           JSON                    │ Firebase Admin   │
└─────────────────┘                                   └────────┬─────────┘
                                                               │ EF Core
                                                               ▼
                                                       ┌───────────────┐
                                                       │   MySQL 8     │
                                                       └───────────────┘
```

## 📁 Project Structure

```
TaskFlow/
├── frontend/                  # Next.js 14 (App Router) — deploy to Vercel
│   ├── src/app/               # Pages (landing, login, register, dashboard)
│   ├── src/components/        # UI components
│   ├── src/lib/               # firebase.ts, api.ts, utils
│   └── src/hooks/             # useAuth, useTasks
│
├── backend/                   # ASP.NET Core 8 Web API
│   ├── src/TaskFlow.Api/
│   │   ├── Controllers/       # TasksController
│   │   ├── Models/            # TaskItem entity
│   │   ├── Data/              # AppDbContext (EF Core)
│   │   ├── DTOs/              # Request/response shapes
│   │   ├── Services/          # Business logic
│   │   └── Middleware/        # Firebase token verification
│   └── docker-compose.yml     # MySQL for local dev
│
├── README.md                  # You are here
└── TODO.md                    # Build checklist
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20+ and **npm**
- **.NET 8 SDK**
- **MySQL 8** (or Docker for the included compose file)
- A **Firebase project** with Email/Password sign-in enabled

### 1. Backend setup → see [`backend/README.md`](./backend/README.md)
### 2. Frontend setup → see [`frontend/README.md`](./frontend/README.md)

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Visit [vercel.com/new](https://vercel.com/new) → import repo → select `frontend/` as Root Directory
3. Add environment variables from `.env.example`
4. Set `NEXT_PUBLIC_API_BASE_URL` to your deployed backend URL
5. Deploy

### Backend (Azure/AWS/Render/Docker)
- Build: `dotnet publish src/TaskFlow.Api -c Release -o ./out`
- Deploy `./out` to any .NET 8 capable host
- Set environment variables for connection strings and Firebase config

### Database
- **Railway MySQL** (recommended) → see `RAILWAY_DEPLOY.md`
- PlanetScale, AWS RDS, Azure Database for MySQL
- Self-host MySQL 8 with `docker-compose.yml`

## 🔥 Firebase Setup

1. Create project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Email/Password** Authentication
3. Add Web app → copy config to `.env.local`
4. Download service account JSON for backend

## 🚃 Railway Quick Deploy

See `RAILWAY_DEPLOY.md` for detailed instructions.

```bash
# 1. Create MySQL on Railway Dashboard
# 2. Set environment variables:
railway vars set ConnectionStrings__DefaultConnection="mysql://..."
railway vars set Firebase__ProjectId="your-project"
railway vars set GOOGLE_APPLICATION_CREDENTIALS_JSON='{...}'
railway vars set Cors__AllowedOrigins__0="https://your-frontend.vercel.app"

# 3. Deploy
railway up
```

## 🛠 API Reference

All endpoints require `Authorization: Bearer <Firebase-ID-Token>`.

| Method | Endpoint              | Description                       |
|--------|-----------------------|-----------------------------------|
| GET    | `/api/tasks`          | List tasks (optional `?status=`)  |
| POST   | `/api/tasks`          | Create task (validates title)     |
| PUT    | `/api/tasks/{id}`     | Update task                       |
| DELETE | `/api/tasks/{id}`     | Delete task                       |

## 📝 License

MIT — Built with care.
