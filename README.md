# Project name: Issue Tracker
## Live URL: https://express-postgresql-server.vercel.app/
## Features: Create, Read, Update, Delete issues, User authentication, Role-based access control, Filtering and sorting, Pagination
## Tech stack: Express, TypeScript, PostgreSQL, Neon Serverless Cloud, JWT, bcrypt

# Setup steps:
## 1. Clone the repository
## 2. Install dependencies: npm install
## 3. Set up the database: npm run setup-db
## 4. Start the server: npm run dev

# API endpoint list:
## POST /api/auth/register - Register a new user
## POST /api/auth/login - Login with email and password
## POST /api/issues - Create a new issue
## GET /api/issues - Get all issues
## GET /api/issues/:id - Get a single issue
## PUT /api/issues/:id - Update an issue
## DELETE /api/issues/:id - Delete an issue

# Database schema summary:
## users table: id, name, email, password, role, created_at, updated_at
## issues table: id, title, description, type, status, reporter_id, created_at, updated_at


# Vercel deploy using comand
```
npm run build
```
```
vercel login
```
```
vercel --prod
```
