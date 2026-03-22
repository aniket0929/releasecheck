# Release Checklist Tool

A comprehensive web application designed to track software release checklists.

## API Endpoints (`/api/releases`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Retrieve a list of all releases ordered by creation date |
| `GET` | `/:id` | Retrieve detailed information about a single release |
| `POST` | `/` | Create a new release (requires `name`, `date`, optional `additional_info`) |
| `PUT` | `/:id` | Update the `additional_info` for a release |
| `PUT` | `/:id/steps/:stepIndex` | Toggle the completion state of a specific step (requires `is_completed`) |
| `DELETE`| `/:id` | Delete a release |

## Database Schema

The backend uses a PostgreSQL database.

**Table: `releases`**

| Column Name | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Unique identifier for release |
| `name` | VARCHAR | NOT NULL | Display name of the release |
| `date` | TIMESTAMP | NOT NULL | Scheduled release date |
| `additional_info`| TEXT | NULL | Assorted remarks / notes |
| `steps` | BOOLEAN[] | DEFAULT \'{}\' | Array storing the true/false completion state |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation date |

## How to Run Locally

### Prerequisites
- Node.js v16+
- PostgreSQL database (You can quickly create one on [Neon.tech](https://neon.tech))

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file containing `DATABASE_URL` (your postgres connection string) and optionally `PORT` (defaults to 5000).
4. Run the server using `node index.js` or `npm run dev` (if nodemon is configured).

### Frontend
1. `cd frontend`
2. `npm install`
3. Create a `.env` file containing `VITE_API_URL=http://localhost:5000` (or your backend URL).
4. Run the development server with `npm run dev`.

### Docker (Backend)
If you prefer not to use your local Node.js environment, you can run the backend server effortlessly using Docker via the included `docker-compose.yaml` configuration:
1. Ensure your `.env` variables are correctly set within the `backend` directory.
2. From the root directory, execute: `docker-compose up --build`
3. The backend container will spin up and map port 5000 exactly as it behaves natively.

### Automated Tests
The codebase includes a suite of automated unit tests validating the core status constraint system.
1. Navigate to the backend directory: `cd backend`
2. Run the test suite: `npm test` (Uses the built-in native Node.js v18+ test runner)

## Deployment

### Vercel (Frontend)
The frontend can be easily deployed to Vercel:
1. Upload the repository to GitHub.
2. Link the repository to Vercel and set the Root Directory to `frontend`.
3. Add `VITE_API_URL` environment variable pointing to your deployed backend.

### Render / Heroku (Backend)
1. Link your repository.
2. Set root directory for the Web Service to `backend`.
3. Set the build command to `npm install` and start command to `node index.js`.
4. Ensure `DATABASE_URL` environment variable is added.
