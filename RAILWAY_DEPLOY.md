# Railway Deployment Guide

Deploy TaskFlow backend to Railway with MySQL database.

## Prerequisites

- [Railway account](https://railway.app)
- [Railway CLI](https://docs.railway.app/develop/cli) installed (optional)
- Firebase project with service account credentials

## 1. Create MySQL Database on Railway

### Option A: Railway Dashboard
1. Go to [railway.app](https://railway.app) → New Project
2. Click "New" → Database → Add MySQL
3. Wait for provisioning (takes ~1 minute)
4. Click on the MySQL service → Connect tab
5. Copy the "MySQL Connection URL" (format: `mysql://user:password@host:port/database`)

### Option B: MySQL from Template
Use Railway's MySQL template if available.

## 2. Deploy Backend to Railway

### Using Railway CLI

```bash
cd backend/src/TaskFlow.Api

# Login to Railway
railway login

# Link to project (or create new)
railway init

# Set environment variables
railway vars set ConnectionStrings__DefaultConnection="mysql://..."
railway vars set Firebase__ProjectId="your-project-id"
railway vars set GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account",...}'
railway vars set ASPNETCORE_ENVIRONMENT="Production"

# Deploy
railway up
```

### Using Railway Dashboard (GitHub Integration)

1. Push backend code to GitHub
2. Railway Dashboard → New Project → Deploy from GitHub repo
3. Add environment variables (see below)
4. Deploy

## 3. Required Environment Variables

| Variable | Value | Source |
|----------|-------|--------|
| `ConnectionStrings__DefaultConnection` | MySQL connection string | Railway MySQL Connect tab |
| `Firebase__ProjectId` | Your Firebase project ID | Firebase Console |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | Firebase service account JSON (as string) | Firebase Console → Service accounts |
| `Cors__AllowedOrigins__0` | Frontend URL (e.g., `https://taskflow.vercel.app`) | Your Vercel deployment |

### Getting Firebase Service Account JSON

1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download JSON file
4. Convert to string (remove newlines) or use base64 encoding

**Example JSON format:**
```json
{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
```

## 4. Update Frontend API URL

After Railway deployment, update your frontend `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend.up.railway.app
```

## 5. Railway-Specific Notes

### Connection String Format

Railway provides a MySQL URL like:
```
mysql://root:password@monorail.proxy.rlwy.net:19186/railway
```

**Convert to .NET/Pomelo format:**
```
Server=monorail.proxy.rlwy.net;Port=19186;Database=railway;User=root;Password=YOUR_PASSWORD;SslMode=Required;
```

**Required components:**
- `Server` - Host from Railway (e.g., `monorail.proxy.rlwy.net`)
- `Port` - Port from Railway (e.g., `19186`)
- `Database` - Usually `railway`
- `User` - Usually `root`
- `Password` - From Railway Connect tab
- `SslMode=Required` - Required for Railway connections

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `Can't connect to MySQL` | Check if Railway MySQL is running (green status) |
| `Firebase auth failed` | Verify `GOOGLE_APPLICATION_CREDENTIALS_JSON` is valid |
| `CORS errors` | Add your Vercel domain to `Cors__AllowedOrigins__0` |
| `Database migration failed` | Run `railway run dotnet ef database update` locally |

## 6. Verify Deployment

```bash
# Health check
curl https://your-backend.up.railway.app/api/health

# Should return: {"status":"healthy","timestamp":"..."}
```

## Railway Project Structure

```
Railway Project: taskflow-api
├── Service: taskflow-api (API)
│   └── Deploy from GitHub
├── Service: MySQL (Database)
│   └── Provisioned by Railway
└── Variables
    ├── ConnectionStrings__DefaultConnection
    ├── Firebase__ProjectId
    └── GOOGLE_APPLICATION_CREDENTIALS_JSON
```

## Alternative: Docker Deployment on Railway

If you prefer Docker:

```dockerfile
# Dockerfile in backend/
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore src/TaskFlow.Api/TaskFlow.Api.csproj
RUN dotnet publish src/TaskFlow.Api/TaskFlow.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5000
ENTRYPOINT ["dotnet", "TaskFlow.Api.dll"]
```

Railway auto-detects this Dockerfile during deployment.

## Next Steps

1. Deploy frontend to Vercel
2. Add Railway backend URL to Vercel environment variables
3. Add Vercel domain to Railway CORS settings
4. Test end-to-end authentication and task CRUD

See `backend/README.md` for local development setup.
