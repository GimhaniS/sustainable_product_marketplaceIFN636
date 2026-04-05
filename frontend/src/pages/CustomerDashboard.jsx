import { useState, useEffect } from "react";
import FilterModal from "../components/FilterModal";
import axiosInstance from "../axiosConfig";

const defaultFilters = { priceRange: [0, 10000], materials: [], colors: [] };

const CustomerDashboard = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load categories");
    }
  };
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredProducts = products.filter((p) => {
    const inPrice =
      p.price >= appliedFilters.priceRange[0] &&
      p.price <= appliedFilters.priceRange[1];
    return inPrice;
  });
  const handleAddToCart = async (product) => {
    console.log("product", product);

    const payload = {
      productId: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      qty: 1,
    };
    await axiosInstance.post("/api/cart/add", payload);

    alert("Added to cart");
  };

  return (
    <div className="mx-auto mt-20">
      <main style={styles.main}>
        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>What are you looking for?</h1>
          <p style={styles.heroSub}>
            Explore thousands of products across all categories
          </p>

          <div style={styles.searchRow}>
            <div style={styles.searchBar}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search products, categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
              {search && (
                <button onClick={() => setSearch("")} style={styles.clearBtn}>
                  ✕
                </button>
              )}
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Shop By Category</h2>
          </div>
          <div style={styles.categoryGrid}>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    setActiveCategory(cat.id === activeCategory ? null : cat.id)
                  }
                  style={styles.categoryItem}
                >
                  <div
                    style={{
                      ...styles.categoryCircle,
                      background: cat.bg,
                      boxShadow:
                        activeCategory === cat.id
                          ? "0 0 0 3px #286934"
                          : "0 2px 12px rgba(21, 235, 103, 0.08)",
                    }}
                  >
                    <img
                      src={cat.imageUrl}
                      alt={cat.label}
                      style={styles.categoryImage}
                    />
                  </div>
                  <span style={styles.categoryLabel}>{cat.label}</span>
                </button>
              ))
            ) : (
              <p style={styles.emptyMsg}>No categories match "{search}"</p>
            )}
          </div>
        </section>

        <div style={styles.shopAllHeader}>
          <h2 style={styles.sectionTitle}>Shop All</h2>
          <span style={styles.resultCount}>
            {filteredProducts.length} products
          </span>
        </div>

        {filteredProducts.length > 0 ? (
          <div style={styles.productGrid}>
            {filteredProducts.map((product) => (
              <div key={product.id} style={styles.productCard}>
                <div style={styles.productImageWrap}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={styles.productImage}
                  />
                </div>
                <div style={styles.productInfo}>
                  <p style={styles.productName}>{product.name}</p>
                  <p style={styles.productPrice}>${product.price.toFixed(2)}</p>
                </div>
                <button
                  style={styles.addToCartBtn}
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noResults}>
            <p style={{ fontSize: 40, margin: "0 0 12px" }}>🌿</p>
            <p style={{ fontWeight: 700, fontSize: 17, margin: "0 0 6px" }}>
              No products found
            </p>
            <p style={{ color: "#999", fontSize: 14, margin: 0 }}>
              Try adjusting your filters
            </p>
            <button
              onClick={() => setAppliedFilters(defaultFilters)}
              style={{
                ...styles.addToCartBtn,
                marginTop: 20,
                padding: "10px 28px",
              }}
            >
              Clear Filters
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
    </div>
  );
};

const styles = {
  main: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px 60px",
  },
  hero: {
    textAlign: "center",
    padding: "0 0 32px",
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: 700,
    margin: "0 0 8px",
    letterSpacing: "-1px",
  },
  heroSub: {
    fontSize: 16,
    color: "#777",
    margin: "0 0 28px",
  },
  searchRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    maxWidth: 680,
    margin: "0 auto",
    justifyContent: "center",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    border: "2px solid #616161",
    borderRadius: 50,
    padding: "0 20px",
    flex: 1,
    height: 52,
    gap: 10,
  },
  searchIcon: { fontSize: 18, flexShrink: 0 },
  searchInput: {
    border: "none",
    outline: "none",
    flex: 1,
    fontSize: 16,
    background: "transparent",
    fontFamily: "inherit",
  },
  clearBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    color: "#999",
    padding: 4,
  },
  filterTrigger: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    height: 52,
    padding: "0 22px",
    borderRadius: 50,
    border: "2px solid #286934",
    background: "#fff",
    color: "#286934",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    flexShrink: 0,
    position: "relative",
    transition: "all 0.15s ease",
  },
  filterBadge: {
    background: "#286934",
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 50,
    width: 20,
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  activePills: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 16,
  },
  pill: {
    background: "#f0f9f1",
    border: "1.5px solid #a5d6a7",
    color: "#286934",
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 50,
    padding: "4px 14px",
  },
  clearAllBtn: {
    background: "none",
    border: "1.5px solid #ddd",
    color: "#999",
    fontSize: 13,
    borderRadius: 50,
    padding: "4px 14px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  section: { marginBottom: 40 },
  sectionHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.5px",
  },
  shopAllHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  resultCount: {
    fontSize: 14,
    color: "#999",
  },
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
    gap: "30px 8px",
  },
  categoryImage: {
    width: 90,
    height: 90,
    borderRadius: "50%",
    objectFit: "cover",
  },
  categoryItem: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    padding: 4,
    borderRadius: 12,
    transition: "opacity 0.15s",
  },
  categoryCircle: {
    width: 90,
    height: 90,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: 500,
    textAlign: "center",
    color: "#333",
    lineHeight: 1.3,
    maxWidth: 90,
  },
  emptyMsg: {
    gridColumn: "1 / -1",
    color: "#999",
    fontSize: 15,
    textAlign: "center",
    padding: "24px 0",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 20,
  },
  productCard: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #eee",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  },
  productImageWrap: {
    width: "100%",
    aspectRatio: "1 / 1",
    background: "#f5f5f5",
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  productInfo: {
    padding: "12px 14px 8px",
    flex: 1,
  },
  productName: {
    margin: "0 0 4px",
    fontSize: 14,
    fontWeight: 600,
    color: "#1a1a1a",
    lineHeight: 1.3,
  },
  productPrice: {
    margin: 0,
    fontSize: 15,
    fontWeight: 700,
    color: "#2e7d32",
  },
  addToCartBtn: {
    margin: "0 14px 14px",
    padding: "9px 0",
    borderRadius: 8,
    border: "1.5px solid #1a1a1a",
    background: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    color: "#1a1a1a",
    fontFamily: "inherit",
  },
  noResults: {
    textAlign: "center",
    padding: "60px 0",
    color: "#333",
  },
};

export default CustomerDashboard;
