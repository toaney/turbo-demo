# Mental Math Game - Backend API

This is the backend API server for the Mental Math Game application. It's built with TypeScript, Express, and PostgreSQL.

## Project Structure

```
apps/api/
├── src/
│   ├── index.ts              # Main server entry point
│   ├── db/
│   │   ├── connection.ts     # PostgreSQL connection pool
│   │   ├── schema.sql        # Database schema definitions
│   │   └── migrate.ts        # Database migration script
│   ├── routes/
│   │   ├── questions.ts      # Question generation endpoints
│   │   └── metrics.ts        # Metrics tracking endpoints
│   └── services/
│       └── questionGenerator.ts  # Question generation logic
├── package.json
├── tsconfig.json
└── .env.example
```

## What Each Part Does

### `src/index.ts`
The main entry point for the Express server. It:
- Initializes the Express application
- Sets up CORS middleware
- Connects to the PostgreSQL database
- Registers API routes
- Starts the HTTP server on port 3001 (default)

### `src/db/connection.ts`
Manages the PostgreSQL connection pool using the `pg` library. It reads database credentials from environment variables and exports a connection pool that can be used throughout the application.

### `src/db/schema.sql`
Defines the database schema with two main tables:
- **questions**: Stores generated math questions with their operands, answers, operation type, and difficulty
- **question_metrics**: Tracks metrics for each time a question appears, including:
  - Time spent on the question
  - Whether it was answered correctly
  - Whether it was skipped
  - Whether the answer was revealed
  - Session ID for grouping attempts

### `src/db/migrate.ts`
A script that runs the SQL schema to create tables in the database. Run this once to set up your database.

### `src/services/questionGenerator.ts`
Contains the `QuestionGenerator` class that creates math questions based on:
- **Operations**: addition, subtraction, multiplication, division
- **Difficulty**: easy, medium, hard

The generator ensures:
- Addition/subtraction: numbers larger than 10
- Multiplication: focuses on 6's, 7's, 8's, and 11+ tables
- Division: creates clean division problems (no remainders)

### `src/routes/questions.ts`
API endpoints for question management:
- `POST /api/questions/generate`: Generates a new question based on operations and difficulty, saves it to the database, and returns it
- `GET /api/questions/:id`: Retrieves a question by ID

### `src/routes/metrics.ts`
API endpoints for tracking metrics:
- `POST /api/metrics`: Records a metric for a question attempt
- `GET /api/metrics/question/:questionId`: Gets aggregated metrics for a specific question
- `GET /api/metrics/summary`: Gets overall statistics across all questions

## Prerequisites

Before running the backend, you need:

1. **Node.js** (version 18 or higher)
2. **PostgreSQL** (version 12 or higher)
3. **npm** (comes with Node.js)

## Setup Instructions

### 1. Install PostgreSQL

If you don't have PostgreSQL installed:

**macOS (using Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create the Database

Connect to PostgreSQL and create a database:

```bash
# Connect to PostgreSQL (default user is usually 'postgres')
psql -U postgres

# Create the database
CREATE DATABASE mental_math;

# Exit psql
\q
```

### 3. Configure Environment Variables

Copy the example environment file and update it with your database credentials:

```bash
cd apps/api
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mental_math
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### 4. Install Dependencies

From the root of the monorepo:

```bash
npm install
```

Or from the api directory:

```bash
cd apps/api
npm install
```

### 5. Run Database Migration

Run the migration script to create the database tables:

```bash
cd apps/api
npm run migrate
```

You should see: `✅ Database migration completed`

### 6. Start the Development Server

From the root of the monorepo:

```bash
npm run dev
```

Or to run just the backend:

```bash
cd apps/api
npm run dev
```

The server will start on `http://localhost:3001`

You should see:
```
✅ Database connected
🚀 Server running on http://localhost:3001
```

## API Endpoints

### Health Check
- `GET /health` - Returns server status

### Questions
- `POST /api/questions/generate`
  - Body: `{ "operations": ["addition", "subtraction"], "difficulty": "medium" }`
  - Returns: Generated question with ID

- `GET /api/questions/:id`
  - Returns: Question details by ID

### Metrics
- `POST /api/metrics`
  - Body: `{ "questionId": 1, "sessionId": "session-123", "timeSpentMs": 5000, "answeredCorrectly": true, "wasSkipped": false, "wasRevealed": false }`
  - Records a metric for a question attempt

- `GET /api/metrics/question/:questionId`
  - Returns: Aggregated metrics for a specific question

- `GET /api/metrics/summary`
  - Returns: Overall statistics across all questions

## Troubleshooting

### Database Connection Issues

If you see "Database connection failed":
1. Verify PostgreSQL is running: `pg_isready` or `psql -U postgres`
2. Check your `.env` file has correct credentials
3. Ensure the database `mental_math` exists
4. Verify the user has permissions to access the database

### Port Already in Use

If port 3001 is already in use:
1. Change the `PORT` in `.env`
2. Or stop the process using port 3001

### Migration Errors

If migration fails:
1. Ensure you're connected to the correct database
2. Check that tables don't already exist (they may have been created previously)
3. Verify your database user has CREATE TABLE permissions

## Development

The backend uses:
- **TypeScript** for type safety
- **Express** for the HTTP server
- **pg** (node-postgres) for PostgreSQL
- **tsx** for running TypeScript directly in development
- **dotenv** for environment variable management

The server runs in watch mode during development, automatically restarting when files change.
