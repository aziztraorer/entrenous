# Entre Nous - Database Setup Guide

## Overview

This guide explains how to create and populate the PostgreSQL database for Entre Nous on Windows.

### Files Included

1. **`entre_nous.sql`** - Creates all tables, indexes, and relationships
2. **`seed.sql`** - Populates initial categories and challenges
3. **`schema.prisma`** - Prisma ORM schema (mirrors SQL exactly)
4. **`import.bat`** - Automated import script for Windows (optional)
5. **`.env.example`** - Environment variables template

---

## ✅ Prerequisites

### Required Software

- **PostgreSQL 14+** → https://www.postgresql.org/download/windows/
  - Download the Windows installer
  - Install with default settings
  - **Remember the password** you set for the `postgres` user

- **psql** (comes with PostgreSQL)
  - Command-line tool to run SQL files
  - Usually installed at: `D:\PostgreSQL\bin\psql.exe`

### Verify Installation

Open **Command Prompt** and run:
```cmd
psql --version
```

Should output something like: `psql (PostgreSQL) 14.x`

If not found, add PostgreSQL to PATH:
1. Search "Environment Variables" in Windows
2. Click "Edit the system environment variables"
3. Click "Environment Variables..."
4. Under "System variables", find "Path"
5. Click "Edit"
6. Click "New" and add: `C:\Program Files\PostgreSQL\14\bin`
7. Click OK and restart Command Prompt

---

## 📥 Setup Instructions

### Method 1: Using import.bat (Recommended - Easiest)

1. **Edit `import.bat`**
   - Open `import.bat` in Notepad
   - Change line 2 if PostgreSQL is installed elsewhere:
     ```batch
     set PSQL_PATH=D:\PostgreSQL\bin\psql.exe
     ```
   - Change line 3 with your password:
     ```batch
     set DB_PASSWORD=aziz5580
     ```
   - Save the file

2. **Run the script**
   - Open Command Prompt in the `backend/database/` folder
   - Run:
     ```cmd
     import.bat
     ```
   - Script will:
     - Create database `entre_nous`
     - Import schema from `entre_nous.sql`
     - Seed data from `seed.sql`
   - Should see: `✓ Database setup complete!`

3. **Skip to "Verify Database" section** below

---

### Method 2: Manual Import (If .bat fails)

#### Step 1: Create Database

Open **Command Prompt** and create the database:

```cmd
psql -U postgres -h localhost
```

When prompted for password, enter your PostgreSQL password.

Then run:
```sql
CREATE DATABASE entre_nous;
\q
```

#### Step 2: Import Schema

Still in Command Prompt, navigate to the database folder:

```cmd
cd C:\path\to\entre-nous\backend\database\
```

Import the schema:

```cmd
psql -U postgres -h localhost -d entre_nous -f entre_nous.sql
```

Should see schema creation output without errors.

#### Step 3: Import Seed Data

Import the initial data:

```cmd
psql -U postgres -h localhost -d entre_nous -f seed.sql
```

Should see confirmation:
```
Challenge Categories:  5
Challenges:          30
```

---

### Method 3: Using pgAdmin GUI

1. **Open pgAdmin**
   - Should be installed with PostgreSQL
   - Search "pgAdmin" in Windows Start menu
   - Or navigate to: `http://localhost:5050` in browser

2. **Create Database**
   - Right-click on "Databases" → Create → Database
   - Name: `entre_nous`
   - Click "Save"

3. **Import Schema**
   - Right-click on `entre_nous` → Restore
   - Select `entre_nous.sql` file
   - Click "Restore"

4. **Import Seed Data**
   - Click on `entre_nous` → Query Tool
   - Copy content of `seed.sql`
   - Paste into Query Tool
   - Click Execute (F5)

---

## ✅ Verify Database Setup

### Check via psql

Open **Command Prompt**:

```cmd
psql -U postgres -h localhost -d entre_nous
```

Run these queries:

```sql
-- Check tables
\dt

-- Count categories
SELECT COUNT(*) as categories FROM "ChallengeCategory";

-- Count challenges
SELECT COUNT(*) as challenges FROM "Challenge";

-- List all categories
SELECT name, emoji, COUNT(*) as challenge_count FROM "ChallengeCategory" 
LEFT JOIN "Challenge" ON "Challenge"."categoryId" = "ChallengeCategory"."id"
GROUP BY "ChallengeCategory"."id", name, emoji;

-- Exit
\q
```

Expected output:
- 5 categories (Social, Personal, Fun, Deep, Creative)
- 30+ challenges
- 5-7 challenges per category

### Check via pgAdmin

1. Open pgAdmin
2. Navigate to: Databases → entre_nous → Schemas → public → Tables
3. Should see 9 tables:
   - Game
   - Player
   - ChallengeCategory
   - Challenge
   - PlayerCategoryPreference
   - GameChallenge
   - ChallengeHistory
   - Response
   - Message
   - SessionToken
   - GameStatistic

---

## 🔗 Connect from Backend Application

Once database is set up, configure your `.env` file:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/entre_nous
```

Then in your backend folder:

```cmd
npm run db:generate
```

This generates the Prisma client to connect to the database.

---

## 📋 Database Structure

### Tables Overview

| Table | Purpose |
|-------|---------|
| Game | Game sessions (waiting, active, ended) |
| Player | Players in a game (1 or 2 per game) |
| ChallengeCategory | Types of challenges (Social, Fun, etc.) |
| Challenge | Individual questions/prompts |
| PlayerCategoryPreference | User preferences for categories |
| GameChallenge | Challenges available for a game |
| ChallengeHistory | History of used challenges |
| Response | Player responses to challenges |
| Message | Chat messages during games |
| SessionToken | JWT tokens for sessions |
| GameStatistic | Game statistics and analytics |

### Key Relationships

```
Game
├── 1-N → Player (up to 2 players per game)
├── 1-N → Response (player answers)
├── 1-N → Message (chat messages)
├── 1-N → GameChallenge (challenges in game)
└── 1-N → ChallengeHistory (used challenges)

Challenge
├── M-1 → ChallengeCategory
├── 1-N → Response
└── 1-N → GameChallenge

Player
├── 1-N → Response
├── 1-N → Message
├── 1-N → PlayerCategoryPreference
└── 1-N → SessionToken
```

---

## 🔐 Security Notes

### Tokens & Sessions

- **SessionToken table** stores JWT tokens for temporary sessions
- Tokens should be generated server-side only
- Never store passwords (no password field in any table)
- All tokens have expiration times

### Data Privacy

- **No personal data** is collected (anonymous games)
- **No tracking cookies** beyond session management
- **All game data** is deleted after 24 hours (via `expiresAt`)
- **Messages are tied to games**, not persistent users

### Database Access

- ⚠️ Never commit `.env` to Git (contains password!)
- ⚠️ Use strong PostgreSQL password
- ⚠️ Only expose database to localhost in development
- ⚠️ Use environment variables, never hardcode passwords

---

## 🧹 Cleanup & Reset

### Reset Database (Warning: Deletes All Data!)

```cmd
psql -U postgres -h localhost
DROP DATABASE entre_nous;
CREATE DATABASE entre_nous;
\q
```

Then re-import:
```cmd
psql -U postgres -h localhost -d entre_nous -f entre_nous.sql
psql -U postgres -h localhost -d entre_nous -f seed.sql
```

### Delete Old Games

As a cleanup, delete expired games (older than 24 hours):

```sql
DELETE FROM "Game" WHERE "expiresAt" < NOW();
```

---

## 🐛 Troubleshooting

### "Connection refused"

**Problem**: `psql: error: could not connect to server: Connection refused`

**Solution**:
1. Check PostgreSQL is running:
   - Windows → Services → PostgreSQL service
   - Should show "Running"
2. If not running, start it:
   - Services → PostgreSQL → Right-click → Start
3. Retry command

### "Role postgres does not exist"

**Problem**: `ERROR: role "postgres" does not exist`

**Solution**:
1. PostgreSQL may not be installed correctly
2. Try reinstalling PostgreSQL
3. Or use different username if you know it

### "Authentication failed"

**Problem**: `psql: error: FATAL: Ident authentication failed for user`

**Solution**:
1. Wrong password
2. Try again with correct PostgreSQL password
3. Or reset PostgreSQL password:
   - Go to: `C:\Program Files\PostgreSQL\14\data\pg_hba.conf`
   - Change `ident` to `trust` (temporary!)
   - Restart PostgreSQL
   - Set new password via pgAdmin
   - Change back to `ident`

### "Table already exists"

**Problem**: `ERROR: relation "Game" already exists`

**Solution**:
- Database was already created
- Either use existing database or drop and recreate:
  ```cmd
  psql -U postgres -h localhost
  DROP DATABASE entre_nous;
  CREATE DATABASE entre_nous;
  \q
  ```

### Database created but tables missing

**Problem**: Tables don't show in pgAdmin

**Solution**:
1. Check you're looking in the right database
2. Manually run SQL:
   ```cmd
   psql -U postgres -h localhost -d entre_nous -f entre_nous.sql
   ```
3. Verify import completed

---

## 📚 Next Steps

1. ✅ Database is created
2. → Backend initialization (PROMPT 3)
3. → Backend API routes (PROMPT 7)
4. → Socket.IO integration (PROMPT 8)
5. → Test full game flow

---

## 📞 Support

If you encounter issues:

1. Check PostgreSQL is running
2. Verify connection string in `.env`:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/entre_nous
   ```
3. Check SQL file syntax (look for errors in import output)
4. Try manual import (Method 2) if .bat fails
5. Drop and recreate database if corrupted

---

**Database setup complete!** 🎉

Your Entre Nous database is ready. Move to the next PROMPT to set up the backend API.
