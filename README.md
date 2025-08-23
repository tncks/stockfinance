# Stock Finance Trading Simulator

This project is a full-stack stock trading simulator application. It features a backend API for managing stock data and a modern, reactive frontend for user interaction.

## Project Structure

This project is a monorepo containing two primary packages:

- `packages/server`: A Node.js and Express-based backend server.
- `packages/webapp`: A React and Vite-based frontend application.

---

## Backend (`packages/server`)

The backend is a Node.js server responsible for fetching stock data, providing API endpoints for the frontend, and managing other server-side logic.

### Key Technologies
- Node.js
- Express.js
- Axios

### Setup and Running

1. **Navigate to the server directory:**
   ```sh
   cd packages/server
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the server:**
   ```sh
   npm start
   ```

The server will start on port 3000.

---

## Frontend (`packages/webapp`)

The frontend is a modern web application built with React that provides the user interface for the trading simulator.

### Key Technologies
- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn-ui

### Setup and Running

1. **Navigate to the webapp directory:**
   ```sh
   cd packages/webapp
   ```

2. **Install dependencies:**
   ```sh
   npm i
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   ```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).
