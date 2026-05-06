# Air Cargo Management System - Deployment Guide

This guide walks you through deploying the application with a live URL.

**Final Result:**
- Frontend: `https://air-cargo-xxx.vercel.app`
- Backend API: `https://air-cargo-api-xxx.onrender.com`
- Database: Neon PostgreSQL (free tier)

---

## Prerequisites

- GitHub account (to push the code)
- Vercel account (free) — https://vercel.com
- Render account (free) — https://render.com
- Neon account (free) — https://neon.tech

---

## Step 1: Push Code to GitHub

### 1.1 Create a GitHub Repository

1. Go to https://github.com/new
2. Repository name: `air-cargo`
3. Visibility: **Private** (recommended)
4. Do NOT initialize with README (we already have one)
5. Click **"Create repository"**

### 1.2 Push Local Code

```bash
cd /Users/apple/work/air-cargo

# Initialize git (if not done)
git init
git add -A
git commit -m "Initial MVP: Air Cargo Management System"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/air-cargo.git
git branch -M main
git push -u origin main
```

### 1.3 Verify

- Go to your GitHub repo URL
- Confirm you see `backend/`, `frontend/`, `README.md`, etc.

---

## Step 2: Set Up Database (Neon)

### 2.1 Create Neon Account

1. Go to https://neon.tech
2. Sign up (GitHub login works)
3. Click **"Create a project"**

### 2.2 Create Project

| Field | Value |
|-------|-------|
| Project name | `air-cargo` |
| Postgres version | 16 (default) |
| Region | Pick closest to your users (e.g., `US East` or `EU West`) |

4. Click **"Create project"**

### 2.3 Get Connection String

1. After creation, you'll see the **Connection Details** panel
2. Select **"Pooled connection"** (important for serverless)
3. Copy the connection string. It looks like:

```
postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/air_cargo?sslmode=require
```

4. **Save this string** — you'll need it for Render deployment

### 2.4 Run Migrations on Neon

From your local terminal:

```bash
cd /Users/apple/work/air-cargo/backend

# Temporarily set DATABASE_URL to your Neon connection string
export DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/air_cargo?sslmode=require"

# Run migration
npx prisma migrate deploy

# Seed the database with demo data
npx ts-node prisma/seed.ts
```

**Expected output:**
```
1 migration(s) applied successfully.
Created admin user: admin@aircargo.com
Created 5 customers
Created 8 shipments with status history
```

### 2.5 Verify Database

```bash
npx prisma studio
```
This opens a browser UI at http://localhost:5555 where you can browse the data.

---

## Step 3: Deploy Backend (Render)

### 3.1 Create Render Account

1. Go to https://render.com
2. Sign up with GitHub (recommended — gives repo access)

### 3.2 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository (`air-cargo`)
3. Configure:

| Setting | Value |
|---------|-------|
| Name | `air-cargo-api` |
| Region | Same region as your Neon database |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install && npx prisma generate && npm run build` |
| Start Command | `node dist/main.js` |
| Instance Type | **Free** |

### 3.3 Add Environment Variables

Click **"Environment"** tab and add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon pooled connection string from Step 2.3 |
| `JWT_SECRET` | Any random string (e.g., `mY-sUp3r-S3cr3t-K3y-2024!`) |
| `CORS_ORIGIN` | `https://air-cargo-xxx.vercel.app` _(update after Step 4)_ |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

> **Note:** You'll come back to update `CORS_ORIGIN` after deploying the frontend.

### 3.4 Deploy

1. Click **"Create Web Service"**
2. Wait for the build to complete (3-5 minutes)
3. Once deployed, you'll get a URL like: `https://air-cargo-api-xxxx.onrender.com`

### 3.5 Verify Backend

Test the API in your browser or terminal:

```bash
# Health check (should return 401 - means the server is running with auth guard)
curl https://air-cargo-api-xxxx.onrender.com/api/dashboard/stats

# Login test
curl -X POST https://air-cargo-api-xxxx.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aircargo.com","password":"admin123"}'
```

**Expected:** JSON response with `access_token`

> **Note:** Free tier on Render spins down after 15 min of inactivity. First request after sleep takes ~30 seconds.

---

## Step 4: Deploy Frontend (Vercel)

### 4.1 Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub

### 4.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Select your `air-cargo` repository
3. Configure:

| Setting | Value |
|---------|-------|
| Project Name | `air-cargo` |
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### 4.3 Add Environment Variable

Under **"Environment Variables"**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://air-cargo-api-xxxx.onrender.com/api` |

> Replace `xxxx` with your actual Render URL from Step 3.4

### 4.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (1-2 minutes)
3. You'll get a URL like: `https://air-cargo-xxx.vercel.app`

### 4.5 Verify Frontend

1. Open `https://air-cargo-xxx.vercel.app` in browser
2. You should see the login page
3. Login with `admin@aircargo.com` / `admin123`

---

## Step 5: Update CORS (Important!)

Now that you have the Vercel URL, go back to Render and update:

1. Go to Render dashboard → `air-cargo-api` service
2. Click **"Environment"**
3. Update `CORS_ORIGIN` to your Vercel URL: `https://air-cargo-xxx.vercel.app`
4. Click **"Save Changes"**
5. The service will auto-redeploy

---

## Step 6: Final Verification

### Test all features:

| Test | URL | Expected |
|------|-----|----------|
| Login | `/login` | Successful login, redirect to dashboard |
| Dashboard | `/` | Shows stats (8 shipments, 5 customers) |
| Shipments list | `/shipments` | Table with 8 shipments |
| Create shipment | `/shipments/new` | Form works, new shipment appears |
| Update status | `/shipments/:id` | Status timeline updates |
| Customers list | `/customers` | Table with 5 customers |
| Create customer | `/customers/new` | Form works, new customer appears |
| Public tracking | `/track` | Enter AWB-20260503-1002, see timeline |

### Share with client:

**Frontend URL:** `https://air-cargo-xxx.vercel.app`
**Tracking Page (public):** `https://air-cargo-xxx.vercel.app/track`
**Demo Login:** admin@aircargo.com / admin123

---

## Troubleshooting

### "Network Error" or CORS error in browser

- Verify `CORS_ORIGIN` on Render matches your exact Vercel URL (no trailing slash)
- Check browser console for the exact error
- Make sure `VITE_API_URL` on Vercel includes `/api` at the end

### Login returns 401 or "Invalid credentials"

- Make sure you ran `npx ts-node prisma/seed.ts` against the Neon database
- Verify `DATABASE_URL` on Render points to Neon (not localhost)

### Backend takes 30+ seconds to respond

- Normal for Render free tier (cold start after 15 min inactivity)
- First request wakes up the server, subsequent requests are fast
- Upgrade to Render paid tier ($7/mo) to keep it always-on

### Frontend shows blank page

- Check Vercel build logs for errors
- Verify `VITE_API_URL` is set correctly (must include `/api`)
- Check browser console for JavaScript errors

### Database connection errors

- Verify Neon project is active (not paused)
- Use the **pooled** connection string (has `-pooler` in hostname)
- Ensure `?sslmode=require` is at the end of the URL

---

## Cost Summary

| Service | Plan | Monthly Cost |
|---------|------|-------------|
| Neon (Database) | Free tier | $0 |
| Render (Backend) | Free tier | $0 |
| Vercel (Frontend) | Hobby | $0 |
| **Total** | | **$0/month** |

**Free tier limitations:**
- Render: Server sleeps after 15 min, cold start ~30s
- Neon: 0.5 GB storage, auto-suspends after 5 min idle
- Vercel: 100 GB bandwidth/month

**For production (recommended upgrade):**
- Render Starter: $7/month (always-on)
- Neon Launch: $19/month (more storage, no auto-suspend)
- Vercel Pro: $20/month (more bandwidth, team features)

---

## Custom Domain (Optional)

### Vercel (Frontend)
1. Go to Vercel → Project Settings → Domains
2. Add your domain: e.g., `cargo.yourcompany.com`
3. Add the DNS records shown (CNAME or A record)

### Render (Backend)
1. Go to Render → Service Settings → Custom Domains
2. Add your domain: e.g., `api.cargo.yourcompany.com`
3. Add the DNS records shown

Then update:
- `VITE_API_URL` on Vercel to `https://api.cargo.yourcompany.com/api`
- `CORS_ORIGIN` on Render to `https://cargo.yourcompany.com`

---

## Quick Reference Commands

```bash
# Run migrations on production database
DATABASE_URL="neon-url-here" npx prisma migrate deploy

# Seed production database
DATABASE_URL="neon-url-here" npx ts-node prisma/seed.ts

# View production database
DATABASE_URL="neon-url-here" npx prisma studio

# Check Render logs
# Go to: Render Dashboard → air-cargo-api → Logs

# Redeploy Vercel
# Go to: Vercel Dashboard → air-cargo → Deployments → Redeploy
```
