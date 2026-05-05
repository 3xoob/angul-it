# Angul-It

Angul-It is an Angular single-page CAPTCHA application that validates users through a randomized, multi-stage challenge flow. It demonstrates Angular routing, standalone components, reactive forms, route guards, persistent state management, responsive UI, and unit testing.

## Overview

The application starts on a home page, creates a new CAPTCHA session, guides the user through four different challenge types, and displays a protected result page only after every stage is completed successfully.

Progress is saved in browser `localStorage`, so refreshing the page restores the current challenge, attempts, selected answers, and completion state.

## Features

- Angular 21 standalone application.
- Routed pages for home, CAPTCHA challenge, and results.
- Randomized challenge set for each new session.
- Multiple CAPTCHA challenge types:
  - Image-style tile selection
  - Math problem
  - Text verification
  - Logic/single-choice puzzle
- Reactive form validation for text and math stages.
- Input validation for selection-based stages.
- Users cannot continue with empty or incorrect answers.
- Each challenge locks after 3 failed attempts and requires a restart.
- Persistent progress using `localStorage`.
- Route guards prevent direct access to incomplete or invalid pages.
- Responsive layout for mobile, tablet, and desktop screens.
- Accessible controls with visible focus states and helpful error messages.
- Unit tests for services, guards, and main component behavior.

## Tech Stack

- Angular `21.2.x`
- TypeScript
- SCSS
- Angular Router
- Angular Reactive Forms
- Vitest via Angular test runner

## Requirements

- Node.js `20` or newer
- npm

## Installation

Install project dependencies:

```bash
npm install
```

## Running The App

Start the development server:

```bash
npm start
```

Open the app in your browser:

```text
http://localhost:4200/
```

## Manual Demo Flow

1. Open `http://localhost:4200/`.
2. Click `Start challenge`.
3. Submit an empty or incorrect answer and confirm the app blocks progress.
4. Complete each stage correctly.
5. Refresh during the challenge and confirm progress is restored.
6. Finish all stages and confirm the protected result page appears.
7. Click `Restart challenge` to clear progress and start a new randomized session.

## Attempt Limit

Each challenge allows up to 3 failed attempts. After the third failed attempt, the stage locks and the user must restart the challenge session.

## State Persistence

Progress is stored in browser `localStorage` under this key:

```text
angul-it-progress
```

The stored state includes:

- Session ID
- Randomized challenge IDs
- Current challenge index
- Completed challenge IDs
- Saved answers
- Attempt counts
- Start and completion timestamps

## Available Scripts

Run the development server:

```bash
npm start
```

Build the production bundle:

```bash
npm run build
```

Run unit tests once:

```bash
npm test -- --watch=false
```

Run tests in watch mode:

```bash
npm test
```

## Project Structure

```text
src/app/
  core/
    guards/
    models/
    services/
  pages/
    home/
    captcha/
    result/
  shared/
    progress-meter/
```

## Verification

Before submission, verify the project with:

```bash
npm run build
npm test -- --watch=false
```

Expected result:

```text
Build passes
All unit tests pass
```
