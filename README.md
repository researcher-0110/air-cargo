# Air Cargo Management System

Full-stack air cargo management system with shipment tracking, customer management, and admin dashboard.

## Tech Stack

- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: React + Vite + Tailwind CSS + TanStack Query
- **Auth**: JWT-based authentication

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech) free tier)

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/air_cargo"
JWT_SECRET="your-secret-key"
CORS_ORIGIN="http://localhost:5173"
PORT=3000
```

Run migrations and seed:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Start the server:
```bash
npm run start:dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Demo Credentials
- Email: `admin@aircargo.com`
- Password: `admin123`

## Deployment

### Backend (Render.com)
- Root directory: `backend`
- Build: `npm install && npx prisma generate && npm run build`
- Start: `node dist/main.js`
- Env vars: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`

### Frontend (Vercel)
- Root directory: `frontend`
- Build: `npm run build`
- Output: `dist`
- Env vars: `VITE_API_URL`

### Database (Neon)
- Create free PostgreSQL instance at neon.tech
- Use the pooled connection string as `DATABASE_URL`

## Features
- Admin authentication (JWT)
- Dashboard with live stats
- Shipment CRUD with AWB tracking
- Customer management
- Status timeline (BOOKED → ACCEPTED → IN_TRANSIT → ARRIVED → DELIVERED)
- Public shipment tracking page
