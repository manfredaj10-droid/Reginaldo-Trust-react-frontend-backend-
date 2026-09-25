# Reginaldo Charitable Trust — Fullstack Web Application

A modern, high-performance fullstack web platform for the **Reginaldo Charitable Trust** (Goa, India). The application provides information on the Trust’s charitable initiatives, free 24/7 ambulance and hearse services, farmer agricultural machinery lending, student scholarships, dignified house restoration, past community events, and an interactive 48-item photo archive.

---

## 1. Technology Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) + Custom Design Tokens
- **Typography & Icons**: Google Fonts (`Cinzel`, `Manrope`, `Hanken Grotesk`) + Google Material Symbols
- **Architecture**: Modular Component-Driven Architecture with an isolated API Client service layer

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: Native SQLite via Node 24's built-in **`node:sqlite`** (`DatabaseSync`) with Write-Ahead Logging (WAL) mode
- **Middleware**: `cors`, `morgan`, `dotenv`, centralized error & 404 handlers

---

## 2. Project Directory Structure

```
regi-react/
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore configuration
├── README.md                        # Documentation & setup guide
├── package.json                     # Fullstack dependencies and scripts
├── vite.config.js                   # Vite bundler configuration & API proxy
├── tailwind.config.js               # Theme, fonts & color tokens
├── postcss.config.js
├── index.html                       # HTML entry point
│
├── public/                          # Static assets
│   ├── favicon.png
│   └── images/                      # Optimized image assets (.webp)
│
├── server/                          # Dedicated Backend
│   ├── index.js                     # Server entry point & graceful shutdown
│   ├── data/                        # Persistent SQLite database storage
│   │   └── database.sqlite
│   └── src/
│       ├── app.js                   # Express application setup
│       ├── config/
│       │   ├── env.js               # Validated environment variables
│       │   └── db.js                # SQLite DatabaseSync connection & schema
│       ├── controllers/             # Request controllers
│       │   ├── contact.controller.js
│       │   ├── services.controller.js
│       │   ├── events.controller.js
│       │   └── gallery.controller.js
│       ├── routes/                  # Express routes
│       │   ├── index.js             # Central router (/api/...)
│       │   ├── contact.routes.js
│       │   ├── services.routes.js
│       │   ├── events.routes.js
│       │   └── gallery.routes.js
│       ├── middleware/              # Error handling & 404 middleware
│       │   ├── errorHandler.js
│       │   └── notFound.js
│       └── seed/                    # Initial database population
│           └── seedData.js
│
├── src/                             # Frontend React Application
│   ├── main.jsx                     # Root React mounting
│   ├── App.jsx                      # Route definitions
│   ├── index.css                    # Master stylesheet
│   ├── components/                  # UI Components
│   │   ├── common/                  # Navbar, Footer, FloatingActions
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── FloatingActions.jsx
│   │   └── feedback/                # Feedback & alerts
│   │       └── Toast.jsx
│   ├── context/                     # Global state
│   │   └── ToastContext.jsx
│   ├── hooks/                       # Custom hooks
│   │   └── useScrollEffects.js
│   ├── services/                    # API Client Layer
│   │   ├── api.js                   # Centralized HTTP client
│   │   ├── contactService.js
│   │   ├── eventsService.js
│   │   ├── galleryService.js
│   │   ├── servicesService.js
│   │   └── index.js
│   └── pages/                       # Route Views
│       ├── Home.jsx                 # Ken-Burns Carousel, 4 Pillars, Bento Grid
│       ├── About.jsx                # Trust History, Values, Founder
│       ├── Services.jsx             # 6 Core Areas of Service
│       ├── OurWork.jsx              # Interactive Program Directory & Past Events
│       ├── Gallery.jsx              # 48 Curated Photos, Category Filters, Lightbox
│       └── Contact.jsx              # Inquiries, Assistance Line, Map
│
└── scripts/
    └── verify-parity.mjs            # Parity check against original HTML
```

---

## 3. Getting Started

### Prerequisites
- Node.js **v22.5.0** or higher (Node **v24.x** recommended for built-in `node:sqlite`).

### Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```

---

## 4. Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite React development server on `http://localhost:5173` |
| `npm run server` | Starts the Express + SQLite API server on `http://localhost:5000` |
| `npm run dev:server` | Starts the API server with auto-reload (`node --watch`) |
| `npm run dev:all` | Runs **both** frontend and backend simultaneously using Concurrently |
| `npm run build` | Builds the production bundle in `dist/` |
| `npm run preview` | Previews the production build locally |

---

## 5. API Reference

All API routes are served under `/api` and automatically proxied from the React development server:

### Health Check
- **`GET /api/health`**
  - Returns server health status, uptime, and database engine.

### Contact & Inquiries
- **`POST /api/contact`**
  - Submits a citizen inquiry and stores it in SQLite.
  - **Body**: `{ "name": string, "phone": string, "email"?: string, "service"?: string, "message": string }`
- **`GET /api/contact`**
  - Lists all contact submissions. Optional filter: `?status=new`.
- **`PATCH /api/contact/:id`**
  - Updates inquiry status (`new` | `in-progress` | `resolved`).

### Service Assistance Requests
- **`POST /api/services/request`**
  - Submits a dedicated assistance request (e.g. Free Ambulance, Farm Equipment, House Restoration).
  - **Body**: `{ "applicant_name": string, "phone": string, "village"?: string, "category": string, "urgency"?: string, "details"?: string }`
- **`GET /api/services/requests`**
  - Lists all submitted service requests.

### Community Events
- **`GET /api/events`**
  - Retrieves all 9 Trust events. Optional filter: `?is_extra=0` or `?is_extra=1`.
- **`POST /api/events`**
  - Creates a new event entry.

### Photo Gallery
- **`GET /api/gallery`**
  - Retrieves photo records. Optional filter: `?category=restoration`.
- **`POST /api/gallery`**
  - Adds a new photograph record to the archive.

---

## 6. License
© Reginaldo Charitable Trust. All rights reserved.
