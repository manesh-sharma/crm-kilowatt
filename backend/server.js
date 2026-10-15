
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);
app.use(express.json());

// --------------------------------------------------
// Configuration
// --------------------------------------------------

function getConfig() {
  const { WC_STORE_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } =
    process.env;

  if (!WC_STORE_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    const error = new Error(
      "WooCommerce is not configured. Create backend/.env using .env.example."
    );
    error.status = 503;
    throw error;
  }

  let storeUrl;

  try {
    storeUrl = new URL(WC_STORE_URL.trim());
  } catch {
    const error = new Error("WC_STORE_URL is not a valid URL.");
    error.status = 500;
    throw error;
  }

  if (!["http:", "https:"].includes(storeUrl.protocol)) {
    const error = new Error("WC_STORE_URL must use HTTP or HTTPS.");
    error.status = 500;
    throw error;
  }

  if (storeUrl.username || storeUrl.password) {
    const error = new Error(
      "Do not put credentials inside WC_STORE_URL."
    );
    error.status = 500;
    throw error;
  }

  return {
    storeUrl: storeUrl.href.replace(/\/+$/, ""),
    consumerKey: WC_CONSUMER_KEY.trim(),
    consumerSecret: WC_CONSUMER_SECRET.trim(),
    protocol: storeUrl.protocol,
  };
}

// RFC 3986 encoding, required for OAuth signature generation.
function encodeRFC3986(value) {
  return encodeURIComponent(String(value)).replace(
    /[!'()*]/g,
    (character) =>
      `%${character.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function createOAuthParameters(
  method,
  requestUrl,
  query,
  consumerKey,
  consumerSecret
) {
  const oauth = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA256",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_version: "1.0",
  };

  // Include all request query parameters and OAuth parameters
  // in the signature, excluding oauth_signature itself.
  const allParameters = [];

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        allParameters.push([key, String(item)]);
      }
    } else {
      allParameters.push([key, String(value)]);
    }
  }

  for (const [key, value] of Object.entries(oauth)) {
    allParameters.push([key, value]);
  }

  const normalizedParameters = allParameters
    .map(([key, value]) => [
      encodeRFC3986(key),
      encodeRFC3986(value),
    ])
    .sort(([keyA, valueA], [keyB, valueB]) => {
      if (keyA !== keyB) {
        return keyA < keyB ? -1 : 1;
      }

      if (valueA === valueB) return 0;
      return valueA < valueB ? -1 : 1;
    })
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const baseUrl = new URL(requestUrl);
  baseUrl.search = "";
  baseUrl.hash = "";

  const signatureBaseString = [
    method.toUpperCase(),
    encodeRFC3986(baseUrl.toString()),
    encodeRFC3986(normalizedParameters),
  ].join("&");

  const signingKey =
    `${encodeRFC3986(consumerSecret)}&`;

  oauth.oauth_signature = crypto
    .createHmac("sha256", signingKey)
    .update(signatureBaseString)
    .digest("base64");

  return oauth;
}

// --------------------------------------------------
// WooCommerce API client
// --------------------------------------------------

async function wooRequest(endpoint, query = {}) {
  const config = getConfig();

  const normalizedEndpoint = endpoint
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join("/");

  const requestUrl =
    `${config.storeUrl}/wp-json/wc/v3/${normalizedEndpoint}`;

  const url = new URL(requestUrl);

  // Use the same query parameters in the actual request
  // and in the OAuth signature.
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(key, String(item));
      }
    } else {
      url.searchParams.set(key, String(value));
    }
  }

  const headers = {
    Accept: "application/json",
  };

  if (config.protocol === "https:") {
    // Basic Auth for HTTPS.
    const credentials = Buffer.from(
      `${config.consumerKey}:${config.consumerSecret}`
    ).toString("base64");

    headers.Authorization = `Basic ${credentials}`;
  } else {
    // OAuth 1.0a for HTTP, including local WordPress Studio.
    const oauth = createOAuthParameters(
      "GET",
      requestUrl,
      Object.fromEntries(url.searchParams.entries()),
      config.consumerKey,
      config.consumerSecret
    );

    // Preserve repeated query parameters in the actual request.
    for (const [key, value] of Object.entries(oauth)) {
      url.searchParams.set(key, value);
    }
  }

  let response;

  try {
    response = await fetch(url.toString(), {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    const connectionError = new Error(
      error.name === "TimeoutError"
        ? "WooCommerce request timed out."
        : "Could not connect to WooCommerce. Check that WordPress is running and WC_STORE_URL is correct."
    );

    connectionError.status = 502;
    throw connectionError;
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const error = new Error(
      "WooCommerce returned a non-JSON response. Check the store URL and WordPress REST API."
    );
    error.status = 502;
    throw error;
  }

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.message || "WooCommerce API request failed."
    );

    error.status =
      response.status === 401 || response.status === 403
        ? response.status
        : 502;

    error.wooCode = data.code || null;
    throw error;
  }

  return {
    data,
    headers: response.headers,
  };
}

// --------------------------------------------------
// Error handling helpers
// --------------------------------------------------

function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function getPagination(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const perPage = Math.min(
    100,
    Math.max(1, Number.parseInt(query.per_page, 10) || 20)
  );

  return { page, per_page: perPage };
}

function getSearch(query) {
  return typeof query.search === "string"
    ? query.search.trim()
    : "";
}

// --------------------------------------------------
// Public backend status (does not expose credentials)
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    name: "WooCRM API",
    status: "running",
  });
});

app.get("/api/status", asyncRoute(async (req, res) => {
  // This endpoint reports configuration only.
  // Use /api/connection to test actual authentication.
  try {
    getConfig();

    res.json({
      configured: true,
      message: "WooCommerce environment variables are present.",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      configured: false,
      error: error.message,
    });
  }
}));

app.get("/api/connection", asyncRoute(async (req, res) => {
  const result = await wooRequest("products", { per_page: 1 });

  res.json({
    connected: true,
    message: "WooCommerce API connection successful.",
    productsAccessible: Array.isArray(result.data),
  });
}));

// --------------------------------------------------
// Products
// GET /api/products?page=1&per_page=20&search=shirt
// --------------------------------------------------

app.get("/api/products", asyncRoute(async (req, res) => {
  const { page, per_page } = getPagination(req.query);

  const result = await wooRequest("products", {
    page,
    per_page,
    search: getSearch(req.query),
    status: req.query.status,
    category: req.query.category,
    orderby: req.query.orderby || "date",
    order: req.query.order || "desc",
  });

  res.set("X-WooCommerce-Total", result.headers.get("x-wp-total") || "");
  res.set(
    "X-WooCommerce-TotalPages",
    result.headers.get("x-wp-totalpages") || ""
  );

  res.json(result.data);
}));

app.get("/api/products/:id", asyncRoute(async (req, res) => {
  const result = await wooRequest(
    `products/${encodeURIComponent(req.params.id)}`
  );

  res.json(result.data);
}));

// --------------------------------------------------
// Customers
// GET /api/customers?page=1&per_page=20&search=john
// --------------------------------------------------

app.get("/api/customers", asyncRoute(async (req, res) => {
  const { page, per_page } = getPagination(req.query);

  const result = await wooRequest("customers", {
    page,
    per_page,
    search: getSearch(req.query),
    orderby: req.query.orderby || "registered_date",
    order: req.query.order || "desc",
  });

  res.set("X-WooCommerce-Total", result.headers.get("x-wp-total") || "");
  res.set(
    "X-WooCommerce-TotalPages",
    result.headers.get("x-wp-totalpages") || ""
  );

  res.json(result.data);
}));

app.get("/api/customers/:id", asyncRoute(async (req, res) => {
  const result = await wooRequest(
    `customers/${encodeURIComponent(req.params.id)}`
  );

  res.json(result.data);
}));

// --------------------------------------------------
// Orders
// GET /api/orders?page=1&per_page=20&status=processing
// --------------------------------------------------

app.get("/api/orders", asyncRoute(async (req, res) => {
  const { page, per_page } = getPagination(req.query);

  const result = await wooRequest("orders", {
    page,
    per_page,
    search: getSearch(req.query),
    status: req.query.status,
    customer: req.query.customer,
    after: req.query.after,
    before: req.query.before,
    orderby: req.query.orderby || "date",
    order: req.query.order || "desc",
  });

  res.set("X-WooCommerce-Total", result.headers.get("x-wp-total") || "");
  res.set(
    "X-WooCommerce-TotalPages",
    result.headers.get("x-wp-totalpages") || ""
  );

  res.json(result.data);
}));

app.get("/api/orders/:id", asyncRoute(async (req, res) => {
  const result = await wooRequest(
    `orders/${encodeURIComponent(req.params.id)}`
  );

  res.json(result.data);
}));

// --------------------------------------------------
// Dashboard summary: real WooCommerce data only
// --------------------------------------------------

app.get("/api/dashboard", asyncRoute(async (req, res) => {
  const [productsResult, customersResult, ordersResult] =
    await Promise.all([
      wooRequest("products", { per_page: 1 }),
      wooRequest("customers", { per_page: 1 }),
      wooRequest("orders", {
        per_page: 100,
        orderby: "date",
        order: "desc",
      }),
    ]);

  const totalRevenue = ordersResult.data
    .filter((order) =>
      ["processing", "completed"].includes(order.status)
    )
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  res.json({
    totalProducts: Number(
      productsResult.headers.get("x-wp-total") || 0
    ),
    totalCustomers: Number(
      customersResult.headers.get("x-wp-total") || 0
    ),
    totalOrders: Number(
      ordersResult.headers.get("x-wp-total") || 0
    ),
    revenueCurrency: ordersResult.data[0]?.currency || null,
    revenueFromFetchedOrders: Number(totalRevenue.toFixed(2)),
    recentOrders: ordersResult.data.slice(0, 5),
    note:
      "Revenue is calculated from the latest fetched orders only, not the store's all-time revenue.",
  });
}));

// --------------------------------------------------
// Unknown API route
// --------------------------------------------------

app.use("/api", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found.",
  });
});

// --------------------------------------------------
// Central error handler
// --------------------------------------------------

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error("API error:", err.message);

  if (err.wooCode) {
    console.error("WooCommerce error code:", err.wooCode);
  }

  const status = err.status || 500;

  res.status(status).json({
    error:
      status === 401 || status === 403
        ? "WooCommerce authentication or permission failed."
        : err.message || "Internal server error.",
    ...(err.wooCode ? { code: err.wooCode } : {}),
    ...(status === 503 ? { setup: true } : {}),
  });
});

// --------------------------------------------------
// Start server
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(`WooCRM API running at http://localhost:${PORT}`);
});
