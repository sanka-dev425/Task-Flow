# TaskFlow Architecture

This document explains how data and authentication flow through the system.

## High-Level Flow

```text
Next.js UI -> Firebase Client SDK -> Firebase ID Token
          -> ASP.NET Core API (Bearer token verification via Firebase Admin SDK)
          -> EF Core -> MySQL
```

## Components

- Frontend (`frontend/`)
  - Built with Next.js (React + TypeScript)
  - Handles login/registration with Firebase Auth
  - Sends authenticated requests to backend with `Authorization: Bearer <idToken>`

- Backend (`backend/src/TaskFlow.Api/`)
  - ASP.NET Core Web API
  - `FirebaseAuthMiddleware` verifies Firebase ID tokens
  - `TasksController` exposes task CRUD endpoints
  - `TaskService` contains business logic and user-scoped operations
  - `AppDbContext` maps entities to MySQL tables via EF Core

- Database (MySQL)
  - Stores tasks per authenticated Firebase user
  - Uses `user_id` to isolate each user's data

## Request Lifecycle

1. User signs in on frontend using Firebase Email/Password.
2. Frontend gets Firebase ID token from current session.
3. Frontend calls API endpoint (for example `GET /api/tasks`) with Bearer token.
4. Backend middleware verifies token using Firebase Admin SDK.
5. Backend extracts Firebase UID and attaches it to request context.
6. Controller/service query MySQL only for that UID.
7. API returns JSON response to frontend.

## Security Model

- Only authenticated requests can access `/api/tasks*`.
- Firebase UID is treated as the application user identifier.
- Task queries are always filtered by UID (`user_id`) to prevent cross-user access.
- CORS is restricted to configured origins, with support for Vercel deployment domains.

## Data Model (Tasks)

Suggested/implemented columns:

- `id` (PK)
- `user_id` (Firebase UID)
- `title`
- `description`
- `is_completed`
- `priority`
- `due_date`
- `created_at`
- `updated_at`

## Operational Notes

- Health endpoint: `GET /api/health`
- Firebase admin credentials loaded from environment variables
- Railway deployment runs backend with MySQL and environment-based configuration
- Startup includes schema compatibility checks for legacy column drift in production
