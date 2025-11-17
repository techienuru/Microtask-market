# JobBridge Backend

Backend API for the JobBridge application built with Express.js and PostgreSQL.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and setup:**

```bash
cd backend
npm install
```

2. **Create PostgreSQL database:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE jobbridge;
CREATE USER jobbridge_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE jobbridge_market TO jobbridge_user;
\q
```

3. **Environment setup:**

```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Run migrations:**

```bash
npm run migrate
# Or manually: psql $DATABASE_URL -f db/migrations/01_init.sql
```

5. **Seed database:**

```bash
npm run seed
```

6. **Start development server:**

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📋 Environment Variables

```env
DATABASE_URL=postgresql://username:password@localhost:5432/microtask_market
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
ADMIN_SEED_KEY=admin-seed-key-for-demo
ESCROW_ACCOUNT=demo-escrow-account-id
```

## 🗄️ Database Schema

### Core Tables

- **users** - User accounts with roles (worker, poster, manager, admin)
- **tasks** - Job postings with single/application modes
- **applications** - Applications for application-mode tasks
- **proofs** - Task completion evidence (photos, codes)
- **escrow** - Payment holding for high-value tasks
- **resolutions** - Dispute management
- **notifications** - User notifications
- **audit_logs** - Manager/admin action logging

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/request-otp` - Request OTP code
- `POST /api/auth/verify-otp` - Verify OTP code
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Tasks

- `GET /api/tasks` - List tasks (with filters)
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create task
- `POST /api/tasks/:id/reserve` - Reserve task (single mode)
- `POST /api/tasks/:id/apply` - Apply for task (application mode)
- `POST /api/tasks/:id/proof` - Upload completion proof
- `GET /api/tasks/:id/applicants` - Get task applicants

### Users

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/me/postings` - Get user's posted tasks

### Payments

- `POST /api/payments/escrow/create` - Create escrow
- `POST /api/payments/escrow/:id/release` - Release escrow
- `GET /api/payments/escrow` - Get escrow records

### Manager

- `GET /api/manager/disputes` - Get disputed tasks
- `POST /api/manager/disputes/:taskId/resolve` - Resolve dispute
- `GET /api/manager/overdue` - Get overdue confirmations
- `GET /api/manager/stats` - Get manager stats

### Admin

- `POST /api/admin/seed` - Seed database (requires ADMIN_SEED_KEY)
- `POST /api/admin/reset` - Reset database
- `GET /api/admin/stats` - Get admin stats
- `GET /api/admin/users` - Get all users

## 🔐 Authentication

The API uses JWT tokens with HTTP-only cookies:

- **Access Token**: 15-minute expiry, stored in `accessToken` cookie
- **Refresh Token**: 7-day expiry, stored in `refreshToken` cookie

All protected routes require the `accessToken` cookie to be present.

## 📁 File Uploads

Task completion proofs are uploaded to `/backend/uploads/` and served at `/uploads/` endpoint.

Supported formats: Images (JPG, PNG, GIF) up to 5MB

## 🛡️ Security Features

- Bcrypt password hashing (10 rounds)
- Parameterized SQL queries (prevents injection)
- CORS configured for frontend domain
- HTTP-only cookies for token storage
- Input validation and sanitization

## 🧪 Development

### Sample Users (after seeding)

- **Aunty Z** - `aunty.z@example.com` / `password123` (Poster)
- **Jide** - `jide@example.com` / `password123` (Worker)
- **Ngozi** - `ngozi@example.com` / `password123` (Worker, Trusted)
- **Sani** - `sani@example.com` / `password123` (Manager)

### Scripts

- `npm run dev` - Start with nodemon
- `npm start` - Production start
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed with demo data

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use secure JWT secrets
3. Configure SSL for database connection
4. Set up proper CORS origins
5. Use environment variables for all secrets

## 🚀 Deployment

### Backend Deployment (Render/Railway)

#### Deploy to Render

1. **Create Render account** and connect your GitHub repository
2. **Create PostgreSQL database**:
   - Go to Render Dashboard → New → PostgreSQL
   - Note the connection string (Internal Database URL)
3. **Create Web Service**:
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repo
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`
4. **Set Environment Variables**:
   ```
   DATABASE_URL=<your-render-postgres-url>
   NODE_ENV=production
   JWT_SECRET=<generate-strong-secret>
   JWT_REFRESH_SECRET=<generate-strong-secret>
   ADMIN_SEED_KEY=<your-admin-key>
   FRONTEND_URL=<your-vercel-frontend-url>
   COOKIE_DOMAIN=<your-backend-domain>
   ```
5. **Run Migration**: Use Render Shell or connect via psql:
   ```bash
   psql $DATABASE_URL -f db/migrations/01_init.sql
   ```

#### Deploy to Railway

1. **Create Railway account** and connect GitHub
2. **Add PostgreSQL**: Railway → New Project → Add PostgreSQL
3. **Deploy Backend**: Railway → New Project → Deploy from GitHub
4. **Set Environment Variables** (same as Render above)
5. **Run Migration**: Use Railway CLI or database console

### Frontend Deployment (Vercel)

1. **Create Vercel account** and connect GitHub repository
2. **Import Project**: Select your frontend repository
3. **Configure Build Settings**:
   - Framework Preset: Vite
   - Root Directory: `./` (or `frontend/` if monorepo)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```
5. **Deploy**: Vercel will auto-deploy on git push

### CORS & Cookies Configuration

**Important**: For production deployment with separate domains:

1. **Backend CORS Setup**:

   ```javascript
   // Add your frontend domain to ALLOWED_ORIGINS
   ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com
   ```

2. **Cookie Configuration**:

   ```javascript
   // Set secure cookies for production
   COOKIE_DOMAIN=.your-domain.com  // For subdomain sharing
   ```

3. **Frontend API Client**:
   ```javascript
   // Ensure credentials: 'include' is set (already configured)
   fetch(url, { credentials: "include" });
   ```

### Database Seeding in Production

```bash
# Method 1: Use admin endpoint (recommended)
curl -X POST https://your-backend.onrender.com/api/admin/seed \
  -H "X-Admin-Key: your-admin-seed-key"

# Method 2: Direct script execution
node scripts/seed.js
```

### File Uploads & S3 Integration

For production, consider migrating from local file storage to S3:

1. **Install AWS SDK**: `npm install aws-sdk`
2. **Update upload routes** to use presigned URLs:
   ```javascript
   // Generate presigned URL for client-side upload
   const uploadUrl = s3.getSignedUrl("putObject", {
     Bucket: "your-bucket",
     Key: `proofs/${taskId}-${Date.now()}.jpg`,
     Expires: 300,
     ContentType: "image/jpeg",
   });
   ```
3. **Frontend uploads directly to S3**, then saves URL to database

### Escrow Configuration

Set your escrow account ID for payment simulation:

```bash
ESCROW_ACCOUNT=demo-escrow-account-id
```

For real payments, integrate with:

- **Paystack** (Nigerian payments)
- **Flutterwave** (African payments)
- **Stripe** (International)

## 📊 Database Queries

The API uses a custom database wrapper (`src/lib/db.js`) that provides:

- Connection pooling
- Parameterized queries
- Transaction support
- Query logging in development

## 🔍 Monitoring

- All manager actions are logged to `audit_logs` table
- Query performance logging in development mode
- Error handling with proper HTTP status codes

---

**Built with Express.js + PostgreSQL for the JobBridge frontend**
