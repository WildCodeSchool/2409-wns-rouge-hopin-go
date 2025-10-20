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

To update typescript types, use:

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
  To rebuild if if you added dependencies, modified the dockerfile or compose.yml:

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

To check the code quality and non-regression before pushing to github you must run the tests manually:

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

### 1. Continuous Integration (CI)

The **CI (Continuous Integration)** pipeline runs automatically on each push to the `dev` and `main` branch:

- Executes **automated tests** (frontend and backend)
- If tests succeed, build and push **Docker images** from the Dockerfiles
- Publishes the images to **DockerHub** with the appropriate tags (`staging` or `latest`).

This ensures that each validated update is deployed automatically.

## 2. Staging Deployment (Automatic)

The project is deployed automatically through **GitHub Actions (CI)** and a **webhook** configured on the remote server.

The **CD (Continuous Deployment)** process is handled by a **webhook** after the push on `dev` branch:

- It pulls the latest images from DockerHub with "staging" tag
- Then restarts the containers using **Docker Compose** on the server

This ensures that each validated update is deployed automatically.

To see the project in staging, click on :
[https://staging.092024-rouge-5.wns.wilders.dev/](https://staging.092024-rouge-5.wns.wilders.dev/)

### 3. Production Deployment (Manual)

The **Deployment** process is handled manually after the push on `main` branch once the staging project is validated by the team:

- It pulls the latest images from DockerHub with "latest" tag
- Then restarts the containers using **Docker Compose** on the server

To see the project deployed, click on :
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


### 4. Database Migrations
TODO

