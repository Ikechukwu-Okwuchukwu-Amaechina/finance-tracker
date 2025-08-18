# Finance Tracker

Simple finance tracker to manage users and their balances. This repo provides a Node.js + Express API with MongoDB for persistence and JWT for authentication.

Project name: Finance Tracker

Description and purpose:
- A minimal backend to register users, authenticate, and keep a balance field per user. Useful as a starting point for personal finance features.

Installation
1. Clone the repository:
   git clone <repo-url>
2. Install dependencies:
   npm install
3. Create a `.env` file in the project root with at least:
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-secret>

Technologies used
- Node.js
- Express
- MongoDB (mongoose)
- JSON Web Tokens (JWT)

API endpoints (to be expanded):
- POST /api/auth/signup - create user
- POST /api/auth/login - login and receive JWT
- GET /api/me - get current user and balance (protected)

Folder structure (recommended)
- config/ - db connection and config
- models/ - Mongoose models
- routes/ - Express routers
- middleware/ - auth middleware
- app.js - express app
- server.js - starts the server

Notes
- This is an initial scaffold. Endpoints, validation, and features should be expanded for production use.
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

## Author
Ikechukwu Okwuchukwu Amaechina  

