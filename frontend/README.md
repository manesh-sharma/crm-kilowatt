# WooCRM

WooCRM is a lightweight CRM dashboard for a WooCommerce store. It uses a
React + Vite frontend and a Node.js + Express backend to display store
products, orders, customers, and dashboard summaries using the
WooCommerce REST API.

> **Important:** WooCRM uses live data from your WooCommerce store. It
> does not fall back to mock data when the API is unavailable.

## Features

-   Dashboard overview with store metrics and recent activity
-   Products page with product details, search, and stock filters
-   Orders page with order details, search, and status filters
-   Customers page with customer details and search
-   Backend connection and API error handling

Some dashboard summaries are based on the latest fetched orders rather
than the store's complete historical data. Treat those figures
accordingly.

## Tech stack

-   **Frontend:** React, Vite, Lucide React
-   **Backend:** Node.js, Express, CORS, dotenv
-   **Store integration:** WooCommerce REST API

## Prerequisites

Install these before starting:

-   [Node.js](https://nodejs.org/) (includes npm)
-   A WooCommerce store with the WooCommerce REST API enabled
-   WooCommerce REST API credentials with permission to read store data

For local development, this project has been configured to use a local
WooCommerce site at `http://localhost:8881`. If your store uses a
different URL, use that URL in the backend environment file.

## Project structure

``` text
WooCRM/
├── frontend/   # React + Vite app
└── backend/    # Express API server
```

## 1. Get the project

Clone the repository, or open the project folder you already have:

``` bash
git clone <YOUR_REPOSITORY_URL>
cd WooCRM
```

Replace `<YOUR_REPOSITORY_URL>` with the repository URL. If you already
have the source code, just open a terminal in the `WooCRM` folder.

## 2. Configure the backend

Open a terminal:

``` bash
cd backend
npm install
```

Create a file named `.env` inside the `backend/` directory:

``` env
WC_STORE_URL=http://localhost:8881
WC_CONSUMER_KEY=your_consumer_key_here
WC_CONSUMER_SECRET=your_consumer_secret_here
FRONTEND_URL=http://localhost:5173
PORT=5000
```

Replace the consumer key and secret with your own WooCommerce REST API
credentials. Do not share these values or commit the `.env` file to Git.

### Create WooCommerce API credentials

In your WordPress/WooCommerce admin:

1.  Open **WooCommerce → Settings → Advanced → REST API**.
2.  Add a key with a description such as `WooCRM local development`.
3.  Select a user that is allowed to access the required store data.
4.  Set permissions to **Read** for this read-only integration.
5.  Generate the key and copy the consumer key and consumer secret into
    `backend/.env`.

The exact menu labels may vary slightly by WooCommerce version.

## 3. Start the backend

From the `backend/` directory, run:

``` bash
npm run dev
```

If the project does not define a `dev` script, check
`backend/package.json`. The intended development command is typically
configured with Nodemon; otherwise use the script defined in that file.

The API is expected to run at:

``` text
http://localhost:5000
```

Useful endpoints for checking the backend:

-   `GET /` --- basic server health
-   `GET /api/status` --- environment/configuration status
-   `GET /api/connection` --- tests the WooCommerce API connection
-   `GET /api/products` --- products
-   `GET /api/customers` --- registered customers
-   `GET /api/orders` --- orders
-   `GET /api/dashboard` --- dashboard summary

For example, open `http://localhost:5000/api/connection` in your
browser. A successful response should indicate that the WooCommerce API
connection works and products are accessible.

## 4. Start the frontend

Open a **second terminal** from the project root:

``` bash
cd frontend
npm install
npm run dev
```

Vite normally displays a local development URL such as:

``` text
http://localhost:5173
```

Open the URL printed by Vite in your browser.

## 5. Verify the integration

1.  Confirm the backend is running.
2.  Confirm the frontend is running.
3.  Open WooCRM in the browser.
4.  Visit **Products**, **Orders**, and **Customers**.
5.  Confirm the pages load and show data from your WooCommerce store.

If your store has no orders or registered customers yet, those pages may
show an empty state. This is normal and does not necessarily indicate a
connection problem.

## Troubleshooting

### WooCommerce connection fails or returns a 401 error

-   Confirm `WC_STORE_URL` is correct and reachable from the backend.
-   Check that the consumer key and secret are copied correctly.
-   Confirm the API key has read permission and belongs to a user with
    appropriate store access.
-   Restart the backend after editing `.env`.
-   Open `http://localhost:5000/api/connection` to see whether the
    connection test succeeds.

### The frontend cannot reach the backend

-   Confirm the backend is running on port `5000`.
-   Confirm the frontend is running on port `5173`.
-   Check the browser developer console and backend terminal for errors.
-   Confirm `FRONTEND_URL` matches the frontend origin.

### Product, order, or customer lists are empty

-   Check that the store actually contains records of that type.
-   Remember that the WooCommerce customers endpoint lists registered
    customers; it does not necessarily include every guest who has
    placed an order.
-   Check `/api/connection` before investigating the page UI.

### Port is already in use

Stop the other process using the port, or adjust the port configuration
consistently. If you change the frontend URL, update `FRONTEND_URL` in
`backend/.env` too.

## Security notes

-   Never commit `backend/.env`.
-   Never expose WooCommerce consumer credentials in frontend code.
-   Use read-only API credentials when the application only needs to
    display store data.
-   Do not use real production credentials in a public repository or
    screenshot.

## Current scope

WooCRM is under active development. Some navigation sections may still
be placeholders or may not yet be fully connected to live data. Confirm
the functionality of each section before relying on it in production.
