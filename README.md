# Wayfare — Airbnb Clone (MERN Stack Capstone)

A full-featured Airbnb-style booking platform built with MongoDB, Express, React, and Node.js. Guests can search and filter stays, view listings, and book with real-time availability checks. Hosts can create, edit, and manage listings and see incoming bookings from a dashboard.

## Features

- **Auth** — Signup/login with JWT, hashed passwords (bcrypt), persistent sessions
- **Listings** — Create/edit/delete properties with multi-image upload (Cloudinary)
- **Search & filters** — City, dates, guest count, price range, property type, amenities
- **Booking** — Date-range selection, live price calculation, double-booking prevention
- **Host dashboard** — Manage listings, view/track bookings on your properties
- **Guest trips page** — View and cancel your own bookings
- **Responsive design** — Works on mobile, tablet, and desktop

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Image uploads | Multer + Cloudinary |

## Project structure

```
airbnb-clone/
├── backend/
│   ├── config/          # DB + Cloudinary config
│   ├── controllers/     # Route handlers (auth, properties, bookings)
│   ├── middleware/      # JWT auth, error handling, upload
│   ├── models/          # Mongoose schemas (User, Property, Booking)
│   ├── routes/          # Express routers
│   ├── seed/            # Demo data seeder
│   └── server.js
└── frontend/
    └── src/
        ├── components/  # Navbar, PropertyCard, SearchBar, BookingWidget, etc.
        ├── context/      # AuthContext (global user session)
        ├── pages/        # Home, PropertyDetails, Dashboard, Login, etc.
        └── services/     # Axios API client
```

## Prerequisites

- Node.js 18+
- A MongoDB database — either:
  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally, or
  - a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A free [Cloudinary](https://cloudinary.com/) account (for image uploads) — grab your Cloud name, API key, and API secret from the dashboard

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in:
- `MONGO_URI` — your local or Atlas connection string
- `JWT_SECRET` — any long random string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard

Start the server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health` to confirm it's up.

**(Optional) Seed demo data** — creates a host account, a guest account, and 4 sample listings:

```bash
npm run seed
```

This prints demo login credentials to the console (`host@example.com` / `guest@example.com`, both with password `password123`).

### 2. Frontend

In a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173` and talks to the API at the URL set in `frontend/.env` (`VITE_API_URL`).

### 3. Try it out

1. Visit `http://localhost:5173`
2. Sign up (check "I want to host stays") or log in with a seeded account
3. As a host: go to **Host dashboard → + New listing** to publish a property
4. As a guest: search/filter on the home page, open a listing, and book it
5. Check **My trips** (guest) or **Host dashboard → Bookings** (host) to see the results

## API overview

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Register | Public |
| POST | `/api/auth/login` | Log in | Public |
| GET | `/api/auth/me` | Current user | Private |
| GET | `/api/properties` | Search/filter listings | Public |
| GET | `/api/properties/:id` | Listing detail + availability | Public |
| POST | `/api/properties` | Create listing (multipart, `images[]`) | Private |
| PUT | `/api/properties/:id` | Update listing | Private (owner) |
| DELETE | `/api/properties/:id` | Delete listing | Private (owner) |
| GET | `/api/properties/host/mine` | Your listings | Private |
| POST | `/api/bookings` | Create booking | Private |
| GET | `/api/bookings/mine` | Your bookings (guest) | Private |
| GET | `/api/bookings/host` | Bookings on your listings | Private |
| PUT | `/api/bookings/:id/cancel` | Cancel a booking | Private |

## Notes on this build

- Image uploads use Cloudinary via `multer-storage-cloudinary`. Without valid Cloudinary credentials, the upload requests in `POST /api/properties` will fail — you must fill in the three `CLOUDINARY_*` values in `backend/.env` before creating listings with photos.
- Double-booking is prevented at the database query level: `POST /api/bookings` rejects any date range that overlaps an existing confirmed/pending booking for that property.
- This project was not run/built in this environment (no network access here), so before your first `npm run dev`, run `npm install` in both `backend/` and `frontend/` and resolve any dependency version bumps if they occur.
