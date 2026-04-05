import { useState, useEffect } from 'react';
import FilterModal from '../components/FilterModal';
import ProductModal from '../components/ProductModal';
import AddCategoryModal from '../components/AddCategoryModal';
import axiosInstance from '../axiosConfig';

const defaultFilters = { priceRange: [0, 10000], materials: [], colors: [] };

const COLOR_HEX = {
  red: '#E53935', blue: '#1E88E5', yellow: '#FDD835', green: '#43A047',
  maroon: '#880E4F', orange: '#FB8C00', purple: '#8E24AA',
  white: '#F5F5F5', black: '#212121', brown: '#6D4C41',
};

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [addCatOpen, setAddCatOpen] = useState(false);
  const [addProdOpen, setAddProdOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // ─── Category API ──────────────────────────────────────────────────────────

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load categories');
    }
  };

  // Called by AddCategoryModal after a successful POST — just re-fetch
  const handleCategoryAdded = () => fetchCategories();

  const handleDeleteCategory = async (id) => {
    try {
      await axiosInstance.delete(`/api/categories/${id}`);
      if (activeCategory === id) setActiveCategory(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert('Failed to delete category');
    }
  };

  // ─── Product API ───────────────────────────────────────────────────────────

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (prod) => {
    try {
      await axiosInstance.post('/api/products', prod);
      fetchProducts();
    } catch (error) {
      alert('Add failed', error);
    }
  };

  const handleUpdateProduct = async (updated) => {
    try {
      await axiosInstance.put(`/api/products/${updated._id}`, updated);
      fetchProducts();
    } catch {
      alert('Update failed');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axiosInstance.delete(`/api/products/${id}`);
      fetchProducts();
    } catch {
      alert('Delete failed');
    }
  };

  // ─── Bootstrap ────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // ─── Derived state ────────────────────────────────────────────────────────

  const openEdit = (product) => { setEditProduct(product); setAddProdOpen(true); };
  const closeProductModal = () => { setAddProdOpen(false); setEditProduct(null); };

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
    ? categories.find(c => c._id === activeCategory)?.label
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
                key={cat._id}
                style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <button
                  onClick={() => setActiveCategory(cat._id === activeCategory ? null : cat._id)}
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
                      boxShadow: activeCategory === cat._id
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
                  onClick={() => handleDeleteCategory(cat._id)}
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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
            <p style={{ fontSize: 16 }}>Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            {filteredProducts.map(product => (
              <div
                key={product._id}
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
                  onClick={() => handleDeleteProduct(product._id)}
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
        onAdded={handleCategoryAdded}
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