import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import categories from "../data/categories";
import {
  Sparkles,
  Search,
  Eye,
  Check,
  Copy,
  ChevronRight,
  TrendingDown,
  Clock,
  Tag,
  ArrowUpDown,
  X
} from "lucide-react";
import "./CategoryDetails.css";

// Robust Category Normalizer
const normalizeCategory = (cat) => {
  if (!cat) return "";
  const c = cat.toLowerCase().trim();
  if (c.includes("home") || c.includes("decor") || c.includes("furniture") || c.includes("cookware")) return "home";
  if (c.includes("electronics") || c.includes("tech")) return "electronics";
  if (c.includes("fashion") || c.includes("footwear") || c.includes("wear")) return "fashion";
  if (c.includes("wellness") || c.includes("sports") || c.includes("health") || c.includes("gym")) return "wellness";
  if (c.includes("travel")) return "travel";
  if (c.includes("dining") || c.includes("food") || c.includes("grocery") || c.includes("supermarket")) return "dining";
  if (c.includes("automotive") || c.includes("car")) return "automotive";
  if (c.includes("entertainment") || c.includes("fun") || c.includes("movie")) return "entertainment";
  if (c.includes("learning") || c.includes("courses") || c.includes("education")) return "learning";
  if (c.includes("beauty") || c.includes("skincare") || c.includes("perfume")) return "beauty";
  return c;
};

// Pricing Helper
const getOfferPrices = (item) => {
  const actualStr = String(item.actualPrice || "").replace(/[^\d]/g, "");
  const actual = parseFloat(actualStr) || 1999;
  
  let discountAmount = 0;
  let discountStr = "";
  
  if (item.discount) {
    const dStr = String(item.discount).toUpperCase();
    if (dStr.includes("%")) {
      const pct = parseFloat(dStr.replace(/[^\d]/g, "")) || 15;
      discountAmount = Math.round(actual * (pct / 100));
      discountStr = `-${pct}%`;
    } else {
      const val = parseFloat(dStr.replace(/[^\d]/g, "")) || 0;
      discountAmount = val;
      discountStr = `-₹${val.toLocaleString("en-IN")}`;
    }
  } else if (item.promoCode) {
    const numMatch = String(item.promoCode).match(/\d+/);
    if (numMatch) {
      const pct = parseFloat(numMatch[0]) || 15;
      discountAmount = Math.round(actual * (pct / 100));
      discountStr = `-${pct}%`;
    } else {
      discountAmount = Math.round(actual * 0.15);
      discountStr = `-15%`;
    }
  } else {
    discountAmount = Math.round(actual * 0.15);
    discountStr = `-15%`;
  }
  
  const salePrice = Math.max(0, actual - discountAmount);
  
  return {
    actualPrice: `₹${actual.toLocaleString("en-IN")}`,
    salePrice: `₹${salePrice.toLocaleString("en-IN")}`,
    discountBadge: discountStr,
    actualValue: actual,
    saleValue: salePrice,
    discountValue: discountAmount
  };
};

const CategoryDetails = () => {
  const { categorySlug } = useParams();
  const currentCategory = categories.find((c) => c.icon === categorySlug);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Filter States
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [priceLimit, setPriceLimit] = useState(200000);
  const [selectedDiscount, setSelectedDiscount] = useState(null); // null, 10, 30, 50
  const [selectedTypes, setSelectedTypes] = useState(["flash", "coupon"]);
  
  // Sorting State
  const [sortOption, setSortOption] = useState("newest"); // "newest", "priceAsc", "priceDesc", "discount"
  
  // Modal Preview State
  const [previewProduct, setPreviewProduct] = useState(null);
  const [copied, setCopied] = useState(false);
  const [savedCouponIds, setSavedCouponIds] = useState([]);

  // Load Data
  useEffect(() => {
    const loadCategoryOffers = () => {
      const savedFlyers = localStorage.getItem("flynow_all_flyers");
      const savedFlash = localStorage.getItem("flynow_all_flash_sales");
      
      const flyersList = savedFlyers ? JSON.parse(savedFlyers) : [];
      const flashList = savedFlash ? JSON.parse(savedFlash) : [];
      
      const normalizedFlyers = flyersList
        .filter((f) => normalizeCategory(f.category) === categorySlug)
        .map((f) => ({
          ...f,
          type: "coupon",
          brand: f.companyName || "Brand",
          title: f.name || "Special Offer",
          ...getOfferPrices(f)
        }));
        
      const normalizedFlash = flashList
        .filter((f) => normalizeCategory(f.category) === categorySlug && f.expiresAt > Date.now())
        .map((f) => ({
          ...f,
          type: "flash",
          brand: f.brand || "Brand",
          title: f.title || "Flash Deal",
          ...getOfferPrices(f)
        }));
        
      const allMerged = [...normalizedFlash, ...normalizedFlyers];
      setProducts(allMerged);
      
      // Calculate brand options dynamically
      const uniqueBrands = Array.from(new Set(allMerged.map(p => p.brand).filter(Boolean)));
      setBrands(uniqueBrands);
      
      // Calculate max price limit
      const prices = allMerged.map(p => p.saleValue);
      const computedMax = prices.length > 0 ? Math.max(...prices) : 200000;
      setMaxPrice(computedMax);
      setPriceLimit(computedMax);
    };

    loadCategoryOffers();
    
    // Load saved coupons to track Save button state
    const savedWallet = localStorage.getItem("flynow_coupon_wallet");
    if (savedWallet) {
      setSavedCouponIds(JSON.parse(savedWallet).map(c => c.id));
    }
  }, [categorySlug]);

  // Handle Filtering and Sorting
  useEffect(() => {
    let result = [...products];

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Price range filter
    result = result.filter(p => p.saleValue <= priceLimit);

    // Discount filter
    if (selectedDiscount) {
      result = result.filter(p => {
        const pct = ((p.actualValue - p.saleValue) / p.actualValue) * 100;
        return pct >= selectedDiscount;
      });
    }

    // Offer type filter
    result = result.filter(p => selectedTypes.includes(p.type));

    // Sorting
    if (sortOption === "newest") {
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    } else if (sortOption === "priceAsc") {
      result.sort((a, b) => a.saleValue - b.saleValue);
    } else if (sortOption === "priceDesc") {
      result.sort((a, b) => b.saleValue - a.saleValue);
    } else if (sortOption === "discount") {
      result.sort((a, b) => {
        const pctA = (a.actualValue - a.saleValue) / a.actualValue;
        const pctB = (b.actualValue - b.saleValue) / b.actualValue;
        return pctB - pctA;
      });
    }

    setFilteredProducts(result);
  }, [products, selectedBrands, priceLimit, selectedDiscount, selectedTypes, sortOption]);

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleTypeChange = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSaveCoupon = (product) => {
    const savedWallet = localStorage.getItem("flynow_coupon_wallet");
    const wallet = savedWallet ? JSON.parse(savedWallet) : [];
    
    if (wallet.some(item => item.id === product.id)) return;
    
    const newWalletItem = {
      id: product.id,
      name: product.title,
      companyName: product.brand,
      promoCode: product.promoCode || "FLASHCODE",
      expiryDate: product.expiryDate || new Date(Date.now() + 48*3600*1000).toISOString().split('T')[0],
      image: product.image,
      category: product.category
    };
    
    const updated = [...wallet, newWalletItem];
    localStorage.setItem("flynow_coupon_wallet", JSON.stringify(updated));
    setSavedCouponIds(prev => [...prev, product.id]);
    window.dispatchEvent(new Event("storage"));
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!currentCategory) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="content">
          <Navbar />
          <div className="category-error-page">
            <h2>Category not found</h2>
            <Link to="/categories" className="back-link">Back to Categories</Link>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="content">
        <Navbar />

        <main className="category-details-container">
          {/* Breadcrumbs */}
          <nav className="category-details-breadcrumbs">
            <Link to="/">Home</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <Link to="/categories">Categories</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-active">{currentCategory.title}</span>
          </nav>

          <div className="category-detail-workspace">
            {/* Filter Sidebar */}
            <aside className="filters-sidebar">
              {/* Brands Filter */}
              <div className="filter-group">
                <h3>Brands</h3>
                {brands.length > 0 ? (
                  <div className="filter-options-list">
                    {brands.map((brand) => (
                      <label key={brand} className="filter-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                        />
                        <span>{brand}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="no-filters-msg">No brands available</p>
                )}
              </div>

              {/* Price Range Filter */}
              <div className="filter-group">
                <h3>Price</h3>
                <div className="price-slider-wrap">
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceLimit}
                    onChange={(e) => setPriceLimit(Number(e.target.value))}
                    className="price-slider"
                  />
                  <div className="price-slider-labels">
                    <span>₹0</span>
                    <span>₹{priceLimit.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Discount Levels Filter */}
              <div className="filter-group">
                <h3>Discount</h3>
                <div className="discount-tags-wrap">
                  {[10, 30, 50].map((level) => (
                    <button
                      key={level}
                      className={`discount-tag-btn ${selectedDiscount === level ? "active" : ""}`}
                      onClick={() => setSelectedDiscount(selectedDiscount === level ? null : level)}
                    >
                      {level}%+
                    </button>
                  ))}
                </div>
              </div>

              {/* Offer Type Filter */}
              <div className="filter-group">
                <h3>Offer Type</h3>
                <div className="filter-options-list">
                  <label className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes("flash")}
                      onChange={() => handleTypeChange("flash")}
                    />
                    <span>Flash Sales</span>
                  </label>
                  <label className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes("coupon")}
                      onChange={() => handleTypeChange("coupon")}
                    />
                    <span>Coupons</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Products Main Section */}
            <section className="category-products-section">
              {/* Heading Area */}
              <header className="category-products-header">
                <div className="category-products-title-block">
                  <h2>{currentCategory.title}</h2>
                  <p>Discover {filteredProducts.length} premium offers curated just for you.</p>
                </div>

                {/* Sort Control */}
                <div className="sort-control-wrap">
                  <button className="sort-dropdown-toggle">
                    <ArrowUpDown size={15} />
                    <span>
                      {sortOption === "newest" ? "Newest First" :
                       sortOption === "priceAsc" ? "Price: Low to High" :
                       sortOption === "priceDesc" ? "Price: High to Low" :
                       "Best Discount"}
                    </span>
                  </button>
                  <div className="sort-dropdown-menu">
                    <button onClick={() => setSortOption("newest")}>Newest First</button>
                    <button onClick={() => setSortOption("priceAsc")}>Price: Low to High</button>
                    <button onClick={() => setSortOption("priceDesc")}>Price: High to Low</button>
                    <button onClick={() => setSortOption("discount")}>Best Discount</button>
                  </div>
                </div>
              </header>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="category-products-grid">
                  {filteredProducts.map((product) => {
                    const isSaved = savedCouponIds.includes(product.id);
                    
                    return (
                      <div key={product.id} className="category-product-card">
                        {/* Image Wrap */}
                        <div className="product-card-image-wrap">
                          <img
                            src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
                            alt={product.title}
                          />
                          <span className="product-discount-badge">
                            {product.discountBadge}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="product-card-body">
                          <span className="product-brand-name">{product.brand}</span>
                          <h4 className="product-title-text">{product.title}</h4>
                          
                          <div className="product-pricing-box">
                            <span className="product-sale-price">{product.salePrice}</span>
                            <span className="product-actual-price">{product.actualPrice}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="product-card-actions">
                          <button
                            className={`save-coupon-btn ${isSaved ? "saved" : ""}`}
                            onClick={() => handleSaveCoupon(product)}
                            disabled={isSaved}
                          >
                            {isSaved ? (
                              <>
                                <Check size={16} />
                                <span>Saved</span>
                              </>
                            ) : (
                              <span>Save Coupon</span>
                            )}
                          </button>
                          
                          <button
                            className="preview-coupon-btn"
                            onClick={() => setPreviewProduct(product)}
                            aria-label="Preview Coupon"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="category-empty-state">
                  <Sparkles size={48} className="empty-sparkle" />
                  <h3>No Premium Offers Found</h3>
                  <p>There are no listings matching your active filters. Try resetting the filters or check back later.</p>
                  <Link to="/company" className="add-offer-cta">
                    Publish an Offer
                  </Link>
                </div>
              )}
            </section>
          </div>
        </main>

        <Footer />
      </div>

      {/* Preview Modal */}
      {previewProduct && (
        <div className="coupon-modal-overlay" onClick={() => setPreviewProduct(null)}>
          <div className="coupon-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setPreviewProduct(null)}>
              <X size={20} />
            </button>
            
            <div className="modal-header-banner">
              <span className="modal-brand-badge">{previewProduct.brand}</span>
              <h3>{previewProduct.title}</h3>
            </div>
            
            <div className="modal-body-content">
              <div className="modal-image-panel">
                <img
                  src={previewProduct.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
                  alt={previewProduct.title}
                />
              </div>

              <div className="modal-details-panel">
                <div className="modal-price-display">
                  <span className="modal-sale-price">{previewProduct.salePrice}</span>
                  <span className="modal-actual-price">Value: {previewProduct.actualPrice}</span>
                  <span className="modal-discount-pill">{previewProduct.discountBadge} OFF</span>
                </div>

                <p className="modal-description-text">
                  This coupon guarantees exclusive discounts for {previewProduct.brand} purchases. 
                  Redeem it before the expiry date to unlock this premium deal.
                </p>

                {previewProduct.type === "flash" ? (
                  <div className="modal-timer-badge">
                    <Clock size={16} />
                    <span>Limited Time Flash Sale Deal</span>
                  </div>
                ) : (
                  <div className="modal-timer-badge">
                    <Tag size={16} />
                    <span>Valid until: {previewProduct.expiryDate || "End of month"}</span>
                  </div>
                )}

                {/* Promo Code Box */}
                <div className="modal-code-box">
                  <div className="code-label">PROMO CODE</div>
                  <div className="code-value-wrap">
                    <span className="code-text-field">{previewProduct.promoCode || "FLASH50"}</span>
                    <button
                      className="copy-code-btn"
                      onClick={() => handleCopyCode(previewProduct.promoCode || "FLASH50")}
                    >
                      {copied ? <Check size={18} color="#10B981" /> : <Copy size={18} />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;
