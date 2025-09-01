
# Finance Tracker

Simple, beginner‑friendly REST API to track personal finances. Sign up/login with JWT, add income/expense transactions, and keep an auto‑calculated account balance.


## Features

- JWT auth: signup, login, and get current user
- Create, read, update, and delete transactions
- Pagination and type filter (credit/debit) on list endpoint
- Secure defaults: Helmet, rate limiting, and XSS sanitization
- Tests with Jest + Supertest using in‑memory MongoDB


## Tech Stack

- Runtime: Node.js (CommonJS)
- Framework: Express
- Database/ODM: MongoDB + Mongoose
- Auth: JSON Web Tokens (jsonwebtoken)
- Security: helmet, express-rate-limit, xss-clean
- Password hashing: bcrypt
- Testing: Jest, Supertest, mongodb-memory-server


## Setup

### Prerequisites
- Node.js 18+
- A MongoDB connection string (Atlas or local)

### 1) Clone
```powershell
git clone https://github.com/Ikechukwu-Okwuchukwu-Amaechina/finance-tracker.git
cd finance-tracker
```

### 2) Install
```powershell
npm install
```

### 3) Configure environment
Create a `.env` file in the project root:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance_tracker
JWT_SECRET=please-change-me
```

### 4) Run
Development with reload:
```powershell
npm run dev
```

Production:
```powershell
npm start
```

Server starts on `http://localhost:5000` by default.

### 5) Run tests (optional)
```powershell
npm test
```


## API Usage

Base URL: `http://localhost:5000/api`

All transaction endpoints require an Authorization header: `Bearer <token>`.

### Auth

1) Sign up
- POST `/auth/signup`
- Body
```json
{ "name": "Alice", "email": "alice@example.com", "password": "password123" }
```
- Response: `{ token, user }`

2) Login
- POST `/auth/login`
- Body
```json
{ "email": "alice@example.com", "password": "password123" }
```
- Response: `{ token, user }`

3) Current user
- GET `/auth/me`
- Headers: `Authorization: Bearer <token>`

Postman quick tips:
- Create a collection with a `{{baseUrl}}` variable set to `http://localhost:5000/api`.
- Add an environment variable `token` and set Authorization type to Bearer with `{{token}}`.

### Transactions

1) Create
- POST `/transactions`
- Headers: `Authorization: Bearer <token>`
- Body
```json
{ "amount": 50, "type": "credit", "description": "Paycheck" }
```

2) List (pagination + type filter)
- GET `/transactions?page=1&limit=10&type=credit`
- Headers: `Authorization: Bearer <token>`
- Notes: Supported query params are `page`, `limit`, and `type` (credit|debit).

3) Get by id
- GET `/transactions/:id`

4) Update
- PUT `/transactions/:id`
- Body (any of):
```json
{ "amount": 25, "type": "debit", "description": "Groceries" }
```

5) Delete
- DELETE `/transactions/:id`



## Project Scripts

- `npm start` — start server (uses `server.js`)
- `npm run dev` — start with nodemon
- `npm test` — run Jest tests


## Contributors

- Ikechukwu Okwuchukwu Amaechina


## License

This project is licensed under the MIT License. See `LICENSE` for details.

