import { useState, useEffect } from 'react';

const sustainableMaterials = [
  'Eco Friendly Materials',
  'Sustainable Fashion',
  'Recycled Products',
  'Organic Products',
  'Plastic Free Products',
];

const colors = [
  { label: 'Red',    hex: '#E53935' },
  { label: 'Blue',   hex: '#1E88E5' },
  { label: 'Yellow', hex: '#FDD835' },
  { label: 'Green',  hex: '#43A047' },
  { label: 'Maroon', hex: '#880E4F' },
  { label: 'Pink',   hex: '#F06292' },
  { label: 'Teal',   hex: '#00897B' },
  { label: 'Indigo', hex: '#3949AB' },
  { label: 'Black',  hex: '#212121' },
  { label: 'White',  hex: '#F5F5F5' },
  { label: 'Beige',  hex: '#D7CCC8' },
];

const FilterModal = ({ isOpen, onClose, onApply, initialFilters }) => {
  const [priceRange, setPriceRange]         = useState(initialFilters?.priceRange   ?? [0, 10000]);
  const [selectedMaterials, setMaterials]   = useState(initialFilters?.materials    ?? []);
  const [selectedColors, setColors]         = useState(initialFilters?.colors       ?? []);

  useEffect(() => {
    if (initialFilters) {
      setPriceRange(initialFilters.priceRange ?? [0, 10000]);
      setMaterials(initialFilters.materials   ?? []);
      setColors(initialFilters.colors         ?? []);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleItem = (list, setList, value) =>
    setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);

  const handleReset = () => {
    setPriceRange([0, 10000]);
    setMaterials([]);
    setColors([]);
  };

  const handleApply = () => {
    onApply({ priceRange, materials: selectedMaterials, colors: selectedColors });
    onClose();
  };

  const activeCount =
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) +
    selectedMaterials.length +
    selectedColors.length;

  return (
    <>
      <div style={styles.backdrop} onClick={onClose} />

      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={styles.filterIcon}>⚙️</span>
            <h2 style={styles.title}>Filters</h2>
            {activeCount > 0 && (
              <span style={styles.badge}>{activeCount}</span>
            )}
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.body}>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Price Range</h3>
            <div style={styles.priceLabels}>
              <span style={styles.priceTag}>${priceRange[0].toLocaleString()}</span>
              <span style={styles.priceTag}>${priceRange[1].toLocaleString()}</span>
            </div>

            <div style={styles.sliderWrap}>
              <span style={styles.sliderLabel}>Min</span>
              <input
                type="range"
                min={0} max={10000} step={50}
                value={priceRange[0]}
                onChange={e => {
                  const val = Math.min(Number(e.target.value), priceRange[1] - 50);
                  setPriceRange([val, priceRange[1]]);
                }}
                style={styles.slider}
              />
            </div>

            <div style={styles.sliderWrap}>
              <span style={styles.sliderLabel}>Max</span>
              <input
                type="range"
                min={0} max={10000} step={50}
                value={priceRange[1]}
                onChange={e => {
                  const val = Math.max(Number(e.target.value), priceRange[0] + 50);
                  setPriceRange([priceRange[0], val]);
                }}
                style={styles.slider}
              />
            </div>

            <div style={styles.priceInputRow}>
              <div style={styles.priceInputWrap}>
                <span style={styles.priceInputLabel}>Min $</span>
                <input
                  type="number" min={0} max={9950} step={50}
                  value={priceRange[0]}
                  onChange={e => {
                    const val = Math.min(Number(e.target.value), priceRange[1] - 50);
                    setPriceRange([Math.max(0, val), priceRange[1]]);
                  }}
                  style={styles.priceInput}
                />
              </div>
              <span style={styles.priceDash}>—</span>
              <div style={styles.priceInputWrap}>
                <span style={styles.priceInputLabel}>Max $</span>
                <input
                  type="number" min={50} max={10000} step={50}
                  value={priceRange[1]}
                  onChange={e => {
                    const val = Math.max(Number(e.target.value), priceRange[0] + 50);
                    setPriceRange([priceRange[0], Math.min(10000, val)]);
                  }}
                  style={styles.priceInput}
                />
              </div>
            </div>
          </section>

          <div style={styles.divider} />

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Sustainable Material</h3>
            <div style={styles.checkList}>
              {sustainableMaterials.map(mat => {
                const checked = selectedMaterials.includes(mat);
                return (
                  <label key={mat} style={styles.checkRow}>
                    <div
                      style={{
                        ...styles.customCheck,
                        background: checked ? '#286934' : '#fff',
                        borderColor: checked ? '#286934' : '#ccc',
                      }}
                      onClick={() => toggleItem(selectedMaterials, setMaterials, mat)}
                    >
                      {checked && <span style={styles.checkMark}>✓</span>}
                    </div>
                    <input
                      type="checkbox" checked={checked}
                      onChange={() => toggleItem(selectedMaterials, setMaterials, mat)}
                      style={{ display: 'none' }}
                    />
                    <span style={styles.checkLabel}>{mat}</span>
                  </label>
                );
              })}
            </div>
          </section>

          <div style={styles.divider} />

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Color</h3>
            <div style={styles.colorGrid}>
              {colors.map(({ label, hex }) => {
                const active = selectedColors.includes(label);
                return (
                  <button
                    key={label}
                    onClick={() => toggleItem(selectedColors, setColors, label)}
                    style={styles.colorBtn}
                    title={label}
                  >
                    <div
                      style={{
                        ...styles.colorSwatch,
                        background: hex,
                        border: active ? '3px solid #286934' : '2px solid #ddd',
                        boxShadow: active ? '0 0 0 2px #286934' : 'none',
                      }}
                    />
                    <span style={{ ...styles.colorLabel, fontWeight: active ? 700 : 400 }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div style={styles.footer}>
          <button onClick={handleReset} style={styles.resetBtn}>Reset All</button>
          <button onClick={handleApply} style={styles.applyBtn}>
            Apply Filters {activeCount > 0 && `(${activeCount})`}
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
    borderRadius: 20,
    width: '90%', maxWidth: 480,
    maxHeight: '88vh',
    display: 'flex', flexDirection: 'column',
    zIndex: 1000,
    boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px 16px',
    borderBottom: '1px solid #f0f0f0',
    flexShrink: 0,
  },
  filterIcon: { fontSize: 20 },
  title: { fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' },
  badge: {
    background: '#286934', color: '#fff',
    fontSize: 12, fontWeight: 700,
    borderRadius: 50, width: 22, height: 22,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  closeBtn: {
    background: '#f5f5f5', border: 'none',
    borderRadius: 50, width: 32, height: 32,
    fontSize: 14, cursor: 'pointer', color: '#555',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  body: {
    overflowY: 'auto',
    padding: '4px 24px',
    flex: 1,
  },
  section: { padding: '20px 0' },
  sectionTitle: {
    fontSize: 15, fontWeight: 700, margin: '0 0 16px',
    color: '#1a1a1a', letterSpacing: '-0.3px',
  },
  divider: { height: 1, background: '#f0f0f0', margin: '0 -24px' },

  priceLabels: {
    display: 'flex', justifyContent: 'space-between', marginBottom: 12,
  },
  priceTag: {
    fontSize: 15, fontWeight: 700, color: '#286934',
    background: '#f0f9f1', padding: '4px 12px', borderRadius: 8,
  },
  sliderWrap: {
    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10,
  },
  sliderLabel: { fontSize: 12, color: '#999', width: 26, flexShrink: 0 },
  slider: { flex: 1, accentColor: '#286934', height: 4, cursor: 'pointer' },
  priceInputRow: {
    display: 'flex', alignItems: 'center', gap: 12, marginTop: 14,
  },
  priceInputWrap: {
    flex: 1, position: 'relative',
    border: '1.5px solid #ddd', borderRadius: 10,
    padding: '8px 12px', background: '#fafafa',
  },
  priceInputLabel: { fontSize: 11, color: '#999', display: 'block', marginBottom: 2 },
  priceInput: {
    border: 'none', outline: 'none', background: 'transparent',
    fontSize: 15, fontWeight: 600, width: '100%', fontFamily: 'inherit',
  },
  priceDash: { fontSize: 18, color: '#ccc', flexShrink: 0 },

  checkList: { display: 'flex', flexDirection: 'column', gap: 12 },
  checkRow: {
    display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
  },
  customCheck: {
    width: 20, height: 20, borderRadius: 6,
    border: '2px solid #ccc', flexShrink: 0, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s',
  },
  checkMark: { color: '#fff', fontSize: 12, fontWeight: 700 },
  checkLabel: { fontSize: 14, color: '#333', userSelect: 'none' },

  colorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
    gap: '14px 8px',
  },
  colorBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    padding: 2,
  },
  colorSwatch: {
    width: 36, height: 36, borderRadius: '50%',
    transition: 'all 0.15s ease',
  },
  colorLabel: { fontSize: 11, color: '#555', textAlign: 'center' },

  footer: {
    display: 'flex', gap: 12,
    padding: '16px 24px',
    borderTop: '1px solid #f0f0f0',
    flexShrink: 0,
  },
  resetBtn: {
    flex: 1, padding: '12px 0', borderRadius: 12,
    border: '1.5px solid #ddd', background: '#fff',
    fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#555',
    fontFamily: 'inherit',
  },
  applyBtn: {
    flex: 2, padding: '12px 0', borderRadius: 12,
    border: 'none', background: '#286934',
    fontSize: 14, fontWeight: 700, cursor: 'pointer', color: '#fff',
    fontFamily: 'inherit',
    boxShadow: '0 4px 12px rgba(40,105,52,0.3)',
  },
};

export default FilterModal;