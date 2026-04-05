import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../axiosConfig';

const SupplierModal = ({ isOpen, onClose, onSaved, supplier = null }) => {
  const isEditMode = Boolean(supplier);
  const fileInputRef = useRef(null);

  const [name,          setName]       = useState('');
  const [licenseNumber, setLicense]    = useState('');
  const [contactNo,     setContact]    = useState('');
  const [address,       setAddress]    = useState('');
  const [logoUrl,       setLogoUrl]    = useState('');
  const [logoPreview,   setLogoPreview] = useState('');
  const [loading,       setLoading]    = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (supplier) {
      setName(supplier.name ?? '');
      setLicense(supplier.licenseNumber ?? '');
      setContact(supplier.contactNo ?? '');
      setAddress(supplier.address ?? '');
      setLogoUrl(supplier.logoUrl ?? '');
      setLogoPreview(supplier.logoUrl ?? '');
    } else {
      resetFields();
    }
  }, [isOpen, supplier]);

  const resetFields = () => {
    setName('');
    setLicense('');
    setContact('');
    setAddress('');
    setLogoUrl('');
    setLogoPreview('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
    setLogoUrl(url);
    e.target.value = '';
  };

  const handleLogoUrlChange = (e) => {
    setLogoUrl(e.target.value);
    setLogoPreview(e.target.value);
  };

  const isValid = name.trim() && licenseNumber.trim() && contactNo.trim();

  const handleSubmit = async () => {
    if (!isValid) return;
    const payload = {
      name:          name.trim(),
      licenseNumber: licenseNumber.trim(),
      contactNo:     contactNo.trim(),
      address:       address.trim(),
      logoUrl:       logoUrl.trim() || null,
    };

    try {
      setLoading(true);
      if (isEditMode) {
        await axiosInstance.put(`/api/suppliers/${supplier._id}`, payload);
      } else {
        await axiosInstance.post('/api/suppliers', payload);
      }
      onSaved();      // tell parent to re-fetch
      resetFields();
      onClose();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message ?? 'Something went wrong';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div style={styles.backdrop} onClick={onClose} />

      <div style={styles.modal}>

        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div
              style={{
                ...styles.headerIcon,
                background: isEditMode ? '#fff8e1' : '#f0f9f1',
                border: `1.5px solid ${isEditMode ? '#ffe082' : '#c8e6c9'}`,
              }}
            >
              {isEditMode ? '✏️' : '🏭'}
            </div>
            <div>
              <h2 style={styles.title}>
                {isEditMode ? 'Edit Supplier' : 'Add New Supplier'}
              </h2>
              <p style={styles.subtitle}>
                {isEditMode
                  ? `Editing "${supplier.name}"`
                  : 'Fill in the supplier details below'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.body}>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Supplier Logo</label>
            <div style={styles.logoSection}>
              <div style={styles.logoPreviewBox}>
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="logo preview"
                    style={styles.logoPreviewImg}
                    onError={() => setLogoPreview('')}
                  />
                ) : (
                  <span style={styles.logoPlaceholder}>🏭</span>
                )}
              </div>
              <div style={styles.logoInputs}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={styles.uploadBtn}
                >
                  📁 Upload Logo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <input
                  type="text"
                  placeholder="Or paste logo URL..."
                  value={logoUrl}
                  onChange={handleLogoUrlChange}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Supplier Name <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. GreenLeaf Supplies Co."
              value={name}
              onChange={e => setName(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              License Number <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. LIC-2024-00123"
              value={licenseNumber}
              onChange={e => setLicense(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Contact No. <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. +1 (555) 000-1234"
              value={contactNo}
              onChange={e => setContact(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Address</label>
            <textarea
              placeholder="e.g. 42 Eco Street, Green City, CA 90210"
              value={address}
              onChange={e => setAddress(e.target.value)}
              rows={3}
              style={styles.textarea}
            />
          </div>

          <p style={styles.requiredNote}>
            <span style={styles.required}>*</span> Required fields
          </p>

        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.cancelBtn}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            style={{
              ...styles.confirmBtn,
              background: isEditMode ? '#1565C0' : '#286934',
              boxShadow: isEditMode
                ? '0 4px 14px rgba(21,101,192,0.3)'
                : '0 4px 14px rgba(40,105,52,0.3)',
              opacity: isValid && !loading ? 1 : 0.5,
              cursor: isValid && !loading ? 'pointer' : 'not-allowed',
            }}
          >
            {loading
              ? 'Saving...'
              : isEditMode ? '💾 Save Changes' : '+ Add Supplier'}
          </button>
        </div>

      </div>
    </>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    zIndex: 999,
    backdropFilter: 'blur(3px)',
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#fff',
    borderRadius: 22,
    width: '94%',
    maxWidth: 500,
    maxHeight: '92vh',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 24px 14px',
    borderBottom: '1px solid #f0f0f0',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    flexShrink: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    margin: 0,
    letterSpacing: '-0.4px',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 12,
    color: '#aaa',
    margin: '2px 0 0',
  },
  closeBtn: {
    background: '#f5f5f5',
    border: 'none',
    borderRadius: '50%',
    width: 32,
    height: 32,
    fontSize: 13,
    cursor: 'pointer',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  body: {
    overflowY: 'auto',
    padding: '20px 24px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#333',
  },
  required: { color: '#e53935' },
  requiredNote: { fontSize: 12, color: '#bbb', margin: 0 },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '11px 14px',
    border: '1.5px solid #e5e5e5',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'inherit',
    color: '#1a1a1a',
    background: '#fafafa',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '11px 14px',
    border: '1.5px solid #e5e5e5',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'inherit',
    color: '#1a1a1a',
    background: '#fafafa',
    outline: 'none',
    resize: 'vertical',
    lineHeight: 1.55,
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  logoPreviewBox: {
    width: 72,
    height: 72,
    borderRadius: 14,
    border: '1.5px solid #e5e5e5',
    background: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  logoPreviewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  logoPlaceholder: { fontSize: 28 },
  logoInputs: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
  },
  uploadBtn: {
    padding: '9px 14px',
    borderRadius: 10,
    border: '1.5px dashed #bbb',
    background: '#fafafa',
    fontSize: 13,
    fontFamily: 'inherit',
    cursor: 'pointer',
    color: '#555',
    alignSelf: 'flex-start',
  },
  footer: {
    display: 'flex',
    gap: 12,
    padding: '16px 24px',
    borderTop: '1px solid #f0f0f0',
    flexShrink: 0,
  },
  cancelBtn: {
    flex: 1,
    padding: '12px 0',
    borderRadius: 12,
    border: '1.5px solid #ddd',
    background: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#555',
    fontFamily: 'inherit',
  },
  confirmBtn: {
    flex: 2,
    padding: '12px 0',
    borderRadius: 12,
    border: 'none',
    fontSize: 14,
    fontWeight: 700,
    color: '#fff',
    fontFamily: 'inherit',
    transition: 'opacity 0.15s',
  },
};

export default SupplierModal;