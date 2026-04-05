import { useState, useEffect } from 'react';
import SupplierModal from '../components/SupplierModal';
import axiosInstance from '../axiosConfig';

const AdminSuppliers = () => {
  const [suppliers,     setSuppliers]     = useState([]);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [editSupplier,  setEditSupplier]  = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading,       setLoading]       = useState(false);

  // ─── API ──────────────────────────────────────────────────────────────────

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Called by SupplierModal after a successful POST or PUT
  const handleSupplierSaved = () => fetchSuppliers();

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/suppliers/${id}`);
      setDeleteConfirm(null);
      fetchSuppliers();
    } catch (err) {
      console.error(err);
      alert('Failed to delete supplier');
    }
  };

  // ─── Modal helpers ────────────────────────────────────────────────────────

  const openAdd = () => { setEditSupplier(null); setModalOpen(true); };
  const openEdit = (supplier) => { setEditSupplier(supplier); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditSupplier(null); };

  return (
    <div className="mx-auto mt-20">
      <main style={styles.main}>

        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Suppliers</h1>
            <p style={styles.pageSub}>
              {suppliers.length} registered supplier{suppliers.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={openAdd} style={styles.addBtn}>
            + Add Supplier
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
            <p style={{ fontSize: 16 }}>Loading suppliers...</p>
          </div>
        ) : suppliers.length > 0 ? (
          <div style={styles.grid}>
            {suppliers.map(supplier => (
              <div key={supplier._id} style={styles.card}>

                <div style={styles.cardTop}>
                  <div style={styles.logoWrap}>
                    {supplier.logoUrl ? (
                      <img
                        src={supplier.logoUrl}
                        alt={supplier.name}
                        style={styles.logoImg}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <span style={styles.logoFallback}>
                        {supplier.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div style={styles.cardNameWrap}>
                    <p style={styles.cardName}>{supplier.name}</p>
                    <span style={styles.licenseChip}>
                      🪪 {supplier.licenseNumber}
                    </span>
                  </div>
                </div>

                <div style={styles.divider} />

                <div style={styles.detailsList}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailIcon}>📞</span>
                    <span style={styles.detailText}>{supplier.contactNo}</span>
                  </div>
                  {supplier.address && (
                    <div style={styles.detailRow}>
                      <span style={styles.detailIcon}>📍</span>
                      <span style={styles.detailText}>{supplier.address}</span>
                    </div>
                  )}
                </div>

                <div style={styles.cardActions}>
                  <button onClick={() => openEdit(supplier)} style={styles.editBtn}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(supplier._id)} style={styles.deleteBtn}>
                    🗑 Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>🏭</p>
            <p style={styles.emptyTitle}>No suppliers found</p>
          </div>
        )}

      </main>

      {/* Delete confirmation */}
      {deleteConfirm !== null && (
        <>
          <div style={styles.confirmBackdrop} onClick={() => setDeleteConfirm(null)} />
          <div style={styles.confirmBox}>
            <p style={styles.confirmIcon}>🗑</p>
            <p style={styles.confirmTitle}>Delete Supplier?</p>
            <p style={styles.confirmSub}>
              This will permanently remove{' '}
              <strong>{suppliers.find(s => s._id === deleteConfirm)?.name}</strong>.
              This action cannot be undone.
            </p>
            <div style={styles.confirmActions}>
              <button onClick={() => setDeleteConfirm(null)} style={styles.confirmCancelBtn}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} style={styles.confirmDeleteBtn}>
                Yes, Delete
              </button>
            </div>
          </div>
        </>
      )}

      <SupplierModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSaved={handleSupplierSaved}
        supplier={editSupplier}
      />

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
    letterSpacing: '-0.8px',
    color: '#1a1a1a',
  },
  pageSub: {
    fontSize: 14,
    color: '#999',
    margin: 0,
  },
  addBtn: {
    padding: '10px 22px',
    borderRadius: 50,
    border: 'none',
    background: '#286934',
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 3px 10px rgba(40,105,52,0.25)',
    whiteSpace: 'nowrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 20,
  },
  card: {
    background: '#fff',
    borderRadius: 18,
    border: '1px solid #eeeeee',
    padding: '22px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    background: '#f0f9f1',
    border: '1.5px solid #c8e6c9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  logoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  logoFallback: {
    fontSize: 22,
    fontWeight: 700,
    color: '#286934',
  },
  cardNameWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    minWidth: 0,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1a1a1a',
    margin: 0,
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  licenseChip: {
    display: 'inline-block',
    background: '#f0f9f1',
    color: '#286934',
    fontSize: 11,
    fontWeight: 600,
    borderRadius: 20,
    padding: '3px 10px',
    border: '1px solid #c8e6c9',
    whiteSpace: 'nowrap',
  },
  divider: {
    height: 1,
    background: '#f0f0f0',
    marginBottom: 14,
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 18,
    flex: 1,
  },
  detailRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
  },
  detailIcon: {
    fontSize: 14,
    flexShrink: 0,
    marginTop: 1,
  },
  detailText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 1.45,
  },
  cardActions: {
    display: 'flex',
    gap: 10,
    marginTop: 4,
  },
  editBtn: {
    flex: 1,
    padding: '9px 0',
    borderRadius: 10,
    border: '1.5px solid #1565C0',
    background: '#fff',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#1565C0',
    fontFamily: 'inherit',
  },
  deleteBtn: {
    flex: 1,
    padding: '9px 0',
    borderRadius: 10,
    border: '1.5px solid #ffcdd2',
    background: '#fff5f5',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#c62828',
    fontFamily: 'inherit',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 0',
    color: '#333',
  },
  emptyIcon: { fontSize: 48, margin: '0 0 16px' },
  emptyTitle: { fontSize: 18, fontWeight: 700, margin: '0 0 8px' },
  confirmBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 999,
    backdropFilter: 'blur(2px)',
  },
  confirmBox: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#fff',
    borderRadius: 20,
    padding: '32px 28px 24px',
    width: '90%',
    maxWidth: 380,
    zIndex: 1000,
    boxShadow: '0 24px 60px rgba(0,0,0,0.16)',
    textAlign: 'center',
  },
  confirmIcon: { fontSize: 36, margin: '0 0 12px' },
  confirmTitle: { fontSize: 18, fontWeight: 700, margin: '0 0 10px', color: '#1a1a1a' },
  confirmSub: { fontSize: 14, color: '#777', margin: '0 0 24px', lineHeight: 1.5 },
  confirmActions: { display: 'flex', gap: 10 },
  confirmCancelBtn: {
    flex: 1,
    padding: '11px 0',
    borderRadius: 12,
    border: '1.5px solid #ddd',
    background: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#555',
    fontFamily: 'inherit',
  },
  confirmDeleteBtn: {
    flex: 1,
    padding: '11px 0',
    borderRadius: 12,
    border: 'none',
    background: '#e53935',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    color: '#fff',
    fontFamily: 'inherit',
    boxShadow: '0 4px 12px rgba(229,57,53,0.3)',
  },
};

export default AdminSuppliers;