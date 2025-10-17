# 2409-wns-rouge-hopin-go

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Usage](#usage)
- [Example Commands](#example-commands)
- [Deployment(staging/production)](#deployment)

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

### 1. Clone the Repository

Clone this repository to your local machine using Git:

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

### 2. Install Dependencies

```bash
cd frontend
npm install
cd ..
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

Once the project is running, access it by navigating to http://localhost:8080 in your web browser for the frontend.
To see Appollo Studio in the backend, access it by navigating to http://localhost:8080/api.

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

## Code Quality – Prettier & ESLint

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

### Usage

To check the code locally before committing:

```bash
# Check linting errors
npx eslint .

# Automatically fix errors and format code
npx eslint . --fix

## Continue delivery

- **Connect on server**

```bash
ssh wns_student@092024-rouge-5.wns.wilders.dev -p 2269
```

- **View Logs**

To view the logs of your Docker containers:

```bash
# webhook
journalctl -u webhook -f

# Nginx
tail -f apps/production/logs/access.log
# or
tail -f apps/production/logs/error.log
```

## Deployment (staging / production)

The project is deployed automatically through **GitHub Actions (CI)** and a **webhook** configured on the remote server.

---

### 1. How it works

The **CI (Continuous Integration)** pipeline runs automatically on each push to the `dev` branch:

- Executes **automated tests** (frontend and backend)
- Builds **Docker images** from the Dockerfiles
- Publishes the images to **DockerHub**

The **CD (Continuous Deployment)** process is handled by a **webhook**:

- It pulls the latest images from DockerHub
- Then restarts the containers using **Docker Compose** on the server

This ensures that each validated update is deployed automatically.

---

### 2. Accessing the Server

For manual checks or maintenance, connect via SSH:

```bash
ssh wns_student@092024-rouge-5.wns.wilders.dev -p 2269

ajouter le chemin dans le serveur apps/production et apps/staging avec le contenu des fichiers. expliquer déroulement staging et mise en prod (manuelle)

+ migration