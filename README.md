# FocusZone

A local coworking management dashboard built with React, Vite, and a Node/Express backend connected to MySQL.

## Prerequisites

- Node.js
- npm
- Local MySQL server

## Setup

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env`:
   `copy .env.example .env`
3. Update `.env` with your MySQL connection values.
4. If you are using Gemini integration, set `GEMINI_API_KEY` in `.env.local`.
5. Import the database schema:
   `node server/import-sql.js`
6. Start the backend server:
   `npm run start:server`
7. Start the frontend app:
   `npm run dev`

## Notes

- The frontend is served at `http://localhost:3000/`.
- API requests are proxied to the backend at `http://localhost:4000/`.
- The database schema is defined in `FocusZone.sql`.

## Project structure

- `App.tsx` — main application shell and navigation.
- `services/api.ts` — frontend API service layer with MySQL backend support and local fallback.
- `server/index.js` — Express backend server.
- `server/import-sql.js` — imports `FocusZone.sql` into your local MySQL server.
- `types.ts` — shared TypeScript data models.

## Commands

- `npm install` — install dependencies
- `npm run start:server` — launch the backend server
- `npm run dev` — launch the Vite frontend
