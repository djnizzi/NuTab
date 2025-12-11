# Setup Guide

This guide covers the installation and setup for the NuTab project.

## Prerequisites

- **Node.js**: Version 20 or higher.
- **Docker**: For running the containerized application.
- **MySQL**: (Or compatible database) as defined in the `DATABASE_URL`.

## Local Development

1.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the root directory and configure your database connection:
    ```env
    DATABASE_URL="mysql://user:password@host:port/database"
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:3000`.

## Docker Deployment

1.  **Build the Image**
    ```bash
    docker build -t nutab .
    ```

2.  **Run with Docker Compose**
    The project includes a `docker-compose.yml` file.
    ```bash
    docker-compose up -d
    ```
    Ensure the `DATABASE_URL` in `docker-compose.yml` points to your accessible database instance.

## Scripts

- `npm run build`: Build the application for production.
- `npm run start`: Start the production server.
- `npm run lint`: Run ESLint.
- `npx prisma generate`: Generate the Prisma client.
