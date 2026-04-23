# Railway Deployment Guide (Optional)

This guide is optional and helps deploy the TaskFlow backend to Railway with MySQL.

> For assignment evaluation, local setup via MySQL is already documented in `README.md` and `backend/README.md`.

## 1) Create Railway Services

Create a Railway project with:
- Service 1: `taskflow-api` (backend)
- Service 2: `MySQL`

## 2) Required Backend Variables

Set these in Railway for `taskflow-api`:

- `ConnectionStrings__DefaultConnection`
- `Firebase__ProjectId`
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` (raw Firebase service account JSON)
- `Cors__AllowedOrigins` (include your Vercel domain)
- `ASPNETCORE_ENVIRONMENT=Production`

## 3) Connection String Note

Railway gives either a MySQL URI or host/port credentials.
Use a .NET-compatible connection string, for example:

```text
Server=<host>;Port=<port>;Database=<db>;User=<user>;Password=<password>;SslMode=Required;
```

## 4) Deploy Backend

If your root directory for backend is `backend/`, configure Railway deploy settings accordingly.

Typical startup command:

```text
dotnet TaskFlow.Api.dll
```

## 5) Health Verification

After deploy, check:

```text
GET /api/health
```

Expected fields include:
- `status: healthy`
- `firebase: initialized`

## 6) Frontend API Base URL

Set Vercel environment variable:

```text
NEXT_PUBLIC_API_BASE_URL=https://<your-railway-backend>.up.railway.app
```

## 7) Troubleshooting

- `401` errors on tasks: verify Firebase Admin env vars and frontend ID token flow.
- `500` errors on tasks: check Railway logs for DB schema or connection issues.
- CORS errors: ensure your exact Vercel URL is present in `Cors__AllowedOrigins`.

