import { useState, useEffect, useRef } from 'react';

const MATERIAL_CATEGORIES = [
  { id: 'eco_friendly',        label: '🌿 Eco Friendly Material' },
  { id: 'recycled',            label: '♻️ Recycled Products' },
  { id: 'sustainable_fashion', label: '👗 Sustainable Fashion' },
  { id: 'plastic_free',        label: '🚫 Plastic Free Products' },
  { id: 'organic',             label: '🌱 Organic Products' },
];

const COLOR_OPTIONS = [
  { id: 'red',    label: 'Red',    hex: '#E53935' },
  { id: 'blue',   label: 'Blue',   hex: '#1E88E5' },
  { id: 'yellow', label: 'Yellow', hex: '#FDD835' },
  { id: 'green',  label: 'Green',  hex: '#43A047' },
  { id: 'maroon', label: 'Maroon', hex: '#880E4F' },
  { id: 'orange', label: 'Orange', hex: '#FB8C00' },
  { id: 'purple', label: 'Purple', hex: '#8E24AA' },
  { id: 'white',  label: 'White',  hex: '#F5F5F5' },
  { id: 'black',  label: 'Black',  hex: '#212121' },
  { id: 'brown',  label: 'Brown',  hex: '#6D4C41' },
];

const ProductModal = ({ isOpen, onClose, onAdd, onUpdate, product = null }) => {
  const isEditMode = Boolean(product);
  const fileInputRef = useRef(null);

  const [name,             setName]    = useState('');
  const [description,      setDesc]    = useState('');
  const [price,            setPrice]   = useState('');
  const [supplierLicense,  setLicense] = useState('');
  const [images,           setImages]  = useState([]);
  const [imageUrlInput,    setUrlInput]= useState('');
  const [materialCategory, setMatCat]  = useState('');
  const [selectedColors,   setColors]  = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    if (product) {
      setName(product.name ?? '');
      setDesc(product.description ?? '');
      setPrice(product.price != null ? String(product.price) : '');
      setLicense(product.supplierLicense ?? '');
      setImages((product.images ?? (product.imageUrl ? [product.imageUrl] : [])).map(url => ({ url })));
      setMatCat(product.materialCategory ?? '');
      setColors(product.colors ?? []);
    } else {
      resetFields();
    }
  }, [isOpen, product]);

  const resetFields = () => {
    setName(''); setDesc(''); setPrice(''); setLicense('');
    setImages([]); setUrlInput(''); setMatCat(''); setColors([]);
  };

  const isValid = name.trim() && price && materialCategory;

  const addImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url || images.length >= 5) return;
    setImages(prev => [...prev, { url }]);
    setUrlInput('');
  };

  const handleFileChange = (e) => {
    Array.from(e.target.files).forEach(file => {
      if (images.length >= 5) return;
      setImages(prev => [...prev, { url: URL.createObjectURL(file), file }]);
    });
    e.target.value = '';
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const toggleColor = (id) =>
    setColors(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const handleSubmit = () => {
    if (!isValid) return;
    const payload = {
      id:              product?.id ?? Date.now(),
      name:            name.trim(),
      description:     description.trim(),
      price:           parseFloat(price),
      supplierLicense: supplierLicense.trim(),
      images:          images.map(i => i.url),
      imageUrl:        images[0]?.url ?? product?.imageUrl ?? '/EcoBox.png',
      materialCategory,
      colors:          selectedColors,
    };
    isEditMode ? onUpdate(payload) : onAdd(payload);
    resetFields();
    onClose();
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
              {isEditMode ? '✏️' : '📦'}
            </div>
            <div>
              <h2 style={styles.title}>
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p style={styles.subtitle}>
                {isEditMode ? `Editing "${product.name}"` : 'Fill in the product details below'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.body}>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Product Name <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Bamboo Toothbrush"
              value={name}
              onChange={e => setName(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              placeholder="Describe the product — materials, use, benefits..."
              value={description}
              onChange={e => setDesc(e.target.value)}
              rows={3}
              style={styles.textarea}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Price (USD) <span style={styles.required}>*</span>
            </label>
            <div style={styles.inputPrefixWrap}>
              <span style={styles.prefixText}>$</span>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                style={{ ...styles.input, paddingLeft: 32 }}
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Supplier License</label>
            <input
              type="text"
              placeholder="e.g. LIC-2024-00123"
              value={supplierLicense}
              onChange={e => setLicense(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Material Category <span style={styles.required}>*</span>
            </label>
            <div style={styles.catGrid}>
              {MATERIAL_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setMatCat(cat.id)}
                  style={{
                    ...styles.catChip,
                    ...(materialCategory === cat.id ? styles.catChipActive : {}),
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Available Colors</label>
            <div style={styles.colorRow}>
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c.id}
                  title={c.label}
                  onClick={() => toggleColor(c.id)}
                  style={{
                    ...styles.colorSwatch,
                    background: c.hex,
                    border: selectedColors.includes(c.id)
                      ? '3px solid #286934'
                      : c.id === 'white' ? '2px solid #ccc' : '2px solid transparent',
                    boxShadow: selectedColors.includes(c.id)
                      ? '0 0 0 2px #fff, 0 0 0 4px #286934'
                      : 'none',
                  }}
                />
              ))}
            </div>
            {selectedColors.length > 0 && (
              <p style={styles.colorLabels}>
                Selected: {selectedColors.map(id => COLOR_OPTIONS.find(c => c.id === id)?.label).join(', ')}
              </p>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Product Images ({images.length}/5)
            </label>
            <div style={styles.imageActions}>
              <button onClick={() => fileInputRef.current?.click()} style={styles.uploadBtn}>
                📁 Upload File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <div style={styles.urlRow}>
                <input
                  type="text"
                  placeholder="Or paste image URL..."
                  value={imageUrlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addImageUrl()}
                  style={{ ...styles.input, flex: 1 }}
                />
                <button
                  onClick={addImageUrl}
                  disabled={!imageUrlInput.trim() || images.length >= 5}
                  style={styles.addUrlBtn}
                >
                  Add
                </button>
              </div>
            </div>

            {images.length > 0 && (
              <div style={styles.imgGrid}>
                {images.map((img, idx) => (
                  <div key={idx} style={styles.imgThumbWrap}>
                    <img
                      src={img.url}
                      alt={`img-${idx}`}
                      style={styles.imgThumb}
                      onError={e => { e.target.src = '/EcoBox.png'; }}
                    />
                    {idx === 0 && <span style={styles.primaryBadge}>Main</span>}
                    <button onClick={() => removeImage(idx)} style={styles.removeImgBtn}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p style={styles.requiredNote}>
            <span style={styles.required}>*</span> Required fields
          </p>

        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            style={{
              ...styles.confirmBtn,
              background: isEditMode ? '#1565C0' : '#286934',
              boxShadow: isEditMode
                ? '0 4px 14px rgba(21,101,192,0.3)'
                : '0 4px 14px rgba(40,105,52,0.3)',
              opacity: isValid ? 1 : 0.5,
              cursor: isValid ? 'pointer' : 'not-allowed',
            }}
          >
            {isEditMode ? '💾 Save Changes' : '+ Add Product'}
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
    maxWidth: 520,
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
  required: {
    color: '#e53935',
  },
  requiredNote: {
    fontSize: 12,
    color: '#bbb',
    margin: 0,
  },
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
  inputPrefixWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  prefixText: {
    position: 'absolute',
    left: 13,
    fontSize: 14,
    fontWeight: 600,
    color: '#888',
    pointerEvents: 'none',
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
  catGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    padding: '8px 14px',
    borderRadius: 20,
    border: '1.5px solid #ddd',
    background: '#fafafa',
    fontSize: 13,
    fontFamily: 'inherit',
    cursor: 'pointer',
    color: '#444',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
  },
  catChipActive: {
    border: '1.5px solid #286934',
    background: '#f0f9f1',
    color: '#286934',
    fontWeight: 600,
  },
  colorRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    cursor: 'pointer',
    padding: 0,
    flexShrink: 0,
    transition: 'box-shadow 0.15s, border 0.15s',
  },
  colorLabels: {
    fontSize: 12,
    color: '#666',
    margin: '4px 0 0',
  },
  imageActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  uploadBtn: {
    padding: '10px 16px',
    borderRadius: 10,
    border: '1.5px dashed #bbb',
    background: '#fafafa',
    fontSize: 13,
    fontFamily: 'inherit',
    cursor: 'pointer',
    color: '#555',
    alignSelf: 'flex-start',
  },
  urlRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  addUrlBtn: {
    padding: '11px 18px',
    borderRadius: 10,
    border: 'none',
    background: '#286934',
    color: '#fff',
    fontSize: 13,
    fontFamily: 'inherit',
    cursor: 'pointer',
    fontWeight: 600,
    flexShrink: 0,
  },
  imgGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  imgThumbWrap: {
    position: 'relative',
    width: 72,
    height: 72,
  },
  imgThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 10,
    border: '1.5px solid #e0e0e0',
    background: '#f5f5f5',
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    background: '#286934',
    color: '#fff',
    fontSize: 9,
    fontWeight: 700,
    padding: '2px 5px',
    borderRadius: 4,
    letterSpacing: '0.3px',
  },
  removeImgBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#e53935',
    color: '#fff',
    border: 'none',
    fontSize: 10,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
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

export default ProductModal;