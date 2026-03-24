# QuickKart

QuickKart is a full-stack ecommerce project with a customer storefront and an admin dashboard.

It supports product browsing, authentication, cart and checkout flow, order tracking, category and product management, reviews, and role-based access (`user` / `admin`).

## Core Idea

The project simulates a real online shopping platform where:

- Customers can register/login, browse products by department, add items to cart, place orders, and track order status.
- Admin users can access a dashboard to monitor orders, products, categories, delivery updates, and platform activity.

The main focus is to provide a practical ecommerce workflow end-to-end, backed by a MySQL database and REST APIs.

## Tech Stack

### Frontend

- React + Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React icons
- React Hot Toast

### Backend

- Node.js + Express
- MySQL (`mysql2`)
- JWT authentication (`jsonwebtoken`)
- Password hashing (`bcrypt`)
- CORS + dotenv
- Nodemailer (email support)

## Project Structure

```text
SYP Project/
	backend/
		Controller/
		routes/
		config/
			init.sql
			seed_products.sql
		server.js
	client/
		src/
			pages/
			components/
			lib/
		vite.config.js
```

## Main Features

- Role-based authentication (`user` and `admin`)
- Registration and login with role selection
- Product listing and filtering
- Cart management
- Checkout flow with multiple payment methods
- Order creation and order history
- Admin dashboard with delivery and order overview
- Category management view aligned with product departments
- Admin notifications for new registrations and new orders
- Session invalidation on backend restart (forces re-login)

## Authentication and Roles

- Roles are stored in the `users.role` column as enum values: `user`, `admin`.
- Login verifies that selected role matches the stored role.
- Admin-only areas are route-protected on the frontend.
- Server restart invalidates existing client sessions to improve session safety.

## Database Behavior

On backend startup:

1. `config/init.sql` is executed.
2. Schema compatibility checks run (role column, product/order structure updates).
3. `config/seed_products.sql` seeds product data.

This keeps development setup repeatable while preserving existing data where possible.

## Setup Guide

## 1. Backend Setup

From the `backend` folder:

```bash
npm install
```

Create a `.env` file (or update existing values):

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=quickkart
JWT_SECRET=your_jwt_secret
PORT=5000
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
```

Run backend:

```bash
npm run start:backend
```

## 2. Frontend Setup

From the `client` folder:

```bash
npm install
npm run dev
```

Frontend runs on Vite default port (usually `5173`).

## 3. Run Both Together

From the `backend` folder:

```bash
npm run dev
```

This runs backend and frontend concurrently.

## Useful Scripts

### Backend (`backend/package.json`)

- `npm run start:backend` : start backend with nodemon
- `npm run start:frontend` : start frontend dev server
- `npm run dev` : run both backend and frontend together

### Frontend (`client/package.json`)

- `npm run dev` : start Vite dev server
- `npm run build` : production build
- `npm run preview` : preview built app
- `npm run lint` : run ESLint

## API Overview

Base URL: `http://localhost:5000/api`

- `/auth` : register, login, session meta
- `/products` : product listing/details
- `/categories` : category data
- `/orders` : checkout, user/admin order views, delivery updates, overview
- `/reviews` : review endpoints
- `/cart` : persistent cart endpoints

## Notes

- Keep secrets out of version control.
- If schema changes are made manually, align both `init.sql` and startup migration logic in `server.js`.
- For production, strengthen auth and admin creation policy (do not allow open admin signup).

## License

This project is currently for academic/development use.
