# TaskFlow

TaskFlow is a full-stack task manager I built to implement a real production-style flow using `Next.js`, `ASP.NET Core Web API`, `MySQL`, and `Firebase Authentication`.

The goal of this project is simple: authenticated users should be able to manage their own tasks end-to-end, with proper backend validation, user-level data isolation, and a deployable frontend + backend setup.

## Required Stack Mapping

- Frontend: `Next.js` (React + TypeScript)
- Backend: `ASP.NET Core 8 Web API` (C#)
- Database: `MySQL`
- Authentication: `Firebase Email/Password`

## Live Links

- Frontend (Vercel): add your URL here
- Backend (Railway): add your URL here
- Repository: add your URL here

## Core Features Implemented

- Firebase email/password registration and login
- Protected dashboard routes for authenticated users only
- Task CRUD API:
  - `GET /api/tasks`
  - `POST /api/tasks`
  - `PUT /api/tasks/{id}`
  - `DELETE /api/tasks/{id}`
- Input validation (example: title is required)
- User-scoped task data using Firebase UID
- Filter tabs for `All`, `Pending`, and `Completed`
- Loading states and error states in frontend

## Project Structure

```text
TASK FLOW/
├─ frontend/                        # Next.js app (UI)
│  ├─ src/app/
│  ├─ src/components/
│  ├─ src/hooks/
│  └─ src/lib/
├─ backend/                         # ASP.NET Core API
│  ├─ src/TaskFlow.Api/
│  │  ├─ Controllers/
│  │  ├─ Data/
│  │  ├─ DTOs/
│  │  ├─ Middleware/
│  │  ├─ Models/
│  │  └─ Services/
│  └─ railway.json
├─ ARCHITECTURE.md
└─ README.md
```

## Local Setup

## 1) Backend

From project root:

```bash
dotnet restore backend/src/TaskFlow.Api/TaskFlow.Api.csproj
dotnet run --project backend/src/TaskFlow.Api/TaskFlow.Api.csproj
```

Required backend environment variables:

- `ConnectionStrings__DefaultConnection`
- `Firebase__ProjectId`
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` (raw JSON string)
- `Cors__AllowedOrigins` (comma-separated origins)

## 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Required frontend environment variables:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## API Endpoints

All task endpoints require `Authorization: Bearer <Firebase ID Token>`.

- `GET /api/tasks` (supports optional `?status=all|pending|completed`)
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`
- `GET /api/health`

## Tradeoffs and Decisions

- I used Firebase Auth for identity, but kept task data in MySQL for relational querying and persistence.
- I used middleware-based token verification so every `/api/*` request is uniformly protected.
- I kept the API focused and simple (single task resource) rather than over-engineering extra layers.
- I added startup schema compatibility fixes for production reliability because hosted MySQL state may drift from local expectations.

## Real Issues I Fixed During Deployment

- Firebase Admin SDK initialization failures from malformed credential variables
- CORS for dynamic Vercel preview domains
- Frontend API base URL mismatch (`/api` duplication issue)
- Misleading auth errors caused by middleware catching downstream exceptions
- MySQL schema drift in production (`due_date` and `priority` column mismatches)

## Deployment Notes

- Frontend is deployed to Vercel with `frontend` as root directory.
- Backend is deployed on Railway with a MySQL service.

## Verification Checklist

- Register/login works with Firebase
- Health endpoint returns `firebase: initialized`
- `GET /api/tasks` works for authenticated users
- Create, update, delete task flows work from UI
- Filter tabs (`All`, `Pending`, `Completed`) work

## License

MIT
