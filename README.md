# Mental Math Game - Turborepo Monorepo

A full-stack mental math practice application built with Next.js, TypeScript, Express, and PostgreSQL, organized as a Turborepo monorepo.

## Project Structure

```
turbo-demo/
├── apps/
│   ├── api/          # Backend API (Express + PostgreSQL)
│   ├── web/          # Frontend (Next.js)
│   └── docs/         # Documentation site (Next.js)
├── packages/
│   ├── eslint-config/      # Shared ESLint configuration
│   ├── typescript-config/  # Shared TypeScript configuration
│   └── ui/                 # Shared UI components
├── package.json
├── turbo.json
└── README.md
```

## Applications

### `apps/api` - Backend API
TypeScript Express server with PostgreSQL database for:
- Generating math questions
- Tracking question metrics (time spent, correctness, skips, reveals)
- Storing question history

**See [apps/api/README.md](./apps/api/README.md) for detailed documentation.**

### `apps/web` - Frontend Game
Next.js application providing:
- Landing page for game configuration
- Interactive math game with timer
- Flashcard-style question queue
- Keyboard controls
- Real-time metrics tracking

**See [apps/web/README.md](./apps/web/README.md) for detailed documentation.**

## Quick Start

### Prerequisites

1. **Node.js** 18+ and npm
2. **PostgreSQL** 12+ (see backend README for installation)

### Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL database:**
   ```bash
   # Create database
   createdb mental_math
   
   # Or using psql:
   psql -U postgres
   CREATE DATABASE mental_math;
   \q
   ```

3. **Configure backend environment:**
   ```bash
   cd apps/api
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

4. **Run database migration:**
   ```bash
   cd apps/api
   npm run migrate
   ```

5. **Start development servers:**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start:
   - Backend API on `http://localhost:3001`
   - Frontend on `http://localhost:3000`

6. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

From the root directory:

- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all apps
- `npm run lint` - Lint all apps
- `npm run check-types` - Type check all apps

## Features

### Game Features
- ✅ Four operation types: Addition, Subtraction, Multiplication, Division
- ✅ Three difficulty levels: Easy, Medium, Hard
- ✅ Configurable time limit per question
- ✅ Timer countdown for each question
- ✅ Answer input with Enter key submission
- ✅ Reveal answer button
- ✅ Skip question button (Tab or Right Arrow)
- ✅ Flashcard behavior: skipped questions reappear
- ✅ Automatic answer reveal when timer expires

### Technical Features
- ✅ Full TypeScript type safety
- ✅ PostgreSQL database for persistence
- ✅ Metrics tracking (time spent, correctness, skips, reveals)
- ✅ Session-based tracking
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Keyboard shortcuts

## Development

This is a Turborepo monorepo, which means:

- **Shared configurations**: ESLint and TypeScript configs are shared across apps
- **Parallel execution**: Tasks run in parallel when possible
- **Caching**: Turborepo caches build outputs for faster rebuilds
- **Workspace dependencies**: Apps can depend on shared packages

### Adding a New App

1. Create directory in `apps/`
2. Add to `package.json` workspaces (already configured)
3. Add build task to `turbo.json` if needed

### Shared Packages

- `@repo/eslint-config`: Shared ESLint rules
- `@repo/typescript-config`: Shared TypeScript configurations
- `@repo/ui`: Shared React components

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `pg_isready`
- Verify database credentials in `apps/api/.env`
- Ensure database exists: `psql -U postgres -l | grep mental_math`

### Frontend can't connect to backend
- Verify backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in `apps/web/.env.local`
- Ensure CORS is enabled (it is by default)

### Database migration fails
- Ensure you're connected to the correct database
- Check user permissions
- Verify tables don't already exist (safe to run multiple times)

## License

This project is part of a demo/tutorial project.

<!-- test commit -->