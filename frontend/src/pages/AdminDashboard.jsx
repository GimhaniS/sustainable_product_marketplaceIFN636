import { useState } from 'react';
import FilterModal from '../components/FilterModal';
import ProductModal from '../components/ProductModal';

const initialCategories = [
  { id: 1, label: 'Recycle Material',      bg: '#FFF3E0', imageUrl: '/recycle.png'     },
  { id: 3, label: 'Eco Friendly Products', bg: '#FCE4EC', imageUrl: '/EcoFriendly.png' },
  { id: 4, label: 'Eco Fashion',           bg: '#F3E5F5', imageUrl: '/EcoFashion.png'  },
  { id: 5, label: 'Organic Products',      bg: '#E3F2FD', imageUrl: '/organic.png'     },
];

const initialProducts = [
  { id: 1, name: 'Beige Cotton Pant',    price: 24.99, imageUrl: '/CottonPant.png',  categoryId: 4 },
  { id: 2, name: 'Beige Cotton T shirt', price: 34.99, imageUrl: '/CottonT.png',     categoryId: 4 },
  { id: 3, name: 'Eco Friendly Bottle',  price: 49.99, imageUrl: '/EcoBottle.png',   categoryId: 3 },
  { id: 4, name: 'Eco Box',              price: 18.99, imageUrl: '/EcoBox.png',      categoryId: 1 },
  { id: 5, name: 'Eco Folks',            price: 59.99, imageUrl: '/EcoFolks.png',    categoryId: 3 },
  { id: 6, name: 'Eco Kitchen Towel',    price: 27.99, imageUrl: '/EcoKitchen.png',  categoryId: 3 },
  { id: 7, name: 'Eco Plates',           price: 21.99, imageUrl: '/EcoPlates.png',   categoryId: 3 },
  { id: 8, name: 'Eco Spoon',            price: 89.99, imageUrl: '/EcoSpoon.png',    categoryId: 5 },
];

const defaultFilters = { priceRange: [0, 10000], materials: [], colors: [] };

const BG_OPTIONS = ['#FFF3E0', '#FCE4EC', '#F3E5F5', '#E3F2FD', '#E8F5E9', '#FFF9C4', '#F3E5F5', '#E0F7FA'];

const COLOR_HEX = {
  red: '#E53935', blue: '#1E88E5', yellow: '#FDD835', green: '#43A047',
  maroon: '#880E4F', orange: '#FB8C00', purple: '#8E24AA',
  white: '#F5F5F5', black: '#212121', brown: '#6D4C41',
};

const AddCategoryModal = ({ isOpen, onClose, onAdd }) => {
  const [label, setLabel] = useState('');
  const [bg, setBg] = useState(BG_OPTIONS[0]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!label.trim()) return;
    onAdd({ id: Date.now(), label: label.trim(), bg, imageUrl: '/recycle.png' });
    setLabel('');
    setBg(BG_OPTIONS[0]);
    onClose();
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
        {/* Header */}
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

          <div
            style={{
              borderRadius: 12,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1.5px solid rgba(0,0,0,0.06)',
              background: bg,
            }}
          >
            <span style={{ fontSize: 13, color: '#555' }}>Preview</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#333' }}>
              {label || 'Category Name'}
            </span>
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
            disabled={!label.trim()}
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
              opacity: label.trim() ? 1 : 0.5,
              cursor: label.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Add Category
          </button>
        </div>
      </div>
    </>
  );
};

const AdminDashboard = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [addCatOpen, setAddCatOpen] = useState(false);
  const [addProdOpen, setAddProdOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const openEdit = (product) => {
    setEditProduct(product);
    setAddProdOpen(true);
  };

  const closeProductModal = () => {
    setAddProdOpen(false);
    setEditProduct(null);
  };

  const handleAddCategory = (cat) => setCategories(prev => [...prev, cat]);
  const handleDeleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    if (activeCategory === id) setActiveCategory(null);
  };
  const handleAddProduct = (prod) => setProducts(prev => [...prev, prod]);
  const handleUpdateProduct = (updated) =>
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  const handleDeleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));

  const activeFilterCount =
    (appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 10000 ? 1 : 0) +
    appliedFilters.materials.length +
    appliedFilters.colors.length;

  const filteredProducts = products.filter(p => {
    const inPrice    = p.price >= appliedFilters.priceRange[0] && p.price <= appliedFilters.priceRange[1];
    const inCategory = activeCategory === null || p.categoryId === activeCategory;
    const inSearch   = p.name.toLowerCase().includes(search.toLowerCase());
    return inPrice && inCategory && inSearch;
  });

  const filteredCategories = categories.filter(cat =>
    cat.label.toLowerCase().includes(search.toLowerCase())
  );

  const activeCatLabel = activeCategory
    ? categories.find(c => c.id === activeCategory)?.label
    : 'All Products';

  return (
    <div className="mx-auto mt-20">
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 60px' }}>

        <section style={{ textAlign: 'center', padding: '0 0 32px' }}>
          <h1 style={{ fontSize: 38, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-1px' }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: 16, color: '#777', margin: '0 0 28px' }}>
            Manage your categories and products
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              maxWidth: 680,
              margin: '0 auto',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#fff',
                border: '2px solid #616161',
                borderRadius: 50,
                padding: '0 20px',
                flex: 1,
                height: 52,
                gap: 10,
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>🔍</span>
              <input
                type="text"
                placeholder="Search products, categories..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  fontSize: 16,
                  background: 'transparent',
                  fontFamily: 'inherit',
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#999', padding: 4 }}
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setFilterOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                height: 52,
                padding: '0 22px',
                borderRadius: 50,
                border: '2px solid #286934',
                background: '#fff',
                color: '#286934',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 16 }}>⚙️</span>
              Filters
              {activeFilterCount > 0 && (
                <span
                  style={{
                    background: '#286934',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {activeFilterCount > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 16 }}>
              {(appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 10000) && (
                <span style={{ background: '#f0f9f1', border: '1.5px solid #a5d6a7', color: '#286934', fontSize: 13, fontWeight: 500, borderRadius: 50, padding: '4px 14px' }}>
                  ${appliedFilters.priceRange[0]} – ${appliedFilters.priceRange[1]}
                </span>
              )}
              {appliedFilters.materials.map(m => (
                <span key={m} style={{ background: '#f0f9f1', border: '1.5px solid #a5d6a7', color: '#286934', fontSize: 13, fontWeight: 500, borderRadius: 50, padding: '4px 14px' }}>
                  {m}
                </span>
              ))}
              {appliedFilters.colors.map(c => (
                <span key={c} style={{ background: '#f0f9f1', border: '1.5px solid #a5d6a7', color: '#286934', fontSize: 13, fontWeight: 500, borderRadius: 50, padding: '4px 14px' }}>
                  {c}
                </span>
              ))}
              <button
                onClick={() => setAppliedFilters(defaultFilters)}
                style={{ background: 'none', border: '1.5px solid #ddd', color: '#999', fontSize: 13, borderRadius: 50, padding: '4px 14px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Clear all ✕
              </button>
            </div>
          )}
        </section>

        <section style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
              Shop By Category
            </h2>
            <button
              onClick={() => setAddCatOpen(true)}
              style={{
                padding: '9px 20px',
                borderRadius: 50,
                border: 'none',
                background: '#286934',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 3px 10px rgba(40,105,52,0.25)',
              }}
            >
              + Add Category
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
              gap: '30px 8px',
            }}
          >
            <button
              onClick={() => setActiveCategory(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 4, borderRadius: 12 }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#F5F5F5',
                  boxShadow: activeCategory === null ? '0 0 0 3px #286934' : '0 2px 12px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: 32 }}>🌿</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, textAlign: 'center', color: '#333', lineHeight: 1.3 }}>
                All
              </span>
            </button>

            {filteredCategories.map(cat => (
              <div
                key={cat.id}
                style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <button
                  onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 4, borderRadius: 12 }}
                >
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: cat.bg,
                      boxShadow: activeCategory === cat.id
                        ? '0 0 0 3px #286934'
                        : '0 2px 12px rgba(21,235,103,0.08)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <img src={cat.imageUrl} alt={cat.label} style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, textAlign: 'center', color: '#333', lineHeight: 1.3, maxWidth: 90 }}>
                    {cat.label}
                  </span>
                </button>

                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  title="Remove category"
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: 6,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    border: '1.5px solid #ffcdd2',
                    background: '#fff5f5',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#c62828',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
              {activeCatLabel}
            </h2>
            <span style={{ fontSize: 13, color: '#999', display: 'block', marginTop: 2 }}>
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={() => { setEditProduct(null); setAddProdOpen(true); }}
            style={{
              padding: '9px 20px',
              borderRadius: 50,
              border: 'none',
              background: '#286934',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 3px 10px rgba(40,105,52,0.25)',
            }}
          >
            + Add Product
          </button>
        </div>

        {filteredProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            {filteredProducts.map(product => (
              <div
                key={product.id}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  border: '1px solid #eee',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  title="Delete product"
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: '#fff5f5',
                    border: '1px solid #ffcdd2',
                    borderRadius: 8,
                    width: 32,
                    height: 32,
                    fontSize: 14,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}
                >
                  🗑
                </button>

                <div style={{ width: '100%', aspectRatio: '1 / 1', background: '#f5f5f5', overflow: 'hidden' }}>
                  <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>

                <div style={{ padding: '12px 14px 8px', flex: 1 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3 }}>
                    {product.name}
                  </p>
                  <p style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: '#2e7d32' }}>
                    ${product.price.toFixed(2)}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                    {product.materialCategory && (
                      <span
                        style={{
                          background: '#f0f9f1',
                          color: '#286934',
                          fontSize: 10,
                          fontWeight: 600,
                          borderRadius: 20,
                          padding: '3px 8px',
                          textTransform: 'capitalize',
                          border: '1px solid #c8e6c9',
                        }}
                      >
                        {product.materialCategory.replace(/_/g, ' ')}
                      </span>
                    )}
                    {product.colors && product.colors.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        {product.colors.slice(0, 4).map(c => (
                          <span
                            key={c}
                            title={c}
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              display: 'inline-block',
                              background: COLOR_HEX[c] ?? '#ccc',
                              border: '1px solid rgba(0,0,0,0.1)',
                            }}
                          />
                        ))}
                        {product.colors.length > 4 && (
                          <span style={{ fontSize: 10, color: '#999', fontWeight: 600 }}>
                            +{product.colors.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => openEdit(product)}
                  style={{
                    margin: '0 14px 14px',
                    padding: '9px 0',
                    borderRadius: 8,
                    border: '1.5px solid #1565C0',
                    background: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#1565C0',
                    fontFamily: 'inherit',
                  }}
                >
                  ✏️ Edit
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#333' }}>
            <p style={{ fontSize: 40, margin: '0 0 12px' }}>🌿</p>
            <p style={{ fontWeight: 700, fontSize: 17, margin: '0 0 6px' }}>No products found</p>
            <p style={{ color: '#999', fontSize: 14, margin: '0 0 20px' }}>
              Try adjusting filters or add a new product
            </p>
            <button
              onClick={() => { setEditProduct(null); setAddProdOpen(true); }}
              style={{
                padding: '9px 20px',
                borderRadius: 50,
                border: 'none',
                background: '#286934',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 3px 10px rgba(40,105,52,0.25)',
              }}
            >
              + Add Product
            </button>
          </div>
        )}
      </main>

      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={setAppliedFilters}
        initialFilters={appliedFilters}
      />

      <AddCategoryModal
        isOpen={addCatOpen}
        onClose={() => setAddCatOpen(false)}
        onAdd={handleAddCategory}
      />

      <ProductModal
        isOpen={addProdOpen}
        onClose={closeProductModal}
        onAdd={handleAddProduct}
        onUpdate={handleUpdateProduct}
        product={editProduct}
      />
    </div>
  );
};

export default AdminDashboard;