# Frontend Installation - Windows

## ✅ Prerequisites

Ensure you have installed:
- **Node.js 18.x or 20.x** → https://nodejs.org/ (use LTS version)
- **Git** → https://git-scm.com/
- **npm** comes with Node.js

To verify:
```cmd
node --version
npm --version
```

## 📥 Installation Steps

### 1. Extract the frontend files

Extract `entre-nous-prompt2-frontend.zip` to your `entre-nous\frontend\` folder.

Your structure should look like:
```
entre-nous\
├── frontend\
│   ├── src\
│   ├── public\
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── ... (other files)
├── backend\
└── docs\
```

### 2. Open Command Prompt

Navigate to your frontend folder:
```cmd
cd C:\path\to\entre-nous\frontend
```

### 3. Install dependencies

```cmd
npm install
```

This will:
- Download all packages from `package.json`
- Create `node_modules\` folder
- Takes 2-5 minutes on first run

**Windows may ask for network access - allow it**

### 4. Verify installation

```cmd
npm run type-check
```

Should output no errors.

### 5. Start development server

```cmd
npm run dev
```

You should see:
```
  VITE v5.0.7  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**Browser will automatically open** at http://localhost:5173/

## ✅ Verify Frontend is Working

- [ ] Page loads without errors
- [ ] "Entre Nous" title visible
- [ ] "Start a Game" and "Join a Game" buttons visible
- [ ] No red errors in console (press F12)
- [ ] Click "Create Game" button (should redirect)
- [ ] Dark mode toggle works (moon icon top right)

## 📦 Available Commands

```cmd
# Start development server (auto-reload on file changes)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Check TypeScript types
npm run type-check

# Format code
npm run lint
```

## 🔗 Environment Variables

Create `.env.local` in the frontend folder:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
VITE_ENV=development
VITE_DEBUG=true
```

Or copy from `.env.example`:
```cmd
copy .env.example .env.local
```

## ⚠️ Troubleshooting

### Error: "npm is not recognized"
- Node.js not installed or not in PATH
- Restart Command Prompt after installing Node.js
- Try: `C:\Program Files\nodejs\npm --version`

### Error: "Port 5173 already in use"
- Another app is using the port
- Use: `npm run dev -- --port 5174`

### Error: "Cannot find module..."
- Dependencies not installed
- Run: `npm install` again
- Delete `node_modules\` folder and retry

### TypeScript errors
- Run: `npm run type-check`
- Check terminal for specific errors
- Fix paths in `tsconfig.json` if needed

### Slow on Windows
- Normal first run takes 2-5 minutes
- WSL2 is faster than native Windows
- Consider: `npm install --legacy-peer-deps` if issues persist

## 🚀 Next Steps

1. Start backend (PROMPT 3)
2. Connect frontend to backend (Socket.IO + API)
3. Implement game pages (PROMPT 6)

---

**For help:**
- Check `docs/ARCHITECTURE.md` for project structure
- See `docs/API.md` for backend endpoints
- Frontend code is in `src/` folder

Happy coding! 🎮
