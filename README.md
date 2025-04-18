# 2409-wns-rouge-hopin-go

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Usage](#usage)
- [Example Commands](#example-commands)
- [Api Gateway](#api-gateway)

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


 ## CD

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

