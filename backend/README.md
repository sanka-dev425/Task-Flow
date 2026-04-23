# TaskFlow API — Backend (ASP.NET Core 8)

Production-ready RESTful API for the TaskFlow application.

## Stack

- **.NET 8** Web API
- **Entity Framework Core 8** with **Pomelo MySQL provider**
- **MySQL 8**
- **Firebase Admin SDK** for ID-token verification
- **Swagger/OpenAPI** for interactive docs

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [MySQL 8](https://dev.mysql.com/downloads/mysql/) installed and running locally
- A Firebase project with Email/Password sign-in enabled

---

## 🔧 Local Setup

### 1. Create the MySQL database

Log in to your local MySQL server (using MySQL Workbench, DBeaver, or the `mysql` CLI) and run:

```sql
CREATE DATABASE taskflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'taskflow'@'localhost' IDENTIFIED BY 'taskflow_password';
GRANT ALL PRIVILEGES ON taskflow.* TO 'taskflow'@'localhost';
FLUSH PRIVILEGES;
```

This matches the default connection string in `appsettings.json`:

```
server=localhost;port=3306;database=taskflow;user=taskflow;password=taskflow_password
```

If you already have a MySQL user/database you want to reuse, just update the `ConnectionStrings:DefaultConnection` value in `appsettings.json` (or set it via an environment variable — see below).

> 💡 **Optional convenience:** if you'd rather not install MySQL locally, a ready-to-use `docker-compose.yml` is included. Run `docker compose up -d` from the `backend/` folder and it will provision the same database/user. This is **not required** by the spec — it's just a shortcut for evaluators.

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/) → your project → ⚙️ **Project settings** → **Service accounts**.
2. Click **Generate new private key** and download the JSON file.
3. Save it as `backend/src/TaskFlow.Api/firebase-service-account.json` (gitignored).
4. Open `appsettings.json` and set `Firebase:ProjectId` to your project ID.

> 💡 **Production tip:** instead of shipping the JSON, set the `GOOGLE_APPLICATION_CREDENTIALS` env var to the path of the credentials, or use Workload Identity / Managed Identity on your cloud provider.

### 3. Restore & Run

```bash
cd backend
dotnet restore
dotnet run --project src/TaskFlow.Api
```

The API will be available at:
- **HTTP**: http://localhost:5000
- **Swagger UI**: http://localhost:5000/swagger
- **Health check**: http://localhost:5000/api/health

The schema is auto-created in development via `EnsureCreated()`.

### 4. Generate EF Core migrations (optional, recommended for production)

```bash
cd backend/src/TaskFlow.Api
dotnet tool install --global dotnet-ef    # if not already installed
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 📡 API Endpoints

All `/api/tasks/*` endpoints require:
```
Authorization: Bearer <Firebase-ID-Token>
```

| Method | Endpoint              | Body                       | Returns                      |
|--------|-----------------------|----------------------------|------------------------------|
| GET    | `/api/health`         | —                          | `{ status, timestamp }`      |
| GET    | `/api/tasks`          | — (query: `?status=`)      | `TaskResponseDto[]`          |
| POST   | `/api/tasks`          | `CreateTaskDto`            | `TaskResponseDto` (201)      |
| PUT    | `/api/tasks/{id}`     | `UpdateTaskDto`            | `TaskResponseDto`            |
| DELETE | `/api/tasks/{id}`     | —                          | 204 No Content               |

### `CreateTaskDto`
```json
{
  "title": "Required, 1-200 chars",
  "description": "Optional, max 2000",
  "priority": "low|medium|high (default: medium)",
  "dueDate": "Optional, ISO-8601 datetime"
}
```

### `UpdateTaskDto`
```json
{
  "title": "Optional",
  "description": "Optional",
  "isCompleted": true,
  "priority": "low|medium|high",
  "dueDate": "ISO-8601 datetime or null"
}
```

### `TaskResponseDto`
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string|null",
  "isCompleted": false,
  "priority": "low|medium|high",
  "dueDate": "ISO-8601|null",
  "userId": "firebase-uid",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

### Error format
```json
{ "error": "Message", "details": { "field": ["error"] } }
```

Common status codes: `400` validation, `401` unauthenticated/invalid token, `404` not found.

---

## 🔒 Security Notes

- Every query is scoped to `WHERE user_id = <verified-uid>` — users cannot access tasks they don't own.
- Token verification is performed on **every** `/api/*` request (except `/api/health`).
- CORS is restricted to the origins in `appsettings.json` → `Cors:AllowedOrigins`.

## 🐳 Production Build

```bash
dotnet publish src/TaskFlow.Api -c Release -o ./out
```

Deploy `./out` to any host that runs the .NET 8 runtime (Azure App Service, AWS, Render, Docker, etc.).

## 🧪 Test the API quickly

Get an ID token from your frontend (or via Firebase REST API) and:

```bash
TOKEN="<your-firebase-id-token>"
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/tasks
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
     -d '{"title":"My first task"}' http://localhost:5000/api/tasks
