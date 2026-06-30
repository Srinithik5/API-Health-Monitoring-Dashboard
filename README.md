# API Health Monitoring Dashboard

> A full-stack monitoring system that pings external APIs, tracks uptime and response times, and visualizes the results on a real-time analytics dashboard.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-4169E1?style=flat&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?style=flat&logo=chart.js&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

---

## Overview

API Health Monitoring Dashboard is a backend-driven monitoring tool that checks the health of any number of external APIs on demand, records performance metrics in PostgreSQL, and surfaces the results through a React + Chart.js dashboard. It's built as a clean, modular reference implementation for teams who want visibility into uptime, latency, and failure rates without standing up a full observability stack.

---

## Features

- **API uptime monitoring** — pings a configurable list of endpoints and records whether each check succeeded
- **Response time tracking** — measures and stores the latency of every request, in milliseconds
- **Error rate detection** — flags non-2xx responses and network failures, with the underlying error message preserved
- **PostgreSQL data storage** — every check is persisted to a relational database for historical querying
- **Analytics dashboard** — aggregated summary, per-API uptime, and per-API latency, computed entirely in SQL
- **Real-time monitoring trigger** — a "Run Monitoring" action that fires checks on demand and refreshes the dashboard immediately

---

## Architecture Overview

```
┌─────────────────────┐        HTTP (Axios)        ┌──────────────────────┐
│   React Frontend     │ ─────────────────────────▶ │   Express Backend     │
│   (Vite + Chart.js)  │ ◀───────────────────────── │   (REST API)          │
└─────────────────────┘        JSON responses        └──────────┬───────────┘
                                                                  │
                                                       SQL queries (pg Pool)
                                                                  │
                                                                  ▼
                                                       ┌──────────────────────┐
                                                       │     PostgreSQL        │
                                                       │   (api_metrics table) │
                                                       └──────────────────────┘
```

**Request flow:**
1. The frontend triggers a monitoring run, or loads the dashboard on mount.
2. The Express backend pings each configured external API with Axios, measuring status code and response time.
3. Each result is written to the `api_metrics` table in PostgreSQL.
4. Analytics endpoints aggregate that table with SQL (`COUNT`, `AVG`, `FILTER`, `GROUP BY`) and return dashboard-ready JSON.
5. The React dashboard renders summary cards and Chart.js visualizations from that JSON.

**Project structure:**
```
api-health-monitor/
├── server/                  # Express backend
│   ├── app.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── db/
│   └── middleware/
├── client/                  # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── charts/
│       └── services/
└── sql/                     # Database schema
```

---

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/api-health-monitor.git
cd api-health-monitor
```

### 2. Backend setup
```bash
# from the project root
npm install

# create the database table
psql "$DATABASE_URL" -f sql/001_create_api_metrics.sql

# configure environment variables
cp .env.example .env
# then edit .env with your own values

# start the backend (http://localhost:5000)
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install

# start the frontend (http://localhost:5173)
npm run dev
```

With both servers running, open `http://localhost:5173` in your browser. The dashboard will load existing metrics on mount; click **Run Monitoring** to trigger a fresh check.

---

## Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```env
# Server port
PORT=5000

# PostgreSQL connection string
DATABASE_URL=postgresql://username:password@localhost:5432/api_health_monitor
```

| Variable       | Description                                  | Example                                                         |
|----------------|-----------------------------------------------|------------------------------------------------------------------|
| `PORT`         | Port the Express server listens on            | `5000`                                                            |
| `DATABASE_URL` | PostgreSQL connection string (pg Pool)        | `postgresql://user:pass@localhost:5432/api_health_monitor`       |

> The frontend currently points at `http://localhost:5000` directly inside `client/src/services/api.js`. Update that constant if your backend runs elsewhere.

---

## API Routes

### System
| Method | Endpoint   | Description                              |
|--------|-----------|-------------------------------------------|
| GET    | `/`        | Returns a plain-text server status string |
| GET    | `/health`  | Returns `{ status, uptime }`              |

### Monitoring
| Method | Endpoint        | Description                                                        |
|--------|-----------------|----------------------------------------------------------------------|
| GET    | `/monitor/run`  | Pings all configured APIs, stores results, returns `{ total, success, failed }` |

### Analytics
| Method | Endpoint            | Description                                                                 |
|--------|---------------------|-------------------------------------------------------------------------------|
| GET    | `/analytics/summary`| Returns `{ totalRequests, successRate, failureRate, avgResponseTime }`        |
| GET    | `/analytics/uptime` | Returns per-API `[{ url, uptime, avgResponseTime, totalChecks }]`             |
| GET    | `/analytics/latency`| Returns per-API `[{ url, avgResponseTime }]`, sorted slowest first            |

---

## Screenshots

### API Health Monitoring Dashboard

> A full-stack monitoring system that pings external APIs, tracks uptime and response times, and visualizes the results on a real-time analytics dashboard.

![API Health Monitoring Dashboard](assets/screenshots/dashboard.png)

---

## Future Improvements

- [ ] Scheduled/automated monitoring (cron-based polling instead of manual trigger only)
- [ ] Historical time-series latency charts (per-API trend lines instead of single averages)
- [ ] Configurable API list via database or admin UI instead of hardcoded URLs
- [ ] Alerting (email/Slack/webhook) when an API fails or breaches a latency threshold
- [ ] Authentication and multi-user/team support
- [ ] Pagination and filtering for raw metrics history
- [ ] Dockerized deployment (backend + frontend + PostgreSQL via Docker Compose)
- [ ] Unit and integration test coverage
- [ ] Rate-limit and retry logic for flaky target APIs

---

## License

This project is licensed under the [MIT License](./LICENSE).