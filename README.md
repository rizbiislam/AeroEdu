# AeroEdu Frontend

Responsive React and TypeScript interface for the AeroEdu multi-institute education platform.

## Run with the local API

Start Django at `http://127.0.0.1:8000`, configure the local PostgreSQL database, and apply backend migrations first. Then:

```bash
npm ci
cp .env.example .env
```

Change `VITE_AUTH_MODE=demo` to `VITE_AUTH_MODE=api` in `.env`, then start Vite:

```bash
npm run dev
```

The login asks for the institute slug, email, and password. Vite forwards `/api/*` to the local Django server. Refresh tokens stay in an HttpOnly cookie; the short lived access token stays in memory.

## Demo preview

Set `VITE_AUTH_MODE=demo` to use the sample accounts and in-memory sample data. Demo mode is for UI preview only; it does not represent stored school records or server-enforced permissions. Sample credentials are listed in the sign-in panel.

## Build

```bash
npm run build
npm run lint
```

Some academic screens still use sample data. Authentication and institute resolution support the API mode; feature collections are being moved to their documented APIs incrementally.
