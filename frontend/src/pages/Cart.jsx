import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrderModal from "../components/OrderModal";
import axiosInstance from "../axiosConfig";

const initialCartItems = [
  {
    id: 1,
    name: "Beige Cotton Pant",
    price: 24.99,
    imageUrl: "/CottonPant.png",
    qty: 1,
  },
  {
    id: 2,
    name: "Beige Cotton T shirt",
    price: 34.99,
    imageUrl: "/CottonT.png",
    qty: 2,
  },
  {
    id: 3,
    name: "Eco Friendly Bottle",
    price: 49.99,
    imageUrl: "/EcoBottle.png",
    qty: 1,
  },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [removingId, setRemovingId] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const navigate = useNavigate();
  const fetchCart = async () => {
    const res = await axiosInstance.get("/api/cart");
    setCartItems(res.data.items);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (id, delta) => {
    const item = cartItems.find((i) => i.product === id);

    if (!item) {
      console.error("Item not found in cart", id);
      return;
    }

    const newQty = item.qty + delta;

    if (newQty < 1) return;

    await axiosInstance.put("/api/cart/update", {
      productId: id,
      qty: newQty,
    });

    fetchCart();
  };

  const removeItem = async (id) => {
    await axiosInstance.delete(`/api/cart/${id}`);
    fetchCart();
  };

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const totalQty = cartItems.reduce((sum, i) => sum + i.qty, 0);

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto mt-20">
        <main style={styles.main}>
          <div style={styles.emptyWrap}>
            <div style={styles.emptyIcon}>🛒</div>
            <h2 style={styles.emptyTitle}>Your cart is empty</h2>
            <p style={styles.emptySub}>
              Looks like you haven't added anything yet.
            </p>
            <button onClick={() => navigate("/")} style={styles.shopBtn}>
              Continue Shopping
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20">
      <main style={styles.main}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Your Cart</h1>
            <p style={styles.pageSubtitle}>
              {totalQty} item{totalQty !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={() => navigate("/")} style={styles.continueBtn}>
            ← Continue Shopping
          </button>
        </div>

        <div style={styles.layout}>
          <div style={styles.itemsCol}>
            {cartItems.map((item) => (
              <div
                key={item.product}
                style={{
                  ...styles.card,
                  opacity: removingId === item.id ? 0 : 1,
                  transform:
                    removingId === item.id
                      ? "translateX(40px)"
                      : "translateX(0)",
                  transition: "opacity 0.28s ease, transform 0.28s ease",
                }}
              >
                <div style={styles.imgWrap}>
                  <img src={item.imageUrl} alt={item.name} style={styles.img} />
                </div>

                <div style={styles.itemBody}>
                  <div style={styles.itemTop}>
                    <div>
                      <p style={styles.itemName}>{item.name}</p>
                      <p style={styles.itemUnit}>
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product)}
                      style={styles.deleteBtn}
                      title="Remove item"
                    >
                      🗑
                    </button>
                  </div>

                  <div style={styles.itemBottom}>
                    <div style={styles.qtyControl}>
                      <button
                        onClick={() => updateQty(item.product, -1)}
                        style={{
                          ...styles.qtyBtn,
                          opacity: item.qty === 1 ? 0.4 : 1,
                        }}
                        disabled={item.qty === 1}
                      >
                        −
                      </button>
                      <span style={styles.qtyValue}>{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.product, +1)}
                        style={styles.qtyBtn}
                      >
                        +
                      </button>
                    </div>

                    <p style={styles.lineTotal}>
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.summaryCol}>
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryTitle}>Order Summary</h2>

              <div style={styles.summaryRows}>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>
                    Subtotal ({totalQty} items)
                  </span>
                  <span style={styles.summaryValue}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Shipping</span>
                  <span
                    style={{
                      ...styles.summaryValue,
                      color: shipping === 0 ? "#286934" : "#1a1a1a",
                      fontWeight: shipping === 0 ? 700 : 400,
                    }}
                  >
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Tax (8%)</span>
                  <span style={styles.summaryValue}>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div style={styles.divider} />

              <div style={{ ...styles.summaryRow, marginTop: 16 }}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalValue}>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => setOrderModalOpen(true)}
                style={styles.checkoutBtn}
              >
                Proceed to Checkout →
              </button>

              <div style={styles.badges}>
                <div style={styles.badge}>
                  <span>🔒</span> Secure Checkout
                </div>
                <div style={styles.badge}>
                  <span>♻️</span> Eco Packaging
                </div>
                <div style={styles.badge}>
                  <span>↩️</span> Easy Returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        onConfirm={(orderData) => {
          console.log("Order confirmed:", orderData);
        }}
        subtotal={subtotal}
        shipping={shipping}
        tax={tax}
        total={total}
      />
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
    marginBottom: 32,
    flexWrap: "wrap",
    gap: 12,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: 700,
    margin: "0 0 4px",
    letterSpacing: "-1px",
  },
  pageSubtitle: {
    fontSize: 15,
    color: "#888",
    margin: 0,
  },
  continueBtn: {
    background: "none",
    border: "1.5px solid #ddd",
    borderRadius: 50,
    padding: "9px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    color: "#555",
    fontFamily: "inherit",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: 28,
    alignItems: "start",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
    },
  },
  itemsCol: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  shippingBanner: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#fffde7",
    border: "1.5px solid #fff176",
    borderRadius: 14,
    padding: "14px 18px",
  },
  shippingBannerText: {
    fontSize: 14,
    color: "#555",
    margin: "0 0 8px",
  },
  progressTrack: {
    height: 6,
    background: "#e0e0e0",
    borderRadius: 50,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#286934",
    borderRadius: 50,
    transition: "width 0.4s ease",
  },

  card: {
    display: "flex",
    gap: 18,
    background: "#fff",
    borderRadius: 18,
    border: "1px solid #eee",
    padding: 16,
    alignItems: "center",
  },
  imgWrap: {
    width: 100,
    height: 100,
    borderRadius: 12,
    background: "#f5f5f5",
    overflow: "hidden",
    flexShrink: 0,
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  itemBody: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemName: {
    margin: "0 0 4px",
    fontSize: 15,
    fontWeight: 700,
    color: "#1a1a1a",
  },
  itemUnit: {
    margin: 0,
    fontSize: 13,
    color: "#999",
  },
  deleteBtn: {
    background: "#fff5f5",
    border: "1px solid #ffcdd2",
    borderRadius: 8,
    width: 34,
    height: 34,
    fontSize: 16,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background 0.15s",
  },
  itemBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  qtyControl: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    background: "#f5f5f5",
    borderRadius: 50,
    padding: "4px",
    border: "1px solid #e8e8e8",
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 50,
    border: "none",
    background: "#fff",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    transition: "background 0.15s",
    color: "#1a1a1a",
    fontFamily: "inherit",
  },
  qtyValue: {
    width: 36,
    textAlign: "center",
    fontSize: 15,
    fontWeight: 700,
    color: "#1a1a1a",
  },
  lineTotal: {
    margin: 0,
    fontSize: 17,
    fontWeight: 700,
    color: "#286934",
  },

  summaryCol: { position: "sticky", top: 24 },
  summaryCard: {
    background: "#fff",
    borderRadius: 20,
    border: "1px solid #eee",
    padding: "24px 22px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 700,
    margin: "0 0 20px",
    letterSpacing: "-0.4px",
  },
  summaryRows: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: 14, color: "#777" },
  summaryValue: { fontSize: 14, fontWeight: 600, color: "#1a1a1a" },
  divider: { height: 1, background: "#f0f0f0", margin: "16px 0 0" },
  totalLabel: { fontSize: 17, fontWeight: 700, color: "#1a1a1a" },
  totalValue: { fontSize: 22, fontWeight: 800, color: "#1a1a1a" },

  checkoutBtn: {
    width: "100%",
    marginTop: 20,
    padding: "15px 0",
    borderRadius: 14,
    border: "none",
    background: "#286934",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 6px 18px rgba(40,105,52,0.3)",
    transition: "transform 0.15s, box-shadow 0.15s",
  },

  badges: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 18,
    padding: "16px",
    background: "#fafafa",
    borderRadius: 12,
  },
  badge: {
    fontSize: 12,
    color: "#777",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  emptyWrap: {
    textAlign: "center",
    padding: "80px 0",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: 700,
    margin: "0 0 10px",
    letterSpacing: "-0.5px",
  },
  emptySub: {
    fontSize: 15,
    color: "#999",
    margin: "0 0 28px",
  },
  shopBtn: {
    padding: "13px 32px",
    borderRadius: 50,
    border: "none",
    background: "#286934",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 4px 14px rgba(40,105,52,0.3)",
  },
};

export default Cart;
