# Gym Management System - Client

This is the frontend for the Gym Management System, built with React and Vite.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Setup

1.  Navigate to the client directory:
    ```bash
    cd client
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

## Features

- **Role-Based Access Control**: Separate areas for Admin, Owner, and Member.
- **Authentication**: JWT-based auth with local storage persistence.
- **Project Structure**: Scalable folder structure separating services, context, pages, and components.
- **API Integration**: Axios setup with interceptors for token handling.

## Credentials (Demo)

- **Admin**: `admin@test.com` / `password`
- **Owner**: `owner@test.com` / `password`
- **Member**: `user@test.com` / `password`
