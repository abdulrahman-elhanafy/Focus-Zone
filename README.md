# FocusZone
 
FocusZone is a local coworking-management dashboard built with React + Vite for the frontend and Node/Express + MySQL for the backend.
 
## Overview
 
FocusZone supports role-based dashboards for receptionist, owner, and accountant, with modules for customer management, bookings, room management, pricing, transactions, and simple POS/services. The frontend uses the `/api` backend when available and falls back to localStorage mock data if the backend is unavailable.
 
## Features
 
- **Role-based dashboards** — dedicated views for receptionist, owner, and accountant workflows.
- **Customer management** — create and list customers, track visit history, and monitor balances.
- **Room management** — create, update, delete, and track room status across available, occupied, reserved, and maintenance states.
- **Pricing and bookings** — manage hourly and daily pricing and create bookings with lifecycle tracking.
- **Transactions** — automatically create transactions for bookings and record manual income and expense entries.
- **Services and POS** — support selling items and tracking stock in the frontend mock flow.
- **Reporting** — provide simple financial and usage reports in the frontend experience.
## Tech Stack
 
- Frontend: React, Vite, TypeScript
- Backend: Node.js, Express
- Database: MySQL
## Architecture
 
FocusZone follows a simple client-server structure: the React/Vite frontend renders the dashboards and UI, the Express API handles business logic and data access, and MySQL stores the core application data.
 
## API Endpoints
 
| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/status` | Health check |
| GET | `/api/customers` | List customers |
| POST | `/api/customers` | Create customer |
| GET | `/api/rooms` | List rooms |
| POST | `/api/rooms` | Create room |
| PUT | `/api/rooms/status` | Update room status |
| PUT | `/api/rooms` | Update room properties and price |
| DELETE | `/api/rooms` | Delete room |
| GET | `/api/bookings` | List bookings |
| POST | `/api/bookings` | Create booking |
| GET | `/api/transactions` | List transactions |
 
## Data Model
 
- `customers(id, name, email, phone, age, gender, membership, last_visit, balance, history JSON)`
- `rooms(id, name, type, capacity, status)`
- `room_prices(room_id, price_per_hour, price_per_day)`
- `bookings(id, customer_id, room_id, start_time, end_time, status, total_amount, created_at)`
- `transactions(id, booking_id?, customer_id?, date, description, category, amount, method, created_at)`
## Getting Started
 
**Prerequisites:** Node.js 16+, npm, local MySQL server (5.7+ or 8.x)
 
```bash
npm install
copy .env.example .env
node server/import-sql.js
npm run start:server
npm run dev
```
 
- Frontend: `http://localhost:3000/`
- Backend API: `http://localhost:4000/` (frontend proxies `/api` to the backend)
## Author
 
[Abdulrahman Hanafy](https://www.linkedin.com/in/abdulrahman-hanafy)