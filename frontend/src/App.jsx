
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  CheckSquare,
  BarChart3,
  Settings,
  Search,
  Bell,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  Menu,
  X,
  CircleHelp,
  Download,
} from "lucide-react";
import "./App.css";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Customers", icon: Users },
  { label: "Orders", icon: ShoppingCart },
  { label: "Products", icon: Package },
  { label: "Tasks", icon: CheckSquare },
  { label: "Analytics", icon: BarChart3 },
];

const orders = [
  { id: "#WC-1048", customer: "Olivia Martin", initials: "OM", color: "purple", product: "Wireless Headphones", date: "Oct 15, 2026", amount: "$129.00", status: "Completed" },
  { id: "#WC-1047", customer: "Jackson Lee", initials: "JL", color: "blue", product: "Smart Watch Pro", date: "Oct 15, 2026", amount: "$249.00", status: "Processing" },
  { id: "#WC-1046", customer: "Isabella Chen", initials: "IC", color: "orange", product: "Portable Speaker", date: "Oct 14, 2026", amount: "$79.00", status: "Pending" },
  { id: "#WC-1045", customer: "William Kim", initials: "WK", color: "green", product: "USB-C Hub", date: "Oct 14, 2026", amount: "$59.00", status: "Completed" },
  { id: "#WC-1044", customer: "Sophia Patel", initials: "SP", color: "pink", product: "Mechanical Keyboard", date: "Oct 13, 2026", amount: "$149.00", status: "Cancelled" },
];

const customers = [
  { name: "Olivia Martin", email: "olivia@example.com", initials: "OM", color: "purple", spent: "$1,249.00", orders: 12 },
  { name: "Jackson Lee", email: "jackson@example.com", initials: "JL", color: "blue", spent: "$890.00", orders: 8 },
  { name: "Isabella Chen", email: "isabella@example.com", initials: "IC", color: "orange", spent: "$675.00", orders: 6 },
  { name: "William Kim", email: "william@example.com", initials: "WK", color: "green", spent: "$520.00", orders: 5 },
];

const metrics = [
  { label: "Total Revenue", value: "$24,850", change: "12.8%", positive: true, icon: BarChart3, iconClass: "violet", note: "vs. last month" },
  { label: "Total Orders", value: "1,248", change: "8.2%", positive: true, icon: ShoppingCart, iconClass: "blue", note: "vs. last month" },
  { label: "Total Customers", value: "864", change: "5.4%", positive: true, icon: Users, iconClass: "green", note: "vs. last month" },
  { label: "Pending Orders", value: "24", change: "2.1%", positive: false, icon: Package, iconClass: "orange", note: "vs. last month" },
];


const revenue = [35, 48, 40, 58, 45, 68, 54, 74, 60, 82, 69, 92];

function Avatar({ initials, color = "blue" }) {
  return <div className={`avatar avatar-${color}`}>{initials}</div>;
}

function Status({ status }) {
  const statusClass = status.toLowerCase().replace(/\s+/g, "-");
  return <span className={`status status-${statusClass}`}>{status}</span>;
}

function Sidebar({ active, setActive, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && <button className="mobile-overlay" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><ShoppingCart size={21} strokeWidth={2.5} /></div>
          <span>Woo<span className="brand-accent">CRM</span></span>
          <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>

        <div className="workspace">
          <div className="workspace-logo">S</div>
          <div className="workspace-copy">
            <strong>Store Workspace</strong>
            <span>Free plan</span>
          </div>
          <ChevronDown size={16} className="workspace-chevron" />
        </div>

        <div className="nav-caption">WORKSPACE</div>
        <nav className="nav-list">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${active === label ? "nav-item-active" : ""}`}
              onClick={() => { setActive(label); setMobileOpen(false); }}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
              {label === "Orders" && <span className="nav-count">12</span>}
            </button>
          ))}
        </nav>

        <div className="nav-caption nav-caption-bottom">PREFERENCES</div>
        <nav className="nav-list">
          <button className={`nav-item ${active === "Settings" ? "nav-item-active" : ""}`} onClick={() => { setActive("Settings"); setMobileOpen(false); }}>
            <Settings size={19} strokeWidth={1.8} /><span>Settings</span>
          </button>
          <button className={`nav-item ${active === "Help & Support" ? "nav-item-active" : ""}`} onClick={() => { setActive("Help & Support"); setMobileOpen(false); }}>
            <CircleHelp size={19} strokeWidth={1.8} /><span>Help & Support</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><BarChart3 size={18} /></div>
            <strong>Grow your business</strong>
            <p>Get more insights into your store performance.</p>
            <button onClick={() => setActive("Analytics")}>Explore analytics <ArrowUpRight size={14} /></button>
          </div>
          <div className="profile">
            <Avatar initials="MS" color="violet" />
            <div className="profile-copy"><strong>Store Admin</strong><span>Administrator</span></div>
            <MoreHorizontal size={19} className="profile-more" />
          </div>
        </div>
      </aside>
    </>
  );
}

function MetricCard({ metric }) {
  const Icon = metric.icon;
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span className="metric-label">{metric.label}</span>
        <div className={`metric-icon metric-icon-${metric.iconClass}`}><Icon size={19} /></div>
      </div>
      <div className="metric-value">{metric.value}</div>
      <div className="metric-foot">
        {metric.change ? (
          <span className={`metric-change ${metric.positive ? "change-up" : "change-down"}`}>
            {metric.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {metric.change}
          </span>
        ) : null}
        <span className="metric-note">{metric.note}</span>
      </div>
    </article>
  );
}

function moneyValue(value, currency = "") {
  const amount = Number(value || 0);
  const formatted = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return currency ? `${currency} ${formatted}` : formatted;
}

function initialsFor(name = "Customer") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "CU";
}

function RevenueChart({ orders, currency }) {
  const now = new Date();
  const monthStarts = Array.from({ length: 12 }, (_, index) => new Date(now.getFullYear(), now.getMonth() - 11 + index, 1));
  const monthlyTotals = monthStarts.map((month) => {
    return orders.reduce((total, order) => {
      const date = new Date(order.date_created || order.date_created_gmt || "");
      if (Number.isNaN(date.getTime())) return total;
      return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth()
        ? total + Number(order.total || 0)
        : total;
    }, 0);
  });
  const maxValue = Math.max(...monthlyTotals, 1);
  const points = monthlyTotals.map((value, index) => `${index * (600 / (monthlyTotals.length - 1))},${190 - (value / maxValue) * 160}`);
  const path = points.join(" L ");
  const months = monthStarts.map((date) => date.toLocaleDateString(undefined, { month: "short" }));

  return (
    <div className="chart-wrap">
      <div className="chart-y-labels">
        <span>{moneyValue(maxValue, currency)}</span><span>{moneyValue(maxValue * 0.75, currency)}</span><span>{moneyValue(maxValue * 0.5, currency)}</span><span>{moneyValue(maxValue * 0.25, currency)}</span><span>{moneyValue(0, currency)}</span>
      </div>
      <div className="chart-main">
        <div className="chart-grid">{Array.from({ length: 5 }).map((_, i) => <div key={i} />)}</div>
        {orders.length > 0 ? (
          <svg className="revenue-svg" viewBox="0 0 600 200" preserveAspectRatio="none" role="img" aria-label="Revenue from fetched WooCommerce orders by month">
            <defs><linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#6558E8" stopOpacity=".20" /><stop offset="100%" stopColor="#6558E8" stopOpacity="0" /></linearGradient></defs>
            <path d={`M ${path} L 600,200 L 0,200 Z`} fill="url(#revenueFill)" />
            <polyline points={points.join(" ")} fill="none" stroke="#6558E8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            {monthlyTotals.map((value, index) => <circle key={index} cx={index * (600 / (monthlyTotals.length - 1))} cy={190 - (value / maxValue) * 160} r="3.5" fill="#FFFFFF" stroke="#6558E8" strokeWidth="2" vectorEffect="non-scaling-stroke" />)}
          </svg>
        ) : <div className="empty-state">Revenue chart will appear when orders are available.</div>}
        <div className="chart-x-labels">{months.map((month, index) => <span key={`${month}-${index}`}>{month}</span>)}</div>
      </div>
    </div>
  );
}

function Dashboard({ setActive }) {
  const [search, setSearch] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardOrders, setDashboardOrders] = useState([]);
  const [dashboardCustomers, setDashboardCustomers] = useState([]);
  const [dashboardProducts, setDashboardProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadDashboard() {
      setLoading(true);
      setError("");
      try {
        const endpoints = [
          "http://localhost:5000/api/dashboard",
          "http://localhost:5000/api/orders?per_page=100",
          "http://localhost:5000/api/customers?per_page=100",
          "http://localhost:5000/api/products?per_page=100",
        ];
        const responses = await Promise.all(endpoints.map((url) => fetch(url, { signal: controller.signal })));
        const payloads = await Promise.all(responses.map((response) => response.json().catch(() => null)));
        const failed = responses.findIndex((response) => !response.ok);
        if (failed !== -1) throw new Error(payloads[failed]?.message || payloads[failed]?.error || `Dashboard request failed (${responses[failed].status})`);
        if (!payloads[0] || !Array.isArray(payloads[1]) || !Array.isArray(payloads[2]) || !Array.isArray(payloads[3])) {
          throw new Error("The backend returned an unexpected dashboard response.");
        }
        setDashboardData(payloads[0]);
        setDashboardOrders(payloads[1]);
        setDashboardCustomers(payloads[2]);
        setDashboardProducts(payloads[3]);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Could not load dashboard data.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadDashboard();
    return () => controller.abort();
  }, [retry]);

  const currency = dashboardData?.revenueCurrency || dashboardOrders[0]?.currency || "";
  const totalRevenue = dashboardData?.revenueFromFetchedOrders ?? 0;
  const pendingOrders = dashboardOrders.filter((order) => ["pending", "processing", "on-hold"].includes(order.status)).length;
  const lowStockProducts = dashboardProducts.filter((product) => {
    const quantity = Number(product.stock_quantity);
    return product.manage_stock && product.stock_quantity !== null && product.stock_quantity !== undefined && quantity > 0 && quantity <= 5;
  }).length;
  const recentOrders = dashboardOrders.slice().sort((a, b) => new Date(b.date_created || 0) - new Date(a.date_created || 0)).slice(0, 5);
  const topCustomers = dashboardCustomers.slice().sort((a, b) => Number(b.total_spent || 0) - Number(a.total_spent || 0)).slice(0, 5);
  const filteredOrders = recentOrders.filter((order) => {
    const customer = [order.billing?.first_name, order.billing?.last_name].filter(Boolean).join(" ") || "Guest customer";
    const productNames = (order.line_items || []).map((item) => item.name).join(" ");
    return `${order.number || order.id} ${customer} ${productNames} ${order.status}`.toLowerCase().includes(search.toLowerCase());
  });

  const metrics = [
    { label: "Revenue (fetched orders)", value: moneyValue(totalRevenue, currency), icon: BarChart3, iconClass: "violet", note: "Latest fetched orders" },
    { label: "Total Orders", value: dashboardData?.totalOrders ?? "—", icon: ShoppingCart, iconClass: "blue", note: "Store total" },
    { label: "Total Customers", value: dashboardData?.totalCustomers ?? "—", icon: Users, iconClass: "green", note: "Registered customers" },
    { label: "Open Orders", value: pendingOrders, icon: Package, iconClass: "orange", note: "Among latest 100 fetched" },
  ];

  return (
    <>
      <header className="topbar">
        <div className="topbar-left"><div className="breadcrumb">Workspace <span>/</span> <strong>Dashboard</strong></div></div>
        <div className="topbar-actions">
          <label className="global-search"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search recent orders..." /><kbd>⌘ K</kbd></label>
          <button className="icon-button notification-button" aria-label="Notifications"><Bell size={19} /><i /></button>
          <div className="topbar-divider" /><Avatar initials="MS" color="violet" />
          <button className="topbar-user" onClick={() => setActive("Settings")}><span>Store Admin</span><ChevronDown size={15} /></button>
        </div>
      </header>

      <main className="main-content">
        <section className="page-heading">
          <div><div className="eyebrow"><span className="live-dot" /> STORE OVERVIEW</div><h1>Good evening, Admin <span className="wave">✦</span></h1><p>Live information from your WooCommerce store.</p></div>
          <div className="heading-actions">
            <button className="button button-secondary" onClick={() => setRetry((count) => count + 1)} disabled={loading}>{loading ? "Refreshing..." : "Refresh data"}</button>
            <button className="button button-primary" onClick={() => setActive("Orders")}><Plus size={17} /> View orders</button>
          </div>
        </section>

        {error && <div className="products-error" role="alert"><strong>Could not load dashboard data.</strong><p>{error}</p><button className="button button-secondary" onClick={() => setRetry((count) => count + 1)}>Try again</button></div>}

        <section className="metric-grid">
          {metrics.map((metric) => <MetricCard key={metric.label} metric={{ ...metric, change: "", positive: true }} />)}
        </section>
        {loading && <div className="panel placeholder-panel"><p>Loading live WooCommerce data...</p></div>}

        {!error && (
          <>
            <section className="middle-grid">
              <article className="panel revenue-panel">
                <div className="panel-header"><div><h2>Revenue overview</h2><p>Based on the latest fetched orders, grouped by month</p></div></div>
                <div className="revenue-total"><strong>{moneyValue(totalRevenue, currency)}</strong></div>
                <div className="revenue-subtitle">Revenue from fetched orders <span>not all-time revenue</span></div>
                <RevenueChart orders={dashboardOrders} currency={currency} />
              </article>
              <article className="panel activity-panel">
                <div className="panel-header"><div><h2>Quick overview</h2><p>Current store catalogue and activity</p></div></div>
                <div className="overview-stat"><div className="overview-symbol symbol-purple"><ShoppingCart size={18} /></div><div className="overview-copy"><span>Orders in fetched list</span><strong>{dashboardOrders.length}</strong></div></div>
                <div className="overview-stat"><div className="overview-symbol symbol-green"><Users size={18} /></div><div className="overview-copy"><span>Customers fetched</span><strong>{dashboardCustomers.length}</strong></div></div>
                <div className="overview-stat"><div className="overview-symbol symbol-orange"><Package size={18} /></div><div className="overview-copy"><span>Low-stock products</span><strong>{lowStockProducts}</strong></div><span className="overview-warning">Quantity 1–5</span></div>
                <div className="goal-box"><div className="goal-head"><span>Data connection</span><strong>{loading ? "Loading" : error ? "Error" : "Connected"}</strong></div><p>Data is fetched directly from your WooCommerce backend.</p></div>
              </article>
            </section>

            <section className="bottom-grid">
              <article className="panel orders-panel">
                <div className="panel-header"><div><h2>Recent orders</h2><p>Latest orders returned by WooCommerce</p></div><button className="text-button" onClick={() => setActive("Orders")}>View all <ArrowUpRight size={15} /></button></div>
                <div className="table-scroll"><table className="data-table"><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>PRODUCT</th><th>DATE</th><th>AMOUNT</th><th>STATUS</th></tr></thead><tbody>
                  {filteredOrders.map((order) => {
                    const customer = [order.billing?.first_name, order.billing?.last_name].filter(Boolean).join(" ") || "Guest customer";
                    const product = (order.line_items || []).map((item) => item.name).join(", ") || "—";
                    const date = order.date_created ? new Date(order.date_created).toLocaleDateString() : "—";
                    return <tr key={order.id}><td className="order-id">#{order.number || order.id}</td><td><div className="customer-cell"><Avatar initials={initialsFor(customer)} color="blue" /><span>{customer}</span></div></td><td className="product-cell">{product}</td><td className="date-cell">{date}</td><td className="amount-cell">{moneyValue(order.total, order.currency || currency)}</td><td><Status status={(order.status || "unknown").replace(/-/g, " ").replace(/^\w/, (letter) => letter.toUpperCase())} /></td></tr>;
                  })}
                  {!loading && filteredOrders.length === 0 && <tr><td colSpan="6" className="empty-state">{dashboardOrders.length === 0 ? "No orders found in your WooCommerce store yet." : "No recent orders match your search."}</td></tr>}
                </tbody></table></div>
              </article>
              <article className="panel customers-panel">
                <div className="panel-header"><div><h2>Top customers</h2><p>Sorted by total spent</p></div><button className="text-button" onClick={() => setActive("Customers")}>View all <ArrowUpRight size={15} /></button></div>
                <div className="top-customer-list">
                  {topCustomers.map((customer) => {
                    const name = [customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.username || "Customer";
                    return <div className="top-customer" key={customer.id}><Avatar initials={initialsFor(name)} color="blue" /><div className="top-customer-copy"><strong>{name}</strong><span>{customer.orders_count || 0} orders</span></div><strong className="customer-spent">{moneyValue(customer.total_spent, currency)}</strong></div>;
                  })}
                  {!loading && topCustomers.length === 0 && <div className="empty-state">No registered customers found yet.</div>}
                </div>
              </article>
            </section>
          </>
        )}
        <footer className="page-footer"><span>© 2026 WooCRM</span><span>Live WooCommerce data · Some metrics use the latest 100 fetched records</span><span>Built for better store management</span></footer>
      </main>
    </>
  );
}

function SimplePage({ active }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ordersStatusFilter, setOrdersStatusFilter] = useState("All");

  // Products are loaded from the Express API only when the Products page is open.
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [productsRetry, setProductsRetry] = useState(0);

  // Orders are loaded from WooCommerce only when the Orders page is open.
  const [wooOrders, setWooOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [ordersRetry, setOrdersRetry] = useState(0);

  // Customers are loaded from WooCommerce only when the Customers page is open.
  const [wooCustomers, setWooCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState("");
  const [customersRetry, setCustomersRetry] = useState(0);

  useEffect(() => {
    if (active !== "Customers") return;

    const controller = new AbortController();

    async function loadCustomers() {
      setCustomersLoading(true);
      setCustomersError("");

      try {
        const response = await fetch("http://localhost:5000/api/customers?per_page=100", {
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || data?.error || `Request failed (${response.status})`);
        }
        if (!Array.isArray(data)) {
          throw new Error("The backend returned an unexpected customers response.");
        }

        setWooCustomers(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setCustomersError(error.message || "Could not load customers.");
        }
      } finally {
        if (!controller.signal.aborted) setCustomersLoading(false);
      }
    }

    loadCustomers();
    return () => controller.abort();
  }, [active, customersRetry]);

  useEffect(() => {
    if (active !== "Products") return;

    const controller = new AbortController();

    async function loadProducts() {
      setProductsLoading(true);
      setProductsError("");

      try {
        const response = await fetch("http://localhost:5000/api/products?per_page=100", {
          signal: controller.signal,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || data?.error || `Request failed (${response.status})`);
        }

        if (!Array.isArray(data)) {
          throw new Error("The backend returned an unexpected product response.");
        }

        setProducts(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setProductsError(error.message || "Could not load products.");
        }
      } finally {
        if (!controller.signal.aborted) setProductsLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, [active, productsRetry]);

  useEffect(() => {
    if (active !== "Orders") return;

    const controller = new AbortController();

    async function loadOrders() {
      setOrdersLoading(true);
      setOrdersError("");

      try {
        const response = await fetch("http://localhost:5000/api/orders?per_page=100", {
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || data?.error || `Request failed (${response.status})`);
        }
        if (!Array.isArray(data)) {
          throw new Error("The backend returned an unexpected orders response.");
        }

        setWooOrders(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setOrdersError(error.message || "Could not load orders.");
        }
      } finally {
        if (!controller.signal.aborted) setOrdersLoading(false);
      }
    }

    loadOrders();
    return () => controller.abort();
  }, [active, ordersRetry]);

  const filteredProducts = products.filter((product) => {
    const categoryNames = (product.categories || []).map((category) => category.name).join(" ");
    const matchesSearch = `${product.name || ""} ${product.sku || ""} ${categoryNames}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const quantity = Number(product.stock_quantity);
    const isOutOfStock = product.stock_status === "outofstock";
    const isLowStock =
      !isOutOfStock &&
      product.manage_stock &&
      product.stock_quantity !== null &&
      product.stock_quantity !== undefined &&
      quantity > 0 &&
      quantity <= 5;

    const matchesStock =
      statusFilter === "All" ||
      (statusFilter === "In stock" && !isOutOfStock && !isLowStock) ||
      (statusFilter === "Low stock" && isLowStock) ||
      (statusFilter === "Out of stock" && isOutOfStock);

    return matchesSearch && matchesStock;
  });

  const descriptions = {
    Customers: "Understand your shoppers and build stronger customer relationships.",
    Orders: "Review transactions and track order progress.",
    Products: "Keep your product catalogue organized.",
    Tasks: "Manage follow-ups and keep your team on track.",
    Analytics: "Explore trends and understand your store performance.",
    Settings: "Configure your CRM workspace.",
    "Help & Support": "Find help with your WooCRM workspace.",
  };

  const filteredWooCustomers = wooCustomers.filter((customer) => {
    const name = [customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.username || "Customer";
    const searchable = `${name} ${customer.email || ""} ${customer.username || ""} ${customer.id || ""}`;
    return searchable.toLowerCase().includes(search.toLowerCase());
  });

  const filteredWooOrders = wooOrders.filter((order) => {
    const customerName = [order.billing?.first_name, order.billing?.last_name]
      .filter(Boolean)
      .join(" ") || "Guest customer";
    const productNames = (order.line_items || []).map((item) => item.name).join(" ");
    const searchable = `${order.number || order.id} ${customerName} ${order.billing?.email || ""} ${productNames}`;
    const matchesSearch = searchable.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = ordersStatusFilter === "All" || order.status === ordersStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <header className="topbar">
        <div className="breadcrumb">
          Workspace <span>/</span> <strong>{active}</strong>
        </div>
        <div className="topbar-actions">
          <div className="topbar-divider" />
          <Avatar initials="MS" color="violet" />
          <span className="topbar-user-static">Store Admin</span>
        </div>
      </header>

      <main className="main-content simple-page">
        <section className="page-heading">
          <div>
            <div className="eyebrow">WORKSPACE</div>
            <h1>{active}</h1>
            <p>{descriptions[active] || "Manage your store workspace."}</p>
          </div>
        </section>

        {active === "Customers" && (
          <section className="panel functional-panel">
            <div className="functional-toolbar">
              <div>
                <h2>All customers</h2>
                <p>
                  {customersLoading
                    ? "Loading customers from WooCommerce..."
                    : `${filteredWooCustomers.length} customers found`}
                </p>
              </div>

              <div className="order-controls">
                <label className="page-search">
                  <Search size={17} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, email or username..."
                  />
                  {search && (
                    <button onClick={() => setSearch("")} aria-label="Clear search">
                      <X size={15} />
                    </button>
                  )}
                </label>

                <button
                  className="button button-secondary"
                  onClick={() => setCustomersRetry((count) => count + 1)}
                  disabled={customersLoading}
                >
                  {customersLoading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            {customersError && (
              <div className="products-error" role="alert">
                <strong>Could not load WooCommerce customers.</strong>
                <p>{customersError}</p>
                <p>Check that the backend is running at localhost:5000 and its WooCommerce connection is configured.</p>
                <button
                  className="button button-secondary"
                  onClick={() => setCustomersRetry((count) => count + 1)}
                >
                  Try again
                </button>
              </div>
            )}

            {!customersError && (
              <div className="table-scroll">
                <table className="data-table functional-table">
                  <thead>
                    <tr>
                      <th>CUSTOMER</th>
                      <th>EMAIL</th>
                      <th>USERNAME</th>
                      <th>TOTAL ORDERS</th>
                      <th>TOTAL SPENT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customersLoading && wooCustomers.length === 0 && (
                      <tr><td colSpan="5" className="empty-state">Loading customers...</td></tr>
                    )}

                    {!customersLoading && filteredWooCustomers.map((customer) => {
                      const name = [customer.first_name, customer.last_name]
                        .filter(Boolean)
                        .join(" ") || customer.username || "Customer";
                      const initials = name === "Customer"
                        ? "CU"
                        : name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
                      const totalOrders = Number(customer.orders_count || 0);
                      const totalSpent = customer.total_spent !== undefined && customer.total_spent !== null
                        ? Number(customer.total_spent).toFixed(2)
                        : "—";

                      return (
                        <tr key={customer.id}>
                          <td>
                            <div className="customer-cell">
                              <Avatar initials={initials} color="blue" />
                              <span>{name}</span>
                            </div>
                          </td>
                          <td>{customer.email || "—"}</td>
                          <td>{customer.username || "—"}</td>
                          <td>{totalOrders}</td>
                          <td className="amount-cell">{totalSpent}</td>
                        </tr>
                      );
                    })}

                    {!customersLoading && !customersError && filteredWooCustomers.length === 0 && (
                      <tr>
                        <td colSpan="5" className="empty-state">
                          {wooCustomers.length === 0
                            ? "No registered customers found in your WooCommerce store yet."
                            : "No customers match your search."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {active === "Orders" && (
          <section className="panel functional-panel">
            <div className="functional-toolbar">
              <div>
                <h2>All orders</h2>
                <p>
                  {ordersLoading
                    ? "Loading orders from WooCommerce..."
                    : `${filteredWooOrders.length} orders found`}
                </p>
              </div>

              <div className="order-controls">
                <label className="page-search">
                  <Search size={17} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search orders or customers..."
                  />
                  {search && (
                    <button onClick={() => setSearch("")} aria-label="Clear search">
                      <X size={15} />
                    </button>
                  )}
                </label>

                <select
                  className="period-select"
                  value={ordersStatusFilter}
                  onChange={(e) => setOrdersStatusFilter(e.target.value)}
                  aria-label="Filter orders by status"
                >
                  <option value="All">All statuses</option>
                  <option value="pending">Pending payment</option>
                  <option value="processing">Processing</option>
                  <option value="on-hold">On hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                  <option value="failed">Failed</option>
                </select>

                <button
                  className="button button-secondary"
                  onClick={() => setOrdersRetry((count) => count + 1)}
                  disabled={ordersLoading}
                >
                  {ordersLoading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            {ordersError && (
              <div className="products-error" role="alert">
                <strong>Could not load WooCommerce orders.</strong>
                <p>{ordersError}</p>
                <p>Check that the backend is running at localhost:5000 and its WooCommerce connection is configured.</p>
                <button
                  className="button button-secondary"
                  onClick={() => setOrdersRetry((count) => count + 1)}
                >
                  Try again
                </button>
              </div>
            )}

            {!ordersError && (
              <div className="table-scroll">
                <table className="data-table functional-table">
                  <thead>
                    <tr>
                      <th>ORDER</th>
                      <th>CUSTOMER</th>
                      <th>ITEMS</th>
                      <th>DATE</th>
                      <th>TOTAL</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersLoading && wooOrders.length === 0 && (
                      <tr><td colSpan="6" className="empty-state">Loading orders...</td></tr>
                    )}

                    {!ordersLoading && filteredWooOrders.map((order) => {
                      const customerName = [order.billing?.first_name, order.billing?.last_name]
                        .filter(Boolean)
                        .join(" ") || "Guest customer";
                      const initials = customerName === "Guest customer"
                        ? "GC"
                        : customerName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
                      const itemNames = (order.line_items || []).map((item) => item.name).filter(Boolean);
                      const itemSummary = itemNames.length
                        ? itemNames.slice(0, 2).join(", ") + (itemNames.length > 2 ? ` +${itemNames.length - 2} more` : "")
                        : "No line items";
                      const date = order.date_created
                        ? new Date(order.date_created).toLocaleDateString(undefined, {
                            year: "numeric", month: "short", day: "numeric",
                          })
                        : "—";
                      const statusLabels = {
                        pending: "Pending payment",
                        processing: "Processing",
                        "on-hold": "On hold",
                        completed: "Completed",
                        cancelled: "Cancelled",
                        refunded: "Refunded",
                        failed: "Failed",
                        "checkout-draft": "Draft",
                      };
                      const statusLabel = statusLabels[order.status] || (order.status || "Unknown").replace(/-/g, " ");
                      const total = order.total !== undefined && order.total !== null
                        ? `${order.currency || ""} ${order.total}`.trim()
                        : "—";

                      return (
                        <tr key={order.id}>
                          <td className="order-id">#{order.number || order.id}</td>
                          <td>
                            <div className="customer-cell">
                              <Avatar initials={initials} color="blue" />
                              <span>{customerName}</span>
                            </div>
                          </td>
                          <td className="product-cell">{itemSummary}</td>
                          <td className="date-cell">{date}</td>
                          <td className="amount-cell">{total}</td>
                          <td><Status status={statusLabel} /></td>
                        </tr>
                      );
                    })}

                    {!ordersLoading && !ordersError && filteredWooOrders.length === 0 && (
                      <tr>
                        <td colSpan="6" className="empty-state">
                          {wooOrders.length === 0
                            ? "No orders found in your WooCommerce store yet."
                            : "No orders match your search or selected status."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {active === "Products" && (
          <section className="panel functional-panel">
            <div className="functional-toolbar">
              <div>
                <h2>All products</h2>
                <p>
                  {productsLoading
                    ? "Loading products from WooCommerce..."
                    : `${filteredProducts.length} products found`}
                </p>
              </div>

              <div className="order-controls">
                <label className="page-search">
                  <Search size={17} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products or SKU..."
                  />
                  {search && (
                    <button onClick={() => setSearch("")} aria-label="Clear search">
                      <X size={15} />
                    </button>
                  )}
                </label>

                <select
                  className="period-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter products by stock"
                >
                  <option>All</option>
                  <option>In stock</option>
                  <option>Low stock</option>
                  <option>Out of stock</option>
                </select>

                <button
                  className="button button-secondary"
                  onClick={() => setProductsRetry((count) => count + 1)}
                  disabled={productsLoading}
                >
                  {productsLoading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            {productsError && (
              <div className="products-error" role="alert">
                <strong>Could not load WooCommerce products.</strong>
                <p>{productsError}</p>
                <p>Check that the backend is running at localhost:5000 and its WooCommerce connection is configured.</p>
                <button
                  className="button button-secondary"
                  onClick={() => setProductsRetry((count) => count + 1)}
                >
                  Try again
                </button>
              </div>
            )}

            {!productsError && (
              <div className="table-scroll">
                <table className="data-table functional-table">
                  <thead>
                    <tr>
                      <th>PRODUCT</th>
                      <th>SKU</th>
                      <th>CATEGORY</th>
                      <th>PRICE</th>
                      <th>STOCK</th>
                      <th>AVAILABILITY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsLoading && products.length === 0 && (
                      <tr>
                        <td colSpan="6" className="empty-state">Loading products...</td>
                      </tr>
                    )}

                    {!productsLoading && filteredProducts.map((product) => {
                      const categories = (product.categories || [])
                        .map((category) => category.name)
                        .join(", ") || "Uncategorized";
                      const isOutOfStock = product.stock_status === "outofstock";
                      const quantityTracked =
                        product.manage_stock &&
                        product.stock_quantity !== null &&
                        product.stock_quantity !== undefined;
                      const quantity = Number(product.stock_quantity);
                      const isLowStock =
                        !isOutOfStock && quantityTracked && quantity > 0 && quantity <= 5;
                      const availability = isOutOfStock
                        ? "Out of stock"
                        : isLowStock
                          ? "Low stock"
                          : product.stock_status === "onbackorder"
                            ? "On backorder"
                            : "In stock";
                      const stockClass = isOutOfStock
                        ? "product-stock-out"
                        : isLowStock
                          ? "product-stock-low"
                          : "product-stock-in";

                      return (
                        <tr key={product.id}>
                          <td>
                            <div className="product-name-cell">
                              {product.images?.[0]?.src ? (
                                <img
                                  className="product-thumbnail"
                                  src={product.images[0].src}
                                  alt={product.images[0].alt || product.name}
                                  loading="lazy"
                                />
                              ) : (
                                <div className="product-thumbnail product-thumbnail-empty">
                                  <Package size={17} />
                                </div>
                              )}
                              <span>{product.name}</span>
                            </div>
                          </td>
                          <td>{product.sku || "—"}</td>
                          <td>{categories}</td>
                          <td className="amount-cell">{product.price ? product.price : "—"}</td>
                          <td>{quantityTracked ? product.stock_quantity : "Not tracked"}</td>
                          <td>
                            <span className={`product-stock-badge ${stockClass}`}>
                              {availability}
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                    {!productsLoading && !productsError && filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan="6" className="empty-state">
                          {products.length === 0
                            ? "No products were found in your WooCommerce store."
                            : "No products match your search or selected stock filter."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {!["Customers", "Orders", "Products"].includes(active) && (
          <section className="panel placeholder-panel">
            <div className="placeholder-icon">
              <LayoutDashboard size={26} />
            </div>
            <h2>{active} workspace</h2>
            <p>This section is ready for the next development step.</p>
            <p className="placeholder-hint">
              We'll add real functionality here and connect it to WooCommerce
              after the CRM pages are ready.
            </p>
          </section>
        )}
      </main>
    </>
  );
}


export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar active={active} setActive={setActive} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="main-shell">
        <button className="mobile-menu-button" aria-label="Open menu" onClick={() => setMobileOpen(true)}><Menu size={21} /></button>
        {active === "Dashboard" ? <Dashboard setActive={setActive} /> : <SimplePage active={active} />}
      </div>
    </div>
  );
}
