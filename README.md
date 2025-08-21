
# Finance Tracker

A simple, beginner‑friendly Node.js project for tracking personal finances. Log income and expenses, group them into categories, and view simple summaries to understand where your money goes.


## Features

- Add income and expense transactions
- Organize by categories (e.g., Food, Transport, Savings)
- View basic summaries (totals by month and by category)


## Installation & Usage

### Prerequisites
- Node.js LTS (v18 or newer recommended)
- Git (optional but recommended)

### 1) Get the code
```powershell
# Clone the repo (or download the ZIP from GitHub)
git clone https://github.com/Ikechukwu-Okwuchukwu-Amaechina/finance-tracker.git
cd finance-tracker
```

### 2) Install dependencies
```powershell
npm install
```

### 3) Run the app
Currently this is a starter. If you have an entry file (for example `index.js`), you can run it with:
```powershell
node index.js
```

Or add a start script in `package.json`:
```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```
Then run:
```powershell
npm start
```


## Technologies Used
- Node.js
- JavaScript (CommonJS)
- npm

## Authentication API
API endpoints (to be expanded):
- POST /api/auth/signup - create user
- POST /api/auth/login - login and receive JWT
- GET /api/me - get current user and balance (protected)

## Transactions API

All transaction endpoints are protected. Include header Authorization: Bearer <token>

- POST /api/transactions
   - body: { amount: number (>0), type: 'credit'|'debit', description?: string }
   - creates a transaction and adjusts user balance automatically

- GET /api/transactions?page=1&limit=10&type=credit&start=2025-01-01&end=2025-12-31
   - returns paginated transactions filtered by optional type and date range

- GET /api/transactions/:id
   - get a single transaction

- PUT /api/transactions/:id
   - update transaction fields and adjust balance accordingly

- DELETE /api/transactions/:id
   - deletes transaction and adjusts balance accordingly

Security middlewares applied: helmet, rate limiting, mongo sanitization, xss protection, and input validation.

## Author
Ikechukwu Okwuchukwu Amaechina  

## CI / CD

This repository includes a GitHub Actions workflow at `.github/workflows/ci.yml` that runs tests on push and PR to `main`.

If you provide a `RAILWAY_TOKEN` secret in the repository, the workflow will also attempt to deploy to Railway using the Railway CLI.

To enable Railway deploys:
- Add `RAILWAY_TOKEN` to GitHub Secrets (a Railway personal token)
- Ensure the project is connected to a Railway project (you can run `railway init` locally then push)

