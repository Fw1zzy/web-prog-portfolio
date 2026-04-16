# Emmanuel Pascua — Portfolio (Full-Stack)

## 🏗️ Folder Structure (Fixed)

```
portfolio/                      # Root monorepo
├── package.json                # Monorepo workspaces (frontend, backend)
├── README.md                   # This file
├── .env.example                # Backend env template
├── TODO.md                     # Task tracker
├── frontend/                   # Vite + React app
│   ├── package.json            # Frontend deps
│   ├── vite.config.js          # Vite config + /api proxy → backend
│   ├── index.html              # App entry
│   ├── public/assets/images/   # ← All images here
│   └── src/                    # React source
└── backend/                    # Express + Mongo API
    ├── package.json            # Backend deps
    ├── server.js               # Runs on port 5001
    ├── .env                    # DB/JWT config (copy .env.example)
    └── controllers/routes/...
```

## 🚀 Quick Start

```bash
# Install all deps
npm run install:all

# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend   # http://localhost:5173 (proxies /api to backend)

# Or cd into folders:
cd frontend && npm run dev
cd backend && npm run dev
```

## Features

- Full-stack auth (Login/Register/Google OAuth/Reset Password)
- Posts/Comments CRUD (admin dashboard)
- Contact messages
- Theme toggle, loading screen, responsive
- Backend auto-seeds default admin

## Backend Setup

1. `cp backend/.env.example backend/.env`
2. Edit `backend/.env`: MongoDB URI, JWT_SECRET, ADMIN_EMAIL/PASSWORD
3. `npm run dev:backend` → Creates admin user

Frontend proxy: `/api/*` → `http://localhost:5001`

Done ✅ Folder structure fixed with frontend/backend separation!
