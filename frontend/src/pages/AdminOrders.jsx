import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";

const ALL = "All";
const STATUSES = [
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Completed",
  "Cancelled",
];

const STATUS_STYLES = {
  Processing: { bg: "#FFF8E1", color: "#F59E0B", border: "#FDE68A" },
  Shipped: { bg: "#EFF6FF", color: "#3B82F6", border: "#BFDBFE" },
  "Out for Delivery": { bg: "#F0F9FF", color: "#0EA5E9", border: "#BAE6FD" },
  Delivered: { bg: "#F0FDF4", color: "#22C55E", border: "#BBF7D0" },
  Completed: { bg: "#F0F9F1", color: "#286934", border: "#C8E6C9" },
  Cancelled: { bg: "#FFF5F5", color: "#E53935", border: "#FFCDD2" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] ?? {
    bg: "#f5f5f5",
    color: "#777",
    border: "#ddd",
  };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontSize: 11,
        fontWeight: 700,
        borderRadius: 20,
        padding: "3px 10px",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState(ALL);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(null); // id of order being updated

  // ─── Fetch ────────────────────────────────────────────────────────────────

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ─── Update status ────────────────────────────────────────────────────────

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdating(id);
      await axiosInstance.patch(`/api/orders/${id}/status`, {
        status: newStatus,
      });
      // Optimistically update UI without full re-fetch
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o)),
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  // ─── Derived ──────────────────────────────────────────────────────────────

  const filteredOrders =
    activeTab === ALL ? orders : orders.filter((o) => o.status === activeTab);

  const tabCount = (tab) =>
    tab === ALL ? orders.length : orders.filter((o) => o.status === tab).length;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="mx-auto mt-20 px-6 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-500">
            {orders.length} total order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          style={{
            padding: "8px 18px",
            borderRadius: 50,
            border: "1.5px solid #e0e0e0",
            background: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            color: "#555",
            fontFamily: "inherit",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {[ALL, ...STATUSES].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full border text-sm font-medium ${
              activeTab === tab
                ? "bg-[#286934] text-white border-[#286934]"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            {tab}
            <span
              style={{
                marginLeft: 6,
                fontSize: 10,
                fontWeight: 700,
                background:
                  activeTab === tab ? "rgba(255,255,255,0.25)" : "#f0f0f0",
                color: activeTab === tab ? "#fff" : "#999",
                borderRadius: 20,
                padding: "1px 6px",
              }}
            >
              {tabCount(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <p className="text-center text-gray-400 mt-10">Loading orders...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-xl p-5 shadow-sm"
              style={{
                opacity: updating === order._id ? 0.6 : 1,
                transition: "opacity 0.2s",
              }}
            >
              <div className="flex justify-between flex-wrap gap-4">
                {/* Left — order info */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-lg">
                      #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-gray-500">
                    👤 {order.customer?.name ?? "Unknown"}{" "}
                    <span className="text-gray-400">
                      ({order.customer?.email})
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    📅 {formatDate(order.createdAt)}
                  </p>
                  <p className="text-sm text-gray-500">
                    📦 {order.items?.length ?? 0} item
                    {order.items?.length !== 1 ? "s" : ""}
                  </p>
                  {order.shippingAddress && (
                    <p className="text-sm text-gray-500">
                      📍{" "}
                      {[
                        order.shippingAddress.line1,
                        order.shippingAddress.city,
                        order.shippingAddress.state,
                        order.shippingAddress.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>

                {/* Right — total + status selector */}
                <div className="flex flex-col items-end gap-3">
                  <p className="text-xl font-bold text-[#286934]">
                    ${order.total?.toFixed(2)}
                  </p>

                  <select
                    value={order.status}
                    disabled={updating === order._id}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    style={{
                      border: "1.5px solid #e0e0e0",
                      borderRadius: 8,
                      padding: "6px 12px",
                      fontSize: 13,
                      fontFamily: "inherit",
                      fontWeight: 600,
                      color: "#333",
                      background: "#fafafa",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items preview */}
              {order.items?.length > 0 && (
                <div
                  style={{
                    marginTop: 14,
                    paddingTop: 12,
                    borderTop: "1px solid #f0f0f0",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#f9f9f9",
                        border: "1px solid #eee",
                        borderRadius: 8,
                        padding: "6px 10px",
                        fontSize: 12,
                        color: "#555",
                      }}
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 4,
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <span style={{ fontWeight: 600, color: "#1a1a1a" }}>
                        {item.name}
                      </span>
                      <span>× {item.quantity}</span>
                      <span style={{ color: "#286934", fontWeight: 700 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && filteredOrders.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
          <p style={{ fontSize: 36, margin: "0 0 12px" }}>📭</p>
          <p style={{ fontWeight: 700, fontSize: 16 }}>
            No {activeTab !== ALL ? activeTab.toLowerCase() : ""} orders
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
