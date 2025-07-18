# AI Agent Monorepo

This project is a monorepo containing a **Next.js** frontend and a **NestJS** backend, designed to provide an AI agent chat experience. The agent feature is currently a work in progress.

## Project Structure

```
.
├── backend/   # NestJS backend (API, agent logic)
├── frontend/  # Next.js frontend (UI, chat interface)
├── package.json
├── README.md
└── ...
```

## Features
- **Frontend:** Modern chat UI built with Next.js and React, styled with Tailwind CSS.
- **Backend:** API built with NestJS, with planned integration for OpenAI agent features.
- **Agent Chat:** Users can send messages to an AI agent (feature under development).

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Install Dependencies

From the project root, run:

```bash
npm install
```

This will install dependencies for both the frontend and backend.

### Development

To start both the frontend and backend in development mode:

```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:4000](http://localhost:4000)

You can also run them individually:

```bash
npm run start:frontend   # Starts Next.js frontend
npm run start:backend    # Starts NestJS backend
```

## Scripts
- `npm run dev` — Start both frontend and backend concurrently
- `npm run start:frontend` — Start only the frontend
- `npm run start:backend` — Start only the backend

## Development Notes
- The **AI agent** feature is not fully implemented yet. The backend currently returns a placeholder response for agent chat requests.
- The backend is set up for future integration with OpenAI via the `openai` and `@openai/agents` packages.
- The frontend chat UI is ready and posts messages to the backend.

## Directory Details
- **backend/**: Contains a standard NestJS project (see `backend/README.md` for more details).
- **frontend/**: Contains a standard Next.js project (see `frontend/README.md` for more details).

## License

This project is licensed under the ISC License (see `package.json`). 
