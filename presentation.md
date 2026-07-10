# Weekly Report Generator & Team Dashboard

## System Architecture Overview
- **Frontend**: React (Vite), React Router for SPA navigation, Tailwind CSS for styling, Recharts for data visualization.
- **Backend**: Node.js, Express.js providing a REST API.
- **Database**: SQLite, using `better-sqlite3` for fast, simple relational data management without external dependencies.
- **Authentication**: JWT-based, handling two distinct roles: `MEMBER` and `MANAGER`.

## Frontend Architecture
### Member Flow
- Members submit standardized weekly reports (no custom fields) to ensure consistent data ingestion.
- Reports track weekly tasks, planned tasks, blockers, and hours on specific projects.
- "My Reports" history view allows members to see their past submissions.

### Manager Flow
- Dashboard provides a high-level view of all team reports.
- Includes charts (using `recharts`) showing reports submitted per project.
- Summary metrics track total active team members and recent compliance.

### Axion Studio Design Language
- The landing page accurately reproduces the requested "Axion Studio" premium aesthetic.
- The same design system (typography, colors, button styles) carries over into the app interfaces.

## Backend Architecture
- **Auth Routes**: `/api/auth/register`, `/api/auth/login` (issues JWTs).
- **Report Routes**: `/api/reports` (POST for creation, GET filtered by role: managers see all, members see own).
- **Dashboard Routes**: `/api/dashboard` (Returns aggregated metrics and stats for charts).
- **Role-Based Access Control**: Middleware `isManager` checks the JWT payload to block unauthorized access to manager endpoints.

## Database Design
- `Users`: Stores `email`, `password_hash`, and `role`.
- `Projects`: Defines categories of work (e.g., "Luminar", "Internal Tooling").
- `Reports`: Links `user_id` and `project_id`, storing tasks, blockers, and dates.
- Using SQLite allows this assignment to be completely self-contained and run immediately on any machine without installing PostgreSQL.

## AI Chat Assistant (Bonus Implementation)
- An AI Chat widget is integrated into the Manager Dashboard (bottom right).
- Managers can ask natural language questions like "What did the design team work on last week?" or "Are there any blockers?"
- **Current Setup**: The endpoint `/api/chat` currently returns simulated (mock) AI responses to ensure the demo runs without paid API keys. It serves as a proof of concept for a Retrieval-Augmented Generation (RAG) system querying the `Reports` table.
- **Future Improvements**: We would connect this endpoint to Anthropic Claude or OpenAI using function calling to securely execute SQL read-queries against the SQLite database to answer live questions.

## Challenges & Solutions
1. **Design Fusion**: Integrating a highly specific agency landing page (Axion Studio) with an internal software tool.
   *Solution*: Used the Axion hero/about sections as the public landing page, and extended its clean, gray/white/orange aesthetic into the internal dashboard components.
2. **Setup Friction**: Technical assignments often have complex DB setups (Docker, Postgres, schema migrations).
   *Solution*: Used `better-sqlite3` and built an automated initialization script (`src/db/init.js`) that creates tables and seeds demo data instantly upon running.
