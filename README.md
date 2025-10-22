# 2409-wns-rouge-hopin-go

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Code Quality](#code-quality)
- [Manual Tests](#manual-tests)
- [Deployment Workflow (CI/CD/Deployment)](#deployment-workflow-cicddeployment)
- [Manual Server Management](#manual-server-management)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** and **npm** installed on your machine. You can download them from [here](https://nodejs.org/).
- **Docker** and **Docker Compose** installed on your machine. You can download Docker from [here](https://www.docker.com/get-started).

Verify the installations by running:

```bash
node -v
npm -v
docker --version
docker-compose --version
```

## Installation

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

Clone this repository to your local machine using Git:

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

### 2. Install Dependencies

Install the dependencies for both the frontend and backend.

```bash
# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
```

## Running the Project

This project uses Docker Compose for containerization. Follow the steps below to run it:

### 1. Build and Start the Containers

Use Docker Compose to build the Docker images and start the containers:

```bash
docker compose up -d
```

The -d flag runs the containers in detached mode.

### 2. Verify the Containers are Running

To check the status of your containers, use:

```bash
docker compose ps
```

### 3. On Windows: launch codegen

To automatically update TypeScript types when the GraphQL schema changes, run this command in a separate terminal:

```bash
cd frontend
npx graphql-codegen --watch
```

## Usage

Once the containers are running, you can access the services:

- **Frontend**: [http://localhost:8080](http://localhost:8080)
- **Backend (Apollo Studio)**: [http://localhost:8080/api](http://localhost:8080/api)

## Example Commands

- **Rebuild**
  To rebuild if you added dependencies, modified the dockerfile or compose.yml:

```bash
docker compose up --build -d
```

- **View Logs**

To view the logs of your Docker containers:

```bash
docker compose logs -f
```

- **Stop the Containers**

To stop the running containers:

```bash
docker compose stop
```

- **Remove the Containers**

```bash
docker compose down
```

## Code Quality

To ensure consistent code style and maintain high-quality code across the project, we use **Prettier** and **ESLint**.

- **Prettier** automatically formats the code according to a defined style (indentation, quotes, semicolons, line length, etc.).
- **ESLint** analyzes the code and highlights syntax errors, bad practices, or deviations from our coding rules.

The following VS Code settings are used to apply these tools automatically:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```

### Running ESLint

To check the code locally before committing:

```bash
# Check linting errors
npx eslint .

# Automatically fix errors and format code
npx eslint . --fix
```

## Manual Tests

To check the code quality and non-regression before pushing to Github you **must** run the tests manually:

### Running Tests Manually

```bash
# Run frontend tests
cd frontend
npm run vitest

# Run backend tests
cd backend
npm run test:postgres
```

## Deployment Workflow (CI/CD/Deployment)

This section describes the full deployment pipeline, from code validation (CI) to automatic staging deployment and manual production deployment.

### 1. Continuous Integration (CI)

The **CI (Continuous Integration)** pipeline runs automatically on each push to the `dev` and `main` branch:

- Executes **automated tests** (frontend and backend)
- If tests succeed, build and push **Docker images** from the Dockerfiles
- Publishes the images to **DockerHub** with the appropriate tags (`staging` or `latest`).

This ensures that each validated update is deployed automatically.

### 2. Staging Deployment (Automatic)

The project is deployed automatically through **GitHub Actions (CI)** and a **webhook** configured on the remote server.

The **CD (Continuous Deployment)** process is handled by a **webhook** after the push on `dev` branch:

- It pulls the latest images from DockerHub with "staging" tag
- Then restarts the containers using **Docker Compose** on the server

This ensures that each validated update is deployed automatically.

You can access the deployed project in staging here:
[https://staging.092024-rouge-5.wns.wilders.dev/](https://staging.092024-rouge-5.wns.wilders.dev/)

### 3. Production Deployment (Manual)

The **production deployment** process is is triggered manually after pushing to the `main` branch, once the staging version has been validated by the team : 

- It pulls the latest images from DockerHub with "latest" tag
- Then restarts the containers using **Docker Compose** on the server

You can access the deployed project in production here: 
[https://092024-rouge-5.wns.wilders.dev/](https://092024-rouge-5.wns.wilders.dev/)

## Manual Server Management

These commands are for use on the remote server.

### 1. Connect via SSH

For manual checks or maintenance, connect via SSH:

```bash
ssh wns_student@092024-rouge-5.wns.wilders.dev -p 2269
```
### 2. File Structure

- **Production:** 
```bash
/home/wns_student/apps/hopingo-prod/
├── backend.env
├── database.env
├── compose.prod.yml
├── fetch-and-deploy.sh
├── nginx
    └── nginx.conf
```

- **Staging:**
```bash
/home/wns_student/apps/hopingo-staging/
├── backend.env
├── database.env
├── compose.prod.yml
├── fetch-and-deploy.sh
├── nginx
    └── nginx.conf
```

### 3. Server-Side Commands

Navigate to the appropriate directory (`hopingo-staging` or `hopingo-prod`) before running these commands.

- **Start the services:**
  ```bash
  docker compose -f compose.prod.yml up -d
  ```

- **Check container status:**
  ```bash
  docker compose -f compose.prod.yml ps
  ```

- **View logs:**
  ```bash
  # Webhook service logs
  journalctl -u webhook -f

  # Nginx access logs (example for production)
  tail -f /home/wns_student/apps/hopingo-prod/nginx/logs/access.log
  ```

### 4. Database Migrations (TypeORM)

The database schema is managed using **TypeORM migrations**.

- Migrations are **generated locally** when entities change:

  ```bash
  npm run typeorm migration:generate ./migrations/title
  ```
  → This creates a file in `./migrations/`.
- These migration files are committed to Git and included in the Docker image during build.
- On staging and production, migrations are **executed automatically** at startup (via `migrationsRun: true`) or manually:

  ```bash
  docker compose -f compose.prod.yml exec back npm run typeorm migration:run
  ```
TypeORM keeps track of applied migrations inside the table migrations in the PostgreSQL database.

### Workflow for Generating a New Migration

After modifying an entity, you must generate a new migration file to reflect this change. This process ensures that your entity code and database schema stay in sync.

**Follow these steps on your local machine. All of the following commands must be run from within the `/backend` directory.**

> **Warning:** This process includes a destructive command (`schema:drop`) that will erase all data in your local development database. **Never run this on a production database.**

**Important (temporary): set NODE_ENV=prod**

Before running the steps below, temporarily set NODE_ENV to `prod` in the project root `backend.env` so TypeORM loads the production DB config used by migrations.

1.  **Ensure your local database container is running.**

2.  **Drop your local database schema** to start from a clean slate. This removes all tables.
    ```bash
    # From the /backend directory
    npm run typeorm schema:drop
    ```

3.  **Run all existing migrations** to bring your database to the latest state *before* your changes.
    ```bash
    npm run typeorm migration:run
    ```

4.  **Generate the new migration.** TypeORM will now compare the database schema (from step 3) with your updated entity code and generate a file containing the difference.
    ```bash
    # Replace "UpdateUserEntity" with a descriptive name for your change
    npm run typeorm migration:generate ./migrations/UpdateUserEntity
    ```

5.  **Analyze the result:**
    *   **If you see `No changes in database schema were found`:** Your code changes had no impact on the database schema. You can delete the empty migration file if one was created.
    *   **If a new migration file is generated:** Open the file in `./migrations/` to review the SQL commands (`UP` and `DOWN`). Ensure they match your expectations. You can edit the file if needed.

6.  **Commit the new migration file** to Git. It is now part of the project history and will be executed during deployment.

**Reminder — restore NODE_ENV to `dev`**

After you have generated, reviewed and committed the migration, make sure to set `NODE_ENV` back to `dev` in `backend.env` so you resume normal local development.

If you changed containers/config while producing migrations, restart the local stack:

```bash
docker compose down
docker compose up --build
```

### Undo the last migration

If there is a problem while performing a migration, it is possible to revert to the previous state of the schema:

**locally :**
```bash
npm run typeorm migration:revert
```
