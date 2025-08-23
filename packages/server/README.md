# Backend Server

This directory contains the backend server for the Stock Finance Trading Simulator.

It is responsible for fetching stock data from external sources, providing a REST API for the frontend, and handling all server-side business logic.

### Key Technologies

- Node.js
- Express.js
- Axios

### Setup and Running

1. **Navigate to this directory:**
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

### API Endpoints

The following are the primary endpoints available:

- `GET /api/v1/trading/stocks`: Retrieves the cached stock data that was fetched on startup.
- `POST /api/v1/trading/echo`: An echo endpoint that returns the JSON body it receives.
