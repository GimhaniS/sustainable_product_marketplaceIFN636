import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockOrders = [
  {
    id: 'ORD-10421',
    date: 'April 1, 2025',
    items: 3,
    total: 109.97,
    status: 'Delivered',
    products: ['Beige Cotton Pant', 'Eco Friendly Bottle', 'Eco Box'],
    address: '12 Green Lane, Melbourne VIC 3000',
  },
  {
    id: 'ORD-10398',
    date: 'March 24, 2025',
    items: 2,
    total: 62.98,
    status: 'Out for Delivery',
    products: ['Beige Cotton T shirt', 'Eco Kitchen Towel'],
    address: '45 Leaf Street, Sydney NSW 2000',
  },
  {
    id: 'ORD-10374',
    date: 'March 15, 2025',
    items: 4,
    total: 197.96,
    status: 'Processing',
    products: ['Eco Spoon', 'Eco Plates', 'Eco Folks', 'Eco Box'],
    address: '8 Nature Ave, Brisbane QLD 4000',
  },
  {
    id: 'ORD-10351',
    date: 'March 2, 2025',
    items: 1,
    total: 34.99,
    status: 'Cancelled',
    products: ['Beige Cotton T shirt'],
    address: '3 Bloom Road, Perth WA 6000',
  },
  {
    id: 'ORD-10320',
    date: 'February 18, 2025',
    items: 2,
    total: 71.98,
    status: 'Delivered',
    products: ['Eco Friendly Bottle', 'Eco Plates'],
    address: '21 River Rd, Adelaide SA 5000',
  },
];

const statusConfig = {
  'Delivered':        { color: '#286934', bg: '#f0f9f1', border: '#a5d6a7', icon: '✅' },
  'Out for Delivery': { color: '#e65100', bg: '#fff3e0', border: '#ffcc80', icon: '🚚' },
  'Processing':       { color: '#1565c0', bg: '#e3f2fd', border: '#90caf9', icon: '⏳' },
  'Cancelled':        { color: '#c62828', bg: '#ffebee', border: '#ef9a9a', icon: '✕'  },
};

const ALL = 'All';
const statusTabs = [ALL, 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const CustomerOrders = () => {
  const [activeTab, setActiveTab]       = useState(ALL);
  const [expandedId, setExpandedId]     = useState(null);

  const navigate   = useNavigate();

  const visible = activeTab === ALL
    ? mockOrders
    : mockOrders.filter(o => o.status === activeTab);

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="mx-auto mt-20">
      <main style={styles.main}>

        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>My Orders</h1>
            <p style={styles.pageSubtitle}>{mockOrders.length} orders placed</p>
          </div>
          <button onClick={() => navigate('/CustomerDashboard')} style={styles.shopBtn}>
            + Shop More
          </button>
        </div>

        <div style={styles.tabsWrap}>
          <div style={styles.tabs}>
            {statusTabs.map(tab => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    ...styles.tab,
                    background:   active ? '#286934' : '#fff',
                    color:        active ? '#fff'    : '#555',
                    border:       active ? '1.5px solid #286934' : '1.5px solid #e0e0e0',
                    fontWeight:   active ? 700 : 500,
                  }}
                >
                  {tab !== ALL && (
                    <span style={{ marginRight: 5 }}>{statusConfig[tab]?.icon}</span>
                  )}
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {visible.length === 0 ? (
          <div style={styles.emptyWrap}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>📦</div>
            <p style={styles.emptyTitle}>No {activeTab.toLowerCase()} orders</p>
            <p style={styles.emptySub}>Orders with this status will appear here.</p>
          </div>
        ) : (
          <div style={styles.cardList}>
            {visible.map(order => {
              const st       = statusConfig[order.status];
              const expanded = expandedId === order.id;

              return (
                <div key={order.id} style={styles.card}>

                  <div style={styles.cardMain}>

                    <div style={styles.cardLeft}>
                      <div style={styles.orderIdRow}>
                        <span style={styles.orderId}>{order.id}</span>
                        <span style={{
                          ...styles.statusBadge,
                          color:      st.color,
                          background: st.bg,
                          border:     `1.5px solid ${st.border}`,
                        }}>
                          {st.icon} {order.status}
                        </span>
                      </div>

                      <div style={styles.metaRow}>
                        <span style={styles.metaItem}>
                          <span style={styles.metaIcon}>📅</span>
                          {order.date}
                        </span>
                        <span style={styles.metaDot}>·</span>
                        <span style={styles.metaItem}>
                          <span style={styles.metaIcon}>📦</span>
                          {order.items} item{order.items !== 1 ? 's' : ''}
                        </span>
                        <span style={styles.metaDot}>·</span>
                        <span style={styles.metaItem}>
                          <span style={styles.metaIcon}>📍</span>
                          {order.address}
                        </span>
                      </div>

                      <p style={styles.productPreview}>
                        {order.products.slice(0, 2).join(', ')}
                        {order.products.length > 2 && ` +${order.products.length - 2} more`}
                      </p>
                    </div>

                    <div style={styles.cardRight}>
                      <p style={styles.total}>${order.total.toFixed(2)}</p>
                      <button
                        onClick={() => toggle(order.id)}
                        style={styles.detailsBtn}
                      >
                        {expanded ? 'Hide ▲' : 'Details ▼'}
                      </button>
                    </div>

                  </div>

                  {expanded && (
                    <div style={styles.expandedSection}>
                      <div style={styles.expandDivider} />

                      <div style={styles.expandGrid}>
                        <div>
                          <p style={styles.expandLabel}>Items Ordered</p>
                          <div style={styles.itemsList}>
                            {order.products.map((p, i) => (
                              <div key={i} style={styles.itemRow}>
                                <div style={styles.itemDot} />
                                <span style={styles.itemName}>{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p style={styles.expandLabel}>Delivery Address</p>
                          <p style={styles.expandValue}>{order.address}</p>

                          <p style={{ ...styles.expandLabel, marginTop: 16 }}>Order Total</p>
                          <p style={{ ...styles.expandValue, fontSize: 18, fontWeight: 800, color: '#286934' }}>
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div style={styles.actionRow}>
                        {order.status === 'Delivered' && (
                          <button style={{ ...styles.actionBtn, ...styles.actionBtnPrimary }}>
                            ♻️ Reorder
                          </button>
                        )}
                        {order.status === 'Processing' && (
                          <button style={{ ...styles.actionBtn, ...styles.actionBtnDanger }}>
                            Cancel Order
                          </button>
                        )}
                        <button style={styles.actionBtn}>🧾 View Invoice</button>
                        <button style={styles.actionBtn}>💬 Get Help</button>
                      </div>
                    </div>
                  )}

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
    margin: '0 auto',
    padding: '0 24px 60px',
  },

  pageHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 28,
    flexWrap: 'wrap',
    gap: 12,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: 700,
    margin: '0 0 4px',
    letterSpacing: '-1px',
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#888',
    margin: 0,
  },
  shopBtn: {
    padding: '10px 22px',
    borderRadius: 50,
    border: 'none',
    background: '#286934',
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 4px 12px rgba(40,105,52,0.25)',
  },

  tabsWrap: {
    overflowX: 'auto',
    marginBottom: 28,
    paddingBottom: 4,
  },
  tabs: {
    display: 'flex',
    gap: 10,
    minWidth: 'max-content',
  },
  tab: {
    padding: '8px 18px',
    borderRadius: 50,
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  },

  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },

  card: {
    background: '#fff',
    borderRadius: 18,
    border: '1px solid #eee',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    transition: 'box-shadow 0.2s',
  },
  cardMain: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '20px 22px',
    gap: 16,
    flexWrap: 'wrap',
  },
  cardLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  orderIdRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 800,
    color: '#1a1a1a',
    letterSpacing: '-0.3px',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 50,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaItem: {
    fontSize: 13,
    color: '#777',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: { fontSize: 13 },
  metaDot: { color: '#ccc', fontSize: 16 },
  productPreview: {
    margin: 0,
    fontSize: 13,
    color: '#555',
    fontStyle: 'italic',
  },

  cardRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 10,
    flexShrink: 0,
  },
  total: {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
    color: '#286934',
  },
  detailsBtn: {
    background: '#f5f5f5',
    border: '1px solid #e8e8e8',
    borderRadius: 8,
    padding: '7px 16px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#555',
    fontFamily: 'inherit',
  },

  expandedSection: {
    padding: '0 22px 20px',
  },
  expandDivider: {
    height: 1,
    background: '#f0f0f0',
    marginBottom: 18,
  },
  expandGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    marginBottom: 18,
  },
  expandLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    margin: '0 0 10px',
  },
  expandValue: {
    fontSize: 14,
    color: '#333',
    margin: 0,
    lineHeight: 1.5,
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  itemDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#286934',
    flexShrink: 0,
  },
  itemName: {
    fontSize: 13,
    color: '#444',
  },

  actionRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  actionBtn: {
    padding: '8px 18px',
    borderRadius: 8,
    border: '1.5px solid #e0e0e0',
    background: '#fafafa',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#444',
    fontFamily: 'inherit',
  },
  actionBtnPrimary: {
    background: '#286934',
    border: '1.5px solid #286934',
    color: '#fff',
  },
  actionBtnDanger: {
    background: '#ffebee',
    border: '1.5px solid #ef9a9a',
    color: '#c62828',
  },

  emptyWrap: {
    textAlign: 'center',
    padding: '70px 0',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 700,
    margin: '0 0 8px',
    color: '#333',
  },
  emptySub: {
    fontSize: 14,
    color: '#aaa',
    margin: 0,
  },
};

export default CustomerOrders;