# Urbia Frontend

React + Vite application for the Urbia platform. It consumes the Urbia API and provides the user-facing interface for authentication, reports, and map-based workflows.

## Requirements

- Node.js 18+ (recommended)
- npm 9+ (or compatible package manager)

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Environment Variables

Create a `.env.local` file in this directory (see `.env.example`):

```bash
VITE_API_URL=http://localhost:8000
```

For production (Vercel), set `VITE_API_URL` in the project environment settings.

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - build for production
- `npm run preview` - preview production build locally
- `npm run lint` - run linting

## Project Structure

- `src/` - application code
- `src/lib/api/` - API client and HTTP helpers
- `src/lib/store/` - state management (Zustand)
- `src/features/` - feature modules
- `src/routes/` - app routes

## Deployment

Vercel is the recommended deployment target.

Recommended settings:

- Root Directory: `Frontend/`
- Build Command: `npm run build`
- Output Directory: `dist`

Ensure `VITE_API_URL` points to the deployed backend URL.
