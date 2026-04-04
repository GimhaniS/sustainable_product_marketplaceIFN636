import { useState } from 'react';

const paymentMethods = [
  { id: 'card',   label: 'Credit / Debit Card', icon: '💳' },
  { id: 'paypal', label: 'PayPal',               icon: '🅿️' },
  { id: 'cod',    label: 'Cash on Delivery',     icon: '💵' },
];

const OrderModal = ({ isOpen, onClose, onConfirm, total, shipping, tax, subtotal }) => {
  const [address, setAddress] = useState({
    fullName:  '',
    line1:     '',
    city:      '',
    state:     '',
    zip:       '',
    country:   '',
  });
  const [payment, setPayment]   = useState('card');
  const [placing, setPlacing]   = useState(false);
  const [success, setSuccess]   = useState(false);

  if (!isOpen) return null;

  const isValid =
    address.fullName.trim() &&
    address.line1.trim() &&
    address.city.trim() &&
    address.zip.trim() &&
    address.country.trim();

  const handleConfirm = async () => {
    if (!isValid) return;
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1400));
    setPlacing(false);
    setSuccess(true);
  };

  const handleDone = () => {
    setSuccess(false);
    onConfirm?.({ address, payment });
    onClose();
  };

  const field = (key, placeholder, half = false) => (
    <div style={{ ...styles.fieldWrap, flex: half ? '1 1 calc(50% - 6px)' : '1 1 100%' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={address[key]}
        onChange={e => setAddress(prev => ({ ...prev, [key]: e.target.value }))}
        style={styles.input}
      />
    </div>
  );

  if (success) {
    return (
      <>
        <div style={styles.backdrop} onClick={handleDone} />
        <div style={styles.modal}>
          <div style={styles.successWrap}>
            <div style={styles.successIcon}>🎉</div>
            <h2 style={styles.successTitle}>Order Placed!</h2>
            <p style={styles.successSub}>
              Thank you for your purchase. We'll send you a confirmation shortly.
            </p>
            <div style={styles.successTotal}>
              <span style={styles.successTotalLabel}>Total Charged</span>
              <span style={styles.successTotalValue}>${total.toFixed(2)}</span>
            </div>
            <button onClick={handleDone} style={styles.doneBtn}>Done</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={styles.backdrop} onClick={onClose} />
      <div style={styles.modal}>

        <div style={styles.header}>
          <h2 style={styles.title}>Place Order</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.body}>

          <div style={styles.totalCard}>
            <div style={styles.totalRow}>
              <span style={styles.totalRowLabel}>Subtotal</span>
              <span style={styles.totalRowValue}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.totalRow}>
              <span style={styles.totalRowLabel}>Shipping</span>
              <span style={{ ...styles.totalRowValue, color: shipping === 0 ? '#286934' : '#1a1a1a' }}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div style={styles.totalRow}>
              <span style={styles.totalRowLabel}>Tax</span>
              <span style={styles.totalRowValue}>${tax.toFixed(2)}</span>
            </div>
            <div style={styles.totalDivider} />
            <div style={styles.totalRow}>
              <span style={styles.grandLabel}>Total</span>
              <span style={styles.grandValue}>${total.toFixed(2)}</span>
            </div>
          </div>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>📍</span> Delivery Address
            </h3>
            <div style={styles.fieldGrid}>
              {field('fullName', 'Full Name')}
              {field('line1',    'Street Address')}
              {field('city',     'City',    true)}
              {field('state',    'State',   true)}
              {field('zip',      'ZIP / Postal Code', true)}
              {field('country',  'Country',            true)}
            </div>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>💳</span> Payment Method
            </h3>
            <div style={styles.paymentList}>
              {paymentMethods.map(m => {
                const active = payment === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPayment(m.id)}
                    style={{
                      ...styles.paymentOption,
                      border: active ? '2px solid #286934' : '1.5px solid #e0e0e0',
                      background: active ? '#f0f9f1' : '#fafafa',
                    }}
                  >
                    <span style={styles.paymentIcon}>{m.icon}</span>
                    <span style={{ ...styles.paymentLabel, fontWeight: active ? 700 : 500, color: active ? '#286934' : '#333' }}>
                      {m.label}
                    </span>
                    <div style={{
                      ...styles.radioOuter,
                      borderColor: active ? '#286934' : '#ccc',
                    }}>
                      {active && <div style={styles.radioInner} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={!isValid || placing}
            style={{
              ...styles.confirmBtn,
              opacity: (!isValid || placing) ? 0.6 : 1,
              cursor:  (!isValid || placing) ? 'not-allowed' : 'pointer',
            }}
          >
            {placing ? (
              <span style={styles.spinner}>⏳ Placing order…</span>
            ) : (
              `Confirm Order · $${total.toFixed(2)}`
            )}
          </button>
        </div>

      </div>
    </>
  );
};

const styles = {
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.45)',
    zIndex: 999,
    backdropFilter: 'blur(2px)',
  },
  modal: {
    position: 'fixed',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#fff',
    borderRadius: 22,
    width: '92%', maxWidth: 500,
    maxHeight: '90vh',
    display: 'flex', flexDirection: 'column',
    zIndex: 1000,
    boxShadow: '0 28px 64px rgba(0,0,0,0.18)',
    overflow: 'hidden',
  },

  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px 16px',
    borderBottom: '1px solid #f0f0f0',
    flexShrink: 0,
  },
  title: { fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' },
  closeBtn: {
    background: '#f5f5f5', border: 'none', borderRadius: 50,
    width: 32, height: 32, fontSize: 14, cursor: 'pointer', color: '#555',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },

  body: { overflowY: 'auto', padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 },

  totalCard: {
    background: '#f8fdf9',
    border: '1.5px solid #c8e6c9',
    borderRadius: 14,
    padding: '16px 18px',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totalRowLabel: { fontSize: 13, color: '#777' },
  totalRowValue: { fontSize: 13, fontWeight: 600, color: '#1a1a1a' },
  totalDivider: { height: 1, background: '#c8e6c9' },
  grandLabel: { fontSize: 16, fontWeight: 700, color: '#1a1a1a' },
  grandValue: { fontSize: 20, fontWeight: 800, color: '#286934' },

  section: { display: 'flex', flexDirection: 'column', gap: 12 },
  sectionTitle: {
    fontSize: 15, fontWeight: 700, margin: 0,
    display: 'flex', alignItems: 'center', gap: 8, color: '#1a1a1a',
  },
  sectionIcon: { fontSize: 16 },

  fieldGrid: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  fieldWrap: { minWidth: 0 },
  input: {
    width: '100%', boxSizing: 'border-box',
    padding: '11px 14px',
    border: '1.5px solid #e0e0e0',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'inherit',
    color: '#1a1a1a',
    background: '#fafafa',
    outline: 'none',
    transition: 'border-color 0.15s',
  },

  paymentList: { display: 'flex', flexDirection: 'column', gap: 10 },
  paymentOption: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '13px 16px',
    borderRadius: 12,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
    textAlign: 'left',
  },
  paymentIcon: { fontSize: 22, flexShrink: 0 },
  paymentLabel: { flex: 1, fontSize: 14 },
  radioOuter: {
    width: 18, height: 18, borderRadius: 50,
    border: '2px solid #ccc', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'border-color 0.15s',
  },
  radioInner: {
    width: 9, height: 9, borderRadius: 50, background: '#286934',
  },

  footer: {
    display: 'flex', gap: 12,
    padding: '16px 24px',
    borderTop: '1px solid #f0f0f0',
    flexShrink: 0,
  },
  cancelBtn: {
    flex: 1, padding: '13px 0', borderRadius: 12,
    border: '1.5px solid #ddd', background: '#fff',
    fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#555',
    fontFamily: 'inherit',
  },
  confirmBtn: {
    flex: 2, padding: '13px 0', borderRadius: 12,
    border: 'none', background: '#286934',
    fontSize: 14, fontWeight: 700, color: '#fff',
    fontFamily: 'inherit',
    boxShadow: '0 4px 14px rgba(40,105,52,0.3)',
    transition: 'opacity 0.15s',
  },
  spinner: { fontSize: 14 },

  successWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '48px 32px', textAlign: 'center',
  },
  successIcon: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 26, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.5px' },
  successSub: { fontSize: 15, color: '#777', margin: '0 0 28px', lineHeight: 1.5 },
  successTotal: {
    background: '#f0f9f1', border: '1.5px solid #a5d6a7',
    borderRadius: 14, padding: '14px 32px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    marginBottom: 28,
  },
  successTotalLabel: { fontSize: 13, color: '#777' },
  successTotalValue: { fontSize: 28, fontWeight: 800, color: '#286934' },
  doneBtn: {
    padding: '13px 48px', borderRadius: 50,
    border: 'none', background: '#286934',
    color: '#fff', fontSize: 15, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 4px 14px rgba(40,105,52,0.3)',
  },
};

export default OrderModal;