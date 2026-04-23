# TaskFlow — Frontend (Next.js 14)

A clean, responsive task-management dashboard built with the Next.js App Router.

## Stack

- **Next.js 14** (App Router, React Server Components where applicable)
- **TypeScript** in strict mode
- **Firebase Auth** (email/password) on the client
- **TanStack Query** for server state, caching, and mutations
- **Tailwind CSS** for styling
- **Sonner** for toast notifications
- **lucide-react** icons

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout + providers
│   ├── page.tsx                # Landing
│   ├── globals.css             # Tailwind + design tokens
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── dashboard/page.tsx      # Protected task dashboard
├── components/
│   ├── providers.tsx           # React-Query + Auth + Toaster
│   ├── task-item.tsx           # Single task card (toggle, edit, delete)
│   └── add-task-form.tsx       # Inline "add task" composer
├── hooks/
│   ├── use-auth.tsx            # AuthProvider + useAuth()
│   └── use-tasks.ts            # useTasks, useCreateTask, ...
├── lib/
│   ├── firebase.ts             # Firebase Web SDK init
│   ├── api.ts                  # fetch wrapper w/ Firebase ID-token
│   └── utils.ts                # cn(), formatters
└── types/
    └── task.ts
```

## 🔧 Local Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Create a Firebase project
1. Go to [Firebase Console](https://console.firebase.google.com/) → **Add project**.
2. In **Authentication** → **Sign-in method**, enable **Email/Password**.
3. In **Project settings** → **Your apps** → add a **Web app**.
4. Copy the config values into `.env.local` (see step 3).

### 3. Create `.env.local`
```bash
cp .env.example .env.local
```

Fill in:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### 4. Run the dev server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

> 🔌 **Make sure the backend is running** at the URL in `NEXT_PUBLIC_API_BASE_URL`.
> See `../backend/README.md`.

## 🏗️ Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint (via `next lint`) |
| `npm run typecheck` | TypeScript strict check |

## 🚀 Deploy to Vercel

1. Push this repo to GitHub.
2. Visit [vercel.com/new](https://vercel.com/new) → import the repo → select the `frontend/` directory as the **Root Directory**.
3. Under **Environment Variables**, paste every `NEXT_PUBLIC_*` var from your `.env.local`.
4. Set `NEXT_PUBLIC_API_BASE_URL` to the public URL of your deployed backend.
5. Click **Deploy**.

Vercel will auto-detect Next.js and build. Subsequent pushes auto-deploy.

### Firebase authorized domains
In Firebase Console → **Authentication** → **Settings** → **Authorized domains**, add your Vercel domain (e.g. `your-app.vercel.app`).

### CORS
In your backend `appsettings.json`, add your Vercel URL under `Cors.AllowedOrigins`, e.g.:
```json
"Cors": {
  "AllowedOrigins": [
    "http://localhost:3000",
    "https://your-app.vercel.app"
  ]
}
```

## 🧭 Features

- ✅ Email/password sign-up & sign-in (Firebase)
- ✅ Auto-redirect: signed-in → `/dashboard`, signed-out → `/login`
- ✅ Create / read / update / delete tasks
- ✅ Inline edit task title & description
- ✅ Filter: All / Pending / Completed
- ✅ Loading skeletons, empty states, error toasts, retry
- ✅ Responsive (mobile-first), accessible focus states
- ✅ Every API request signed with a fresh Firebase ID token

## 🔒 Security model

- Firebase handles user credentials — the frontend never sees passwords after login.
- Every API request includes `Authorization: Bearer <ID_TOKEN>` (short-lived, 1h).
- The backend validates the token against your Firebase project before any DB access.

## 🐛 Troubleshooting

| Symptom | Fix |
|---------|-----|
| `auth/api-key-not-valid` | Double-check `NEXT_PUBLIC_FIREBASE_API_KEY`; restart dev server after changing `.env.local`. |
| Requests return 401 | Backend can't verify the token — confirm `Firebase:ProjectId` in backend `appsettings.json` matches your frontend project. |
| CORS error in browser | Add frontend origin to backend `Cors:AllowedOrigins`. |
| Stuck on Vercel build | Ensure **Root Directory** is set to `frontend` and all env vars are provided. |
