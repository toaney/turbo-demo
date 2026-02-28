# Mental Math Game - Frontend

This is the frontend application for the Mental Math Game. It's built with Next.js 16, React 19, and TypeScript.

## Project Structure

```
apps/web/
├── app/
│   ├── components/
│   │   ├── LandingPage.tsx          # Configuration/landing page
│   │   ├── LandingPage.module.css   # Landing page styles
│   │   ├── GamePage.tsx             # Main game interface
│   │   └── GamePage.module.css      # Game page styles
│   ├── types.ts                     # TypeScript type definitions
│   ├── page.tsx                     # Main page component (router)
│   ├── layout.tsx                   # Root layout
│   ├── globals.css                  # Global styles
│   └── page.module.css              # Base page styles
├── package.json
├── tsconfig.json
└── next.config.js
```

## What Each Part Does

### `app/page.tsx`
The main entry point that acts as a simple router. It:
- Manages the game state (landing page vs. game page)
- Renders either `LandingPage` or `GamePage` based on whether a game configuration exists
- Handles navigation between the two views

### `app/types.ts`
Defines TypeScript interfaces and types used throughout the application:
- `Operation`: The four math operation types
- `Difficulty`: Three difficulty levels
- `GameConfig`: Configuration selected on the landing page
- `Question`: Question data structure from the API
- `QuestionState`: Extended question state with game-specific data

### `app/components/LandingPage.tsx`
The configuration screen that appears before starting the game. It allows users to:
- Select which math operations to include (addition, subtraction, multiplication, division)
- Set the time limit per question (default: 30 seconds)
- Choose difficulty level (easy, medium, hard)
- Start the game with their selected configuration

### `app/components/GamePage.tsx`
The main game interface that:
- Generates questions from the backend API
- Displays the current question
- Shows a countdown timer for each question
- Provides an input field for answers
- Implements keyboard controls:
  - **Enter**: Submit answer
  - **Tab** or **Right Arrow**: Skip question
- Manages a queue of skipped questions (flashcard behavior)
- Tracks and records metrics to the backend
- Shows the correct answer when revealed or after submission
- Provides buttons for: Reveal Answer, Submit, Skip, and Next Question

### `app/components/GamePage.module.css` & `LandingPage.module.css`
CSS modules for styling the respective components. They use CSS variables for theming and support dark mode.

### `app/layout.tsx`
The root layout component that:
- Sets up the HTML structure
- Loads fonts (Geist Sans and Geist Mono)
- Defines page metadata
- Applies global styles

### `app/globals.css`
Global CSS styles including:
- CSS variables for theming
- Dark mode support
- Base resets and typography

## Prerequisites

Before running the frontend, you need:

1. **Node.js** (version 18 or higher)
2. **npm** (comes with Node.js)
3. **Backend API** running (see `apps/api/README.md`)

## Setup Instructions

### 1. Install Dependencies

From the root of the monorepo:

```bash
npm install
```

Or from the web directory:

```bash
cd apps/web
npm install
```

### 2. Configure API URL

The frontend needs to know where the backend API is running. By default, it looks for the API at `http://localhost:3001`.

You can override this by creating a `.env.local` file in `apps/web/`:

```bash
cd apps/web
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
```

### 3. Start the Development Server

From the root of the monorepo:

```bash
npm run dev
```

This will start both the frontend and backend (if configured in turbo.json).

Or to run just the frontend:

```bash
cd apps/web
npm run dev
```

The frontend will start on `http://localhost:3000`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use the Application

### 1. Configure Your Game

On the landing page:
- **Select Operations**: Check the boxes for addition, subtraction, multiplication, and/or division
- **Set Time Limit**: Enter the number of seconds allowed per question (default: 30)
- **Choose Difficulty**: Select easy, medium, or hard
- Click **Start Game**

### 2. Play the Game

Once the game starts:
- A math question will appear
- Enter your answer in the input field
- Press **Enter** to submit your answer
- Or press **Tab** or **Right Arrow** to skip the question
- Click **Reveal Answer** to see the correct answer
- Click **Next Question** after viewing the answer to continue

### 3. Flashcard Behavior

- Skipped questions are automatically added back to the queue
- They will reappear later in the session
- This ensures you practice questions you found difficult

### 4. Timer

- Each question has a countdown timer
- When time runs out, the answer is automatically revealed
- The timer resets for each new question

## Keyboard Controls

- **Enter**: Submit your answer
- **Tab** or **Right Arrow (→)**: Skip to the next question
- The input field is automatically focused when a new question appears

## Features

### Question Types

- **Addition**: Two numbers larger than 10
- **Subtraction**: Two numbers larger than 10 (result is always positive)
- **Multiplication**: Focuses on 6's, 7's, 8's, and 11+ multiplication tables
- **Division**: Clean division problems (no remainders) using the same tables

### Difficulty Levels

- **Easy**: Smaller numbers, simpler problems
- **Medium**: Moderate complexity
- **Hard**: Larger numbers, more challenging problems

### Metrics Tracking

The frontend automatically tracks:
- Time spent on each question
- Whether questions were answered correctly
- Whether questions were skipped
- Whether answers were revealed
- All metrics are sent to the backend for analysis

## Troubleshooting

### Cannot Connect to Backend

If you see errors about API calls failing:
1. Ensure the backend is running on `http://localhost:3001`
2. Check your `.env.local` file has the correct `NEXT_PUBLIC_API_URL`
3. Verify CORS is enabled on the backend
4. Check browser console for specific error messages

### Port Already in Use

If port 3000 is already in use:
1. Stop the other process using port 3000
2. Or change the port in `package.json`: `"dev": "next dev --port 3001"`

### Build Errors

If you encounter TypeScript or build errors:
1. Run `npm run check-types` to see type errors
2. Ensure all dependencies are installed: `npm install`
3. Check that you're using Node.js 18+

## Development

The frontend uses:
- **Next.js 16** with App Router
- **React 19** for UI components
- **TypeScript** for type safety
- **CSS Modules** for component styling
- **Client Components** (`'use client'`) for interactivity

The development server supports:
- Hot module replacement (HMR)
- Fast refresh
- TypeScript type checking
- ESLint linting

## Building for Production

To build the frontend for production:

```bash
cd apps/web
npm run build
npm start
```

This creates an optimized production build in the `.next` directory.
