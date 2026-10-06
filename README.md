# AeroEdu Frontend Demo

A responsive, bilingual (English/Bengali) frontend prototype for a centralized education platform.

## Demo access

This preview uses mock authentication and in-memory sample data. It is not connected to a production backend and must not be used for real accounts, student records, payments, or authorization.

- Multi-institute preview: `ops@aeroedu.app`
- Password: `aeroedu-demo`
- Single-institute preview: `teacher@dhakamodel.edu.bd`
- Password: `aeroedu-demo`

The super-admin demo account can select from the sample institutes. Other demo accounts open the institute linked to that sample account.

## Run locally

```bash
npm ci
npm run dev
```

## Build and preview

```bash
npm run build:pages
npm run preview
```

`npm run build:pages` builds the static demo bundle. `npm run build` additionally runs the repository-wide TypeScript check, which currently reports existing errors in unrelated admin, grades, and model files.

## GitHub Pages

The included GitHub Actions workflow deploys the static frontend when changes are pushed to `main`. It expects this repository name:

```text
aeroedu-frontend-demo
```

After pushing, enable GitHub Pages for the repository with **GitHub Actions** as the build and deployment source. The site will be available at:

```text
https://<github-username>.github.io/aeroedu-frontend-demo/
```

All data and credentials shown in this public demo are mock values. Do not add real personal data, API keys, or secrets.
