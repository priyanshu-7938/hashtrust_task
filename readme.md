# Ethereum Real-Time Transaction Viewer - ⁆ Relay ⁅

## Overview

This project is a real-time Ethereum transaction viewer that fetches the latest transactions from the Ethereum blockchain and displays them in a React frontend. The backend is implemented using Node.js and connects to the Ethereum blockchain via Infura, then relay the data via WebSockets. The frontend is built with React and TypeScript and uses react-use-websocket lib to receive real-time transaction data from the backend.

## Features

- **Real-time Transaction Updates**: Fetches and displays the latest Ethereum transactions as soon as they are mined.
- **WebSocket Communication**: Utilizes WebSockets for real-time updates from the backend to the frontend.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your local machine.
- An Infura account and project ID. Sign up at [Infura](https://infura.io/) if you don't have one.
- Git installed on your local machine.

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/priyanshu-7938/hashtrust_task.git
   cd hashtrust_task
   ```

2. **Backend Setup:**

   1. Navigate to the `backend` directory:
      ```bash
      cd backend
      ```

   2. Install the required dependencies:
      ```bash
      npm install
      ```

   3. Create a `.env` file in the `backend` directory and add your Infura project ID:
      ```plaintext
      INFURA_API_KEY = "your_infura_api_key"
      TESTING = true # for enablin "/stats" route to access performance
      ```

   4. Start the backend server:
      ```bash
      npm run start
      ```

3. **Frontend Setup:**

   1. Navigate to the `frontend` directory:
      ```bash
      cd ../frontend
      ```

   2. Install the required dependencies:
      ```bash
      npm install
      ```

   3. Create a `.env` file in the `frontend` directory and add the following values:
      ```plaintext
      VITE_WS_URL = "ws://localhost:3002"
      VITE_HTTPS_URL = "http://localhost:3002"
      ```

   4. Start the frontend development server:
      ```bash
      npm run dev
      ```

4. **You are now up and running!** Open your browser and go to `http://localhost:5173`. You should see a table displaying the latest Ethereum transactions in real-time.

## Project Structure

- **backend/**: Contains the Node.js server code that connects to the Ethereum blockchain via Infura and sends real-time transaction data to the frontend via WebSocket.
  - `server.js`: The main server file that handles WebSocket connections and blockchain data fetching.
- **frontend/**: Contains the React application that displays the transaction data.
  - `src/`: Contains all the React components and context providers.
    - `WebSocketProvider.tsx`: Manages the WebSocket connection and state for transaction data.
    - `TransactionTable.tsx`: Displays the transaction data in a table format.
    - `App.tsx`: The main App component that integrates all parts of the frontend.
  - `public/`: Contains the static assets for the React application.
  - `package.json`: Contains the project dependencies and scripts for the frontend.

## Backend Explanation

### Subscription to Infura

The backend subscribes to the Infura WebSocket API to receive notifications about the latest mined blocks. When new transactions are available, it parses and relays the transaction data to connected frontend clients via WebSocket.

### Optimization

- **Connection Management**: The backend maintains a record of connected users. When all users disconnect, the subscription to Infura's "newHeads" is revoked. When a new user connects, the subscription is re-established. This helps reduce the number of calls to Infura and improves performance by avoiding unnecessary data fetching when there are no connected clients.

### Summary

- **Connection Management**: Dynamically subscribes and unsubscribes to Infura based on user connections.
- **Data Broadcasting**: Efficiently broadcasts block data to connected clients.

By following these steps and understanding the provided code snippets, you should be able to set up and run the Ethereum Real-Time Transaction Viewer on your local machine successfully. If you have any questions or need further assistance, please feel free to reach out.