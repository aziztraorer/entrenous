# Backend Installation - Windows

## ✅ Prerequisites

Ensure you have installed:
- **Node.js 18.x or 20.x** → https://nodejs.org/ (use LTS version)
- **PostgreSQL 14+** → https://www.postgresql.org/download/windows/
- **Git** → https://git-scm.com/
- **npm** comes with Node.js

To verify:
```cmd
node --version
npm --version
psql --version
```

## 📥 Installation Steps

### 1. Extract the backend files

Extract `entre-nous-prompt3-backend.zip` to your `entre-nous\backend\` folder.

Your structure should look like:
```
entre-nous\
├── frontend\
├── backend\
│   ├── src\
│   ├── prisma\
│   ├── tests\
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   └── ... (other files)
└── docs\
```

### 2. Setup PostgreSQL Database

#### Option A: Using pgAdmin (GUI)

1. Open pgAdmin (comes with PostgreSQL)
2. Right-click on "Databases" → Create → Database
3. Name: `entre_nous`
4. Click Save

#### Option B: Using Command Line

Open PowerShell or Command Prompt:
```cmd
psql -U postgres
```

Then run:
```sql
CREATE DATABASE entre_nous;
```

Exit with `\q`

### 3. Create .env file

Create a file `backend\.env`:

```env
NODE_ENV=development
PORT=3000
HOST=localhost

DATABASE_URL=postgresql://postgres:password@localhost:5432/entre_nous
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

JWT_SECRET=your-super-secret-key-change-in-production-at-least-32-chars
JWT_EXPIRES_IN=24h

SOCKET_IO_CORS_ORIGIN=http://localhost:5173
SOCKET_IO_PING_INTERVAL=25000
SOCKET_IO_PING_TIMEOUT=60000

RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=1000

GAME_EXPIRY_HOURS=24
GAME_CODE_LENGTH=6
GAME_MAX_PLAYERS=2
CHALLENGE_TIME_LIMIT_SECONDS=300

LOG_LEVEL=info
LOG_FORMAT=json

CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

⚠️ **Change `password` to your PostgreSQL password!**

### 4. Open Command Prompt

Navigate to your backend folder:
```cmd
cd C:\path\to\entre-nous\backend
```

### 5. Install dependencies

```cmd
npm install
```

This will:
- Download all packages from `package.json`
- Create `node_modules\` folder
- Takes 2-5 minutes on first run

**Windows may ask for network access - allow it**

### 6. Setup Prisma

Generate Prisma client:
```cmd
npm run db:generate
```

Push schema to database:
```cmd
npm run db:push
```

You should see:
```
✓ Prisma database push completed
```

### 7. Verify installation

Check TypeScript:
```cmd
npm run type-check
```

Should output no errors.

### 8. Start development server

```cmd
npm run dev
```

You should see:
```
🚀 Server running at http://localhost:3000
📡 Socket.IO ready for connections
```

## ✅ Verify Backend is Working

- [ ] npm install completes without errors
- [ ] npm run db:push succeeds (database setup)
- [ ] npm run dev starts on http://localhost:3000/
- [ ] Browser/curl request to http://localhost:3000/health returns:
  ```json
  {
    "status": "ok",
    "timestamp": "2025-10-27T02:40:00.000Z",
    "uptime": 12
  }
  ```
- [ ] No red errors in terminal
- [ ] `npm run type-check` passes (0 errors)

## 📦 Available Commands

```cmd
# Start development server (auto-reload on file changes)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Check TypeScript types
npm run type-check

# Format code
npm run lint

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:push        # Sync schema to database
npm run db:migrate     # Create migration
npm run db:seed        # Seed initial data
npm run db:reset       # Reset database (destructive!)
```

## 🔗 Environment Variables

⚠️ **Important**: Never commit `.env` to Git!

`DATABASE_URL` format:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

Example:
- User: `postgres` (default)
- Password: Your PostgreSQL password
- Host: `localhost`
- Port: `5432` (default)
- Database: `entre_nous`

## ⚠️ Troubleshooting

### Error: "npm is not recognized"
- Node.js not installed or not in PATH
- Restart Command Prompt after installing Node.js
- Try: `C:\Program Files\nodejs\npm --version`

### Error: "Cannot connect to database"
- PostgreSQL not running
  - Start PostgreSQL service: Services → PostgreSQL
  - Or: `pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start`
- Wrong DATABASE_URL
  - Verify user/password
  - Verify port (usually 5432)
  - Test: `psql -U postgres -h localhost -d postgres`

### Error: "Port 3000 already in use"
- Another app using the port
- Use: `npm run dev -- --port 3001` to change port
- Or kill the process using port 3000

### Error: "Prisma migration failed"
- Database schema out of sync
- Run: `npm run db:reset` (⚠️ deletes all data!)
- Then: `npm run db:push`

### TypeScript errors
- Run: `npm run type-check`
- Check paths in `tsconfig.json`
- Verify imports use `@/` alias

### Slow on Windows
- Normal first run takes 2-5 minutes
- WSL2 is faster than native Windows
- Consider using Windows Terminal instead of Command Prompt

## 🚀 Next Steps

1. Start frontend (PROMPT 2)
2. Connect frontend to backend (API + Socket.IO)
3. Implement game logic (PROMPT 6+)

---

**Test both services together:**

Terminal 1 (Frontend):
```cmd
cd frontend
npm run dev
```

Terminal 2 (Backend):
```cmd
cd backend
npm run dev
```

Both should run without errors! 🎉

---

**For help:**
- Check `docs/ARCHITECTURE.md` for project structure
- See `docs/API.md` for API endpoints
- Backend code is in `src/` folder

Happy coding! 🚀
