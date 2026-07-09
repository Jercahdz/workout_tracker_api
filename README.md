# Workout Tracker API

REST API for workout management, including routines, exercises, session tracking, and AI-powered personalized routine generation.

This project simulates a real production backend environment, integrating clean architecture principles, authentication, role-based access control, automated testing, and CI/CD.

![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-black?logo=fastify&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-tested-6E9F18?logo=vitest&logoColor=white)
![CI](https://github.com/Jercahdz/workout_tracker_api/actions/workflows/ci.yml/badge.svg)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-API%20Docs-brightgreen)](https://workouttrackerapi-production.up.railway.app/docs)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

Workout Tracker API allows users to:

- Register and authenticate securely using JWT.
- Create and manage a fitness profile (age, weight, height, goal, level).
- Browse an exercise catalog managed by admins.
- Create custom workout routines combining exercises, sets, reps, and weight.
- Log completed workout sessions.
- Track weight progress over time.
- Generate a personalized weekly workout routine using a local AI model based on the user's fitness profile.

This is a personal portfolio project built to practice production-grade backend architecture, not a commercial product.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 |
| Language | TypeScript |
| Framework | Fastify |
| Database | MySQL 8 |
| ORM | Prisma |
| Authentication | JWT (access + refresh tokens), bcrypt |
| Validation | Zod |
| AI Provider | Ollama (llama3.2), interchangeable via provider pattern |
| Testing | Vitest |
| CI/CD | GitHub Actions |
| Containers | Docker, Docker Compose |

---

## Architecture

The project follows a **modular, domain-driven structure**. Each module is self-contained and follows the same internal layering:

```
Request → Routes → Middlewares → Controller → Service → Prisma → Database
```

- **schema**: Zod validation rules and inferred TypeScript types for incoming data.
- **service**: Pure business logic. No knowledge of HTTP, only domain rules and database access.
- **controller**: Bridges HTTP and the service layer. Validates input, calls the service, maps results to HTTP responses.
- **routes**: Registers endpoints and attaches the required middlewares (`authenticate`, `authorize`).

The AI module follows the **Dependency Inversion** and **Open/Closed** principles through an `AIProvider` interface, allowing the underlying AI engine (currently Ollama) to be swapped without touching business logic.

---

## Project Structure

```
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── profile/
│   ├── exercises/
│   ├── workouts/
│   ├── sessions/
│   ├── progress/
│   └── ai/
│       └── providers/
├── shared/
│   ├── middlewares/
│   └── utils/
├── config/
├── __tests__/
├── app.ts
└── server.ts
prisma/
├── schema.prisma
└── migrations/
.github/
└── workflows/
    └── ci.yml
docker-compose.yml
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- Docker Desktop
- [Ollama](https://ollama.com) installed locally

### Installation

```bash
git clone https://github.com/Jercahdz/workout_tracker_api.git
cd workout_tracker_api
npm install
```

### Environment Setup

Copy the example file and adjust if needed:

```bash
cp .env.example .env
```

### Start the database

```bash
docker compose up -d
```

### Run database migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### Pull the AI model

```bash
ollama pull llama3.2
```

### Run the project

```bash
npm run dev
```

The server will be available at `http://localhost:3000`.

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port |
| `NODE_ENV` | Environment (development / production) |
| `DATABASE_URL` | MySQL connection string |
| `JWT_SECRET` | Secret for access tokens |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| `JWT_EXPIRES_IN` | Access token expiration |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration |
| `AI_PROVIDER` | AI provider identifier (`ollama`) |
| `OLLAMA_BASE_URL` | Ollama local server URL |
| `OLLAMA_MODEL` | Ollama model name |

See `.env.example` for a complete template.

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Login and obtain tokens | Public |
| POST | `/auth/refresh` | Refresh access token | Public |
| POST | `/auth/logout` | Logout | Public |

### Users
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/users/me` | Get current user | Bearer |
| PUT | `/users/me` | Update current user | Bearer |
| DELETE | `/users/me` | Delete current user | Bearer |

### Profile
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/profile` | Get fitness profile | Bearer |
| POST | `/profile` | Create fitness profile | Bearer |
| PUT | `/profile` | Update fitness profile | Bearer |

### Exercises
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/exercises` | List all exercises | Bearer |
| GET | `/exercises/:id` | Get exercise by id | Bearer |
| POST | `/exercises` | Create exercise | Bearer + Admin |
| PUT | `/exercises/:id` | Update exercise | Bearer + Admin |
| DELETE | `/exercises/:id` | Delete exercise | Bearer + Admin |

### Workouts
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/workouts` | List user's workouts | Bearer |
| GET | `/workouts/:id` | Get workout by id | Bearer |
| POST | `/workouts` | Create workout | Bearer |
| PUT | `/workouts/:id` | Update workout | Bearer |
| DELETE | `/workouts/:id` | Delete workout | Bearer |

### Sessions
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/sessions` | List completed sessions | Bearer |
| GET | `/sessions/:id` | Get session by id | Bearer |
| POST | `/sessions` | Log a completed session | Bearer |

### Progress
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/progress` | Get progress history | Bearer |
| POST | `/progress/log` | Log a new progress entry | Bearer |

### AI
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/ai/generate-routine` | Generate a personalized routine | Bearer |

### Health
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/health` | Health check | Public |

---

## Testing

Unit tests are written with **Vitest**, focusing on the service layer (business logic), with Prisma fully mocked so tests run without a real database connection.

```bash
npm test            # run tests once
npm run test:watch  # run tests in watch mode
npm run test:coverage
```

---

## CI/CD

Every push and pull request to `main` triggers a GitHub Actions pipeline that:

1. Installs dependencies
2. Runs the full unit test suite

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

---

## Roadmap

- [ ] Full imperial unit system support (lb / in) across all weight and height fields
- [ ] Refresh token blacklist for real logout invalidation
- [ ] Cloud deployment pipeline
- [ ] Additional AI provider implementations (Gemini, Groq) using the existing `AIProvider` interface
- [ ] Pagination and filtering for list endpoints

---

## License

This project is for educational and portfolio purposes.