import { useState, useEffect } from 'react';
import FilterModal from '../components/FilterModal';
import ProductModal from '../components/ProductModal';
import axiosInstance from '../axiosConfig';

const initialCategories = [
  { id: 1, label: 'Recycle Material', bg: '#FFF3E0', imageUrl: '/recycle.png' },
  { id: 3, label: 'Eco Friendly Products', bg: '#FCE4EC', imageUrl: '/EcoFriendly.png' },
  { id: 4, label: 'Eco Fashion', bg: '#F3E5F5', imageUrl: '/EcoFashion.png' },
  { id: 5, label: 'Organic Products', bg: '#E3F2FD', imageUrl: '/organic.png' },
];

const defaultFilters = { priceRange: [0, 10000], materials: [], colors: [] };

const COLOR_HEX = {
  red: '#E53935', blue: '#1E88E5', yellow: '#FDD835', green: '#43A047',
  maroon: '#880E4F', orange: '#FB8C00', purple: '#8E24AA',
  white: '#F5F5F5', black: '#212121', brown: '#6D4C41',
};

const AdminDashboard = () => {
  const [categories, setCategories] = useState(initialCategories);

  // 🔥 FIXED: products from API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const [addProdOpen, setAddProdOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // ================= FETCH =================
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

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= CRUD =================

  const handleAddProduct = async (prod) => {
    try {
      console.log("prod",prod);
      
      await axiosInstance.post('/api/products', prod);
      fetchProducts();
    } catch (error) {
      alert('Add failed',error);
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

  // ================= UI =================

  const openEdit = (product) => {
    setEditProduct(product);
    setAddProdOpen(true);
  };

  const closeProductModal = () => {
    setAddProdOpen(false);
    setEditProduct(null);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto mt-20">
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 60px' }}>

        <h1 style={{ fontSize: 32, fontWeight: 700 }}>Admin Dashboard</h1>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 10, width: '100%', marginBottom: 20 }}
        />

        <button
          onClick={() => { setEditProduct(null); setAddProdOpen(true); }}
          style={{
            marginBottom: 20,
            padding: '10px 20px',
            background: '#286934',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
          }}
        >
          + Add Product
        </button>

        {loading && <p>Loading...</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 20 }}>
          {filteredProducts.map(product => (
            <div key={product._id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 10 }}>

              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: '100%', height: 150, objectFit: 'cover' }}
              />

              <h3>{product.name}</h3>
              <p>${product.price}</p>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => openEdit(product)}>Edit</button>
                <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

      </main>

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