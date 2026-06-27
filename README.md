# Mini E-Commerce Store

A full-stack e-commerce platform built with the Next.js App Router. Users can browse products, manage a cart, and check out through Stripe. Admins manage inventory and review orders from a role-protected dashboard. Authentication uses JWT access tokens with rotating refresh tokens, and security-sensitive actions are recorded via audit logs and login-attempt tracking.

## Features

- **Product catalogue** — browse products with images, descriptions, pricing, and live stock levels
- **Cart** — client-side cart state managed with Zustand
- **Stripe checkout** — complete purchases through Stripe; orders store the Stripe payment ID (Not Working)
- **Authentication** — email/password auth with bcrypt-hashed passwords, JWT access tokens, and rotating refresh tokens
- **Role-based access** — `USER` and `ADMIN` roles; admin-only inventory and order management
- **Order lifecycle** — orders move through `PENDING → PAID → SHIPPED → DELIVERED` (or `CANCELLED`)
- **Soft deletes** — users carry a `deletedAt` field rather than being hard-deleted
- **Security logging** — `LoginAttempt` and `AuditLog` tables track sign-in attempts and sensitive actions

## Tech Stack

| Layer        | Technology                                   |
| ------------ | -------------------------------------------- |
| Framework    | Next.js 16 (App Router), React 19            |
| Language     | TypeScript                                   |
| Styling      | Tailwind CSS v4                              |
| State        | Zustand                                       |
| Database     | PostgreSQL                                    |
| ORM          | Prisma 6                                      |
| Auth         | jsonwebtoken (access + refresh), bcrypt       |
| Payments     | Stripe (`stripe` + `@stripe/stripe-js`)       |

## Getting Started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (local or hosted, e.g. Neon / Supabase)
- A Stripe account with API keys

### 1. Clone and install

```bash
git clone https://github.com/kurokuroki1/Mini-E-Commerce-Store.git
cd Mini-E-Commerce-Store
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Auth
JWT_ACCESS_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"



> Adjust the variable names to match your code if they differ. At minimum you need a `DATABASE_URL`, JWT secret(s), and Stripe keys.

### 3. Set up the database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command          | Description                       |
| ---------------- | --------------------------------- |
| `npm run dev`    | Start the development server      |
| `npm run build`  | Build for production              |
| `npm run start`  | Start the production server       |
| `npm run lint`   | Run ESLint                        |

## Data Model

The Prisma schema defines:

- **User** — accounts with `USER`/`ADMIN` roles, refresh tokens, audit logs, and soft-delete support
- **Product** — catalogue items with price, image, and stock
- **Order** / **OrderItem** — orders with status and a Stripe payment reference, broken into line items
- **RefreshToken** — stored rotating refresh tokens with expiry
- **LoginAttempt** — per-attempt sign-in log (email, IP, success)
- **AuditLog** — record of sensitive actions with optional JSON metadata

## Deployment

The app deploys cleanly to Vercel. Set the same environment variables in your Vercel project settings, and point `DATABASE_URL` at a hosted PostgreSQL instance. Run `prisma migrate deploy` against the production database before or during the build.

## Author

Built by **Myo Thiha Chit** — [@kurokuroki1](https://github.com/kurokuroki1)
