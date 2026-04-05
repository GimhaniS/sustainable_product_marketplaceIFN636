import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const statusConfig = {
  Processing: {
    color: "#1565c0",
    bg: "#e3f2fd",
    border: "#90caf9",
    icon: "⏳",
  },

  Shipped: {
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    icon: "📦",
  },

  "Out for Delivery": {
    color: "#e65100",
    bg: "#fff3e0",
    border: "#ffcc80",
    icon: "🚚",
  },

  Delivered: {
    color: "#286934",
    bg: "#f0f9f1",
    border: "#a5d6a7",
    icon: "✅",
  },

  Completed: {
    color: "#1b5e20",
    bg: "#e8f5e9",
    border: "#81c784",
    icon: "🎉",
  },

  Cancelled: {
    color: "#c62828",
    bg: "#ffebee",
    border: "#ef9a9a",
    icon: "✕",
  },
};

const ALL = "All";
const statusTabs = [
  ALL,
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Completed",
  "Cancelled",
];

const CustomerOrders = () => {
  const [activeTab, setActiveTab] = useState(ALL);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/api/orders/my-orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrders();
  }, []);

  const formatOrder = (order) => ({
    id: order._id,
    date: new Date(order.createdAt).toLocaleDateString(),
    items: order.items?.length || 0,
    total: order.total || 0,
    status: order.status,
    products: order.items?.map((i) => i.name) || [],
    address: order.shippingAddress
      ? `${order.shippingAddress.line1}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
      : "N/A",
  });

  const visible =
    activeTab === ALL
      ? orders.map(formatOrder)
      : orders.filter((o) => o.status === activeTab).map(formatOrder);

  return (
    <div className="mx-auto mt-20">
      <main style={styles.main}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>My Orders</h1>
            <p style={styles.pageSubtitle}>{orders.length} orders placed</p>
          </div>
          <button
            onClick={() => navigate("/CustomerDashboard")}
            style={styles.shopBtn}
          >
            + Shop More
          </button>
        </div>

        {/* Tabs */}
        <div style={styles.tabsWrap}>
          <div style={styles.tabs}>
            {statusTabs.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    ...styles.tab,
                    background: active ? "#286934" : "#fff",
                    color: active ? "#fff" : "#555",
                    border: active
                      ? "1.5px solid #286934"
                      : "1.5px solid #e0e0e0",
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {tab !== ALL && (
                    <span style={{ marginRight: 5 }}>
                      {statusConfig[tab]?.icon}
                    </span>
                  )}
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty */}
        {visible.length === 0 ? (
          <div style={styles.emptyWrap}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>📦</div>
            <p style={styles.emptyTitle}>No {activeTab.toLowerCase()} orders</p>
            <p style={styles.emptySub}>
              Orders with this status will appear here.
            </p>
          </div>
        ) : (
          <div style={styles.cardList}>
            {visible.map((order) => {
              const st = statusConfig[order.status] || {};

              return (
                <div key={order.id} style={styles.card}>
                  <div style={styles.cardMain}>
                    <div style={styles.cardLeft}>
                      <div style={styles.orderIdRow}>
                        <span style={styles.orderId}>{order.id}</span>
                        <span
                          style={{
                            ...styles.statusBadge,
                            color: st.color,
                            background: st.bg,
                            border: `1.5px solid ${st.border}`,
                          }}
                        >
                          {st.icon} {order.status}
                        </span>
                      </div>

                      <div style={styles.metaRow}>
                        <span style={styles.metaItem}>📅 {order.date}</span>
                        <span style={styles.metaDot}>·</span>
                        <span style={styles.metaItem}>
                          📦 {order.items} item
                          {order.items !== 1 ? "s" : ""}
                        </span>
                        <span style={styles.metaDot}>·</span>
                        <span style={styles.metaItem}>📍 {order.address}</span>
                      </div>

                      <p style={styles.productPreview}>
                        {order.products.slice(0, 2).join(", ")}
                        {order.products.length > 2 &&
                          ` +${order.products.length - 2} more`}
                      </p>
                    </div>

                    <div style={styles.cardRight}>
                      <p style={styles.total}>${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  main: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px 60px",
  },
  pageHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 28,
    flexWrap: "wrap",
    gap: 12,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: 700,
    margin: "0 0 4px",
  },
  pageSubtitle: {
    fontSize: 15,
    color: "#888",
  },
  shopBtn: {
    padding: "10px 22px",
    borderRadius: 50,
    border: "none",
    background: "#286934",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  tabsWrap: { marginBottom: 28 },
  tabs: { display: "flex", gap: 10 },
  tab: {
    padding: "8px 18px",
    borderRadius: 50,
    cursor: "pointer",
  },
  cardList: { display: "flex", flexDirection: "column", gap: 16 },
  card: {
    background: "#fff",
    borderRadius: 18,
    border: "1px solid #eee",
  },
  cardMain: {
    display: "flex",
    justifyContent: "space-between",
    padding: 20,
  },
  orderId: { fontWeight: 800 },
  statusBadge: {
    fontSize: 12,
    padding: "4px 12px",
    borderRadius: 50,
  },
  metaRow: { display: "flex", gap: 6 },
  metaItem: { fontSize: 13, color: "#777" },
  metaDot: { color: "#ccc" },
  productPreview: { fontSize: 13 },
  total: { fontSize: 20, fontWeight: 800 },
  emptyWrap: { textAlign: "center", padding: 70 },
  emptyTitle: { fontWeight: 700 },
  emptySub: { color: "#aaa" },
};

export default CustomerOrders;
