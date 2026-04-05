import { useState } from 'react';
import axiosInstance from '../axiosConfig';

const BG_OPTIONS = ['#FFF3E0', '#FCE4EC', '#F3E5F5', '#E3F2FD', '#E8F5E9', '#FFF9C4', '#F3E5F5', '#E0F7FA'];

const AddCategoryModal = ({ isOpen, onClose, onAdded }) => {
  const [label, setLabel] = useState('');
  const [bg, setBg] = useState(BG_OPTIONS[0]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (!label.trim()) return;
    try {
      setLoading(true);
      await axiosInstance.post('/api/categories', {
        label: label.trim(),
        bg,
        imageUrl: '/recycle.png',
      });
      onAdded();       
      setLabel('');
      setBg(BG_OPTIONS[0]);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.42)',
          zIndex: 999,
          backdropFilter: 'blur(2px)',
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          borderRadius: 20,
          width: '92%',
          maxWidth: 440,
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          boxShadow: '0 24px 60px rgba(0,0,0,0.16)',
          overflow: 'hidden',
        }}
      >
  
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px 16px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <h2 style={{ fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>
            Add Category
          </h2>
          <button
            onClick={onClose}
            style={{
              background: '#f5f5f5',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              fontSize: 14,
              cursor: 'pointer',
              color: '#555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <label
            style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 8 }}
          >
            Category Name
          </label>
          <input
            type="text"
            placeholder="e.g. Zero Waste"
            value={label}
            onChange={e => setLabel(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '11px 14px',
              border: '1.5px solid #e0e0e0',
              borderRadius: 10,
              fontSize: 14,
              fontFamily: 'inherit',
              color: '#1a1a1a',
              background: '#fafafa',
              outline: 'none',
            }}
          />

          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#555',
              display: 'block',
              marginBottom: 8,
              marginTop: 18,
            }}
          >
            Background Colour
          </label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
            {BG_OPTIONS.map(c => (
              <button
                key={c}
                onClick={() => setBg(c)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: c,
                  border: bg === c ? '3px solid #286934' : '2px solid #ddd',
                  boxShadow: bg === c ? '0 0 0 2px #286934' : 'none',
                  transition: 'all 0.15s',
                }}
              />
            ))}
          </div>

         
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            padding: '16px 24px',
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <button
            onClick={onClose}
            style={{
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
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!label.trim() || loading}
            style={{
              flex: 2,
              padding: '12px 0',
              borderRadius: 12,
              border: 'none',
              background: '#286934',
              fontSize: 14,
              fontWeight: 700,
              color: '#fff',
              fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(40,105,52,0.28)',
              opacity: label.trim() && !loading ? 1 : 0.5,
              cursor: label.trim() && !loading ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddCategoryModal;