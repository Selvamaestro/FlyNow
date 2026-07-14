import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Bell,
  ChevronDown,
  ChevronRight,
  Home,
  LayoutGrid,
  Tag,
  Zap,
  Ticket,
  Wallet,
  ShoppingBag,
  Heart,
  Store,
  HelpCircle,
  Trophy,
  Users,
  Settings,
  ArrowRight,
  Gift,
  Clock,
  Compass,
  Sparkles
} from 'lucide-react';

// Hero Slider Data
const HERO_SLIDES = [
  {
    tag: "Limited Time Offer",
    title: "MEGA MONSOON",
    highlightTitle: "BIG FLASH SALE",
    discount: "UP TO 70% OFF",
    subtitle: "On Top Brands Across Categories. Double your savings with exclusive wallet coupons!",
    primaryBtn: "Explore Offers",
    secondaryBtn: "View Categories",
    image: "/hero_woman.png",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
    badgeTitle: "Validity",
    badgeDesc: "12 Jul - 31 Jul"
  },
  {
    tag: "Electronics Special",
    title: "UPGRADE YOUR TECH",
    highlightTitle: "MEGA DIGITAL WEEK",
    discount: "UP TO 50% OFF",
    subtitle: "Upgrade to premium gadgets, smartphones & home appliances with zero-cost EMI options.",
    primaryBtn: "Claim Coupons",
    secondaryBtn: "Compare Brands",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a8a 100%)",
    badgeTitle: "Limited Stock",
    badgeDesc: "Ending in 2 Days"
  },
  {
    tag: "Fashion Fiesta",
    title: "STEP OUT IN STYLE",
    highlightTitle: "TRENDING FASHION",
    discount: "FLAT 40% OFF",
    subtitle: "Redefine your wardrobe with the latest designs in clothing, footwear & lifestyle accessories.",
    primaryBtn: "Shop Outfits",
    secondaryBtn: "Style Guide",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    gradient: "linear-gradient(135deg, #1e293b 0%, #1e3a8a 50%, #2563eb 100%)",
    badgeTitle: "Exclusive",
    badgeDesc: "Top Brands Only"
  }
];

// Categories Data
const CATEGORIES = [
  { id: 'home', label: 'Home Products', icon: '🏠' },
  { id: 'electronics', label: 'Electronics', icon: '💻' },
  { id: 'baby', label: 'Baby Products', icon: '👶' },
  { id: 'fashion', label: 'Fashion & Textiles', icon: '👗' },
  { id: 'footwear', label: 'Footwear', icon: '👟' },
  { id: 'cookware', label: 'Cookware & Kitchen', icon: '🍳' },
  { id: 'beauty', label: 'Skincare & Beauty', icon: '🧴' },
  { id: 'grocery', label: 'Grocery & Food', icon: '🥦' },
  { id: 'sports', label: 'Sports & Fitness', icon: '🏋️‍♂️' },
  { id: 'furniture', label: 'Furniture & Appliances', icon: '🛋️' }
];

// Today's Offers Data
const TODAY_OFFERS = [
  {
    brand: 'amazon',
    discount: 'Up to 60% OFF',
    desc: 'on Electronics',
    valid: 'Valid Today Only',
    btnText: 'Shop Now',
    primaryBtn: true
  },
  {
    brand: 'SAMSUNG',
    discount: 'Flat ₹5,000 OFF',
    desc: 'on Galaxy S24 Ultra',
    valid: 'Valid Today Only',
    btnText: 'View Offer',
    primaryBtn: false
  },
  {
    brand: 'Myntra',
    discount: '40-70% OFF',
    desc: 'on Fashion',
    valid: 'Valid Today Only',
    btnText: 'Shop Now',
    primaryBtn: true
  },
  {
    brand: 'NIKE',
    discount: 'Extra 20% OFF',
    desc: 'on Sports Shoes',
    valid: 'Valid Today Only',
    btnText: 'View Offer',
    primaryBtn: false
  },
  {
    brand: 'bigbasket',
    discount: 'Flat ₹200 OFF',
    desc: 'on ₹999 purchase',
    valid: 'Valid Today Only',
    btnText: 'Order Now',
    primaryBtn: true
  },
  {
    brand: 'PHILIPS',
    discount: 'Up to 35% OFF',
    desc: 'on Home Appliances',
    valid: 'Valid Today Only',
    btnText: 'View Offer',
    primaryBtn: false
  }
];

// Flash Sales Data
const FLASH_SALES = [
  {
    brand: 'SAMSUNG',
    title: 'MEGA ELECTRONICS SALE',
    discount: 'Up to 70% OFF',
    timeLeft: { days: 18, hours: 12, minutes: 34 }
  },
  {
    brand: 'AJIO',
    title: 'FASHION WEEKEND SALE',
    discount: 'Up to 60% OFF',
    timeLeft: { days: 18, hours: 12, minutes: 34 }
  },
  {
    brand: 'Prestige',
    title: 'COOKWARE CARNIVAL',
    discount: 'Up to 55% OFF',
    timeLeft: { days: 7, hours: 12, minutes: 34 }
  },
  {
    brand: 'mamaearth',
    title: 'BEAUTY BONANZA',
    discount: 'Buy 1 Get 1 Free',
    timeLeft: { days: 12, hours: 12, minutes: 34 }
  },
  {
    brand: 'boAt',
    title: 'AUDIO FEST',
    discount: 'Up to 45% OFF',
    timeLeft: { days: 4, hours: 12, minutes: 34 }
  }
];

export default function App() {
  const [activeMenu, setActiveMenu] = useState('Home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('Chennai');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [couponCount, setCouponCount] = useState(12);

  // Auto slide hero banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar Section */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-icon">
            <Compass size={22} strokeWidth={2.5} />
          </div>
          <span className="logo-text">FlyNow</span>
        </div>

        <nav className="menu-section">
          <a
            href="#"
            className={`menu-item ${activeMenu === 'Home' ? 'active' : ''}`}
            onClick={() => setActiveMenu('Home')}
          >
            <div className="menu-item-left">
              <Home className="menu-item-icon" />
              <span>Home</span>
            </div>
          </a>

          <a
            href="#"
            className={`menu-item ${activeMenu === 'Categories' ? 'active' : ''}`}
            onClick={() => setActiveMenu('Categories')}
          >
            <div className="menu-item-left">
              <LayoutGrid className="menu-item-icon" />
              <span>Categories</span>
            </div>
          </a>

          <a
            href="#"
            className={`menu-item ${activeMenu === 'Offers' ? 'active' : ''}`}
            onClick={() => setActiveMenu('Offers')}
          >
            <div className="menu-item-left">
              <Tag className="menu-item-icon" />
              <span>Today's Offers</span>
            </div>
          </a>

          <a
            href="#"
            className={`menu-item ${activeMenu === 'Flash Sales' ? 'active' : ''}`}
            onClick={() => setActiveMenu('Flash Sales')}
          >
            <div className="menu-item-left">
              <Zap className="menu-item-icon" />
              <span>Flash Sales</span>
            </div>
          </a>

          <a
            href="#"
            className={`menu-item ${activeMenu === 'Coupons' ? 'active' : ''}`}
            onClick={() => setActiveMenu('Coupons')}
          >
            <div className="menu-item-left">
              <Ticket className="menu-item-icon" />
              <span>Coupons</span>
            </div>
          </a>

          <a
            href="#"
            className={`menu-item ${activeMenu === 'Wallet' ? 'active' : ''}`}
            onClick={() => setActiveMenu('Wallet')}
          >
            <div className="menu-item-left">
              <Wallet className="menu-item-icon" />
              <span>Coupon Wallet</span>
            </div>
            <span className="badge">{couponCount}</span>
          </a>

          <a
            href="#"
            className={`menu-item ${activeMenu === 'Orders' ? 'active' : ''}`}
            onClick={() => setActiveMenu('Orders')}
          >
            <div className="menu-item-left">
              <ShoppingBag className="menu-item-icon" />
              <span>My Orders</span>
            </div>
          </a>

          <a
            href="#"
            className={`menu-item ${activeMenu === 'Wishlist' ? 'active' : ''}`}
            onClick={() => setActiveMenu('Wishlist')}
          >
            <div className="menu-item-left">
              <Heart className="menu-item-icon" />
              <span>Wishlist</span>
            </div>
            <span className="badge">8</span>
          </a>

          <a
            href="#"
            className={`menu-item ${activeMenu === 'Stores' ? 'active' : ''}`}
            onClick={() => setActiveMenu('Stores')}
          >
            <div className="menu-item-left">
              <Store className="menu-item-icon" />
              <span>Nearby Stores</span>
            </div>
          </a>

          <a
            href="#"
            className={`menu-item ${activeMenu === 'Notifications' ? 'active' : ''}`}
            onClick={() => setActiveMenu('Notifications')}
          >
            <div className="menu-item-left">
              <Bell className="menu-item-icon" />
              <span>Notifications</span>
            </div>
            <span className="badge danger">3</span>
          </a>

          <a
            href="#"
            className={`menu-item ${activeMenu === 'Spin & Win' ? 'active' : ''}`}
            onClick={() => setActiveMenu('Spin & Win')}
          >
            <div className="menu-item-left">
              <Trophy className="menu-item-icon" />
              <span>Spin & Win</span>
            </div>
          </a>

          <a
            href="#"
            className={`menu-item ${activeMenu === 'Refer' ? 'active' : ''}`}
            onClick={() => setActiveMenu('Refer')}
          >
            <div className="menu-item-left">
              <Users className="menu-item-icon" />
              <span>Refer & Earn</span>
            </div>
          </a>

          <a
            href="#"
            className={`menu-item ${activeMenu === 'Support' ? 'active' : ''}`}
            onClick={() => setActiveMenu('Support')}
          >
            <div className="menu-item-left">
              <HelpCircle className="menu-item-icon" />
              <span>Help & Support</span>
            </div>
          </a>

          <a
            href="#"
            className={`menu-item ${activeMenu === 'Settings' ? 'active' : ''}`}
            onClick={() => setActiveMenu('Settings')}
          >
            <div className="menu-item-left">
              <Settings className="menu-item-icon" />
              <span>Settings</span>
            </div>
          </a>
        </nav>

        {/* Promo Widget */}
        <div className="promo-widget">
          <div className="promo-title">Spin & Win</div>
          <div className="promo-subtitle">Spin daily and win exciting brand coupons & flyers!</div>
          <button className="promo-btn" onClick={() => alert("Spinning Wheel Launched! Check your luck!")}>
            <Sparkles size={16} />
            <span>Spin Now</span>
          </button>
          <div className="promo-wheel-icon">🎰</div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="main-content">
        {/* Header Bar */}
        <header className="header-bar">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search for brands, categories, offers..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="search-filter">
              <span>All</span>
              <ChevronDown size={14} />
            </div>
          </div>

          <div className="header-actions">
            {/* Location selector dropdown mock */}
            <div 
              className="location-selector"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              style={{ position: 'relative' }}
            >
              <MapPin size={18} className="location-icon" />
              <span>{selectedLocation}</span>
              <ChevronDown size={14} />
              
              {showLocationDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200,
                  width: '150px',
                  padding: '8px 0',
                  marginTop: '8px'
                }}>
                  {['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Kolkata'].map((loc) => (
                    <div 
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                      style={{
                        padding: '8px 16px',
                        fontSize: '13.5px',
                        color: 'var(--text-dark)',
                        transition: 'background 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-light)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="action-btn" onClick={() => alert("Notification panel coming soon!")}>
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>

            <div className="profile-card" onClick={() => alert("User settings & profile details")}>
              <div className="profile-image-container">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" 
                  alt="Profile" 
                  className="profile-image" 
                />
              </div>
              <div className="profile-info">
                <span className="profile-name">Priya</span>
                <span className="profile-status">Premium</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Hero Section */}
        <section 
          className="hero-section" 
          style={{ background: HERO_SLIDES[currentSlide].gradient }}
        >
          {/* Background decorations */}
          <div className="hero-bg-shapes">
            <div className="hero-shape hero-shape-1"></div>
            <div className="hero-shape hero-shape-2"></div>
            <div className="hero-leaves leaf-1">🍁</div>
            <div className="hero-leaves leaf-2">🍃</div>
          </div>

          <div className="hero-content">
            <div className="hero-tag">{HERO_SLIDES[currentSlide].tag}</div>
            <h1 className="hero-title">
              {HERO_SLIDES[currentSlide].title}
              <span>{HERO_SLIDES[currentSlide].highlightTitle}</span>
              {HERO_SLIDES[currentSlide].discount}
            </h1>
            <p className="hero-subtitle">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>
            <div className="hero-actions">
              <button 
                className="hero-btn"
                onClick={() => alert(`Redirecting to: ${HERO_SLIDES[currentSlide].highlightTitle}`)}
              >
                <span>{HERO_SLIDES[currentSlide].primaryBtn}</span>
                <ChevronRight size={18} />
              </button>
              <button className="hero-secondary-btn">
                {HERO_SLIDES[currentSlide].secondaryBtn}
              </button>
            </div>
          </div>

          <div className="hero-image-container">
            <img 
              src={HERO_SLIDES[currentSlide].image} 
              alt="Promo Banner" 
              className="hero-image"
              onError={(e) => {
                // Fail-safe placeholder if image fails to load
                e.target.src = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80";
              }}
            />
            <div className="hero-badge-float">
              <span className="badge-float-title">{HERO_SLIDES[currentSlide].badgeTitle}</span>
              <span className="badge-float-desc">{HERO_SLIDES[currentSlide].badgeDesc}</span>
            </div>
          </div>

          <div className="hero-slider-dots">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-container">
          <div className="section-header">
            <div className="section-title-container">
              <h2 className="section-title">Explore Categories</h2>
            </div>
          </div>
          <div className="category-list">
            {CATEGORIES.map((cat) => (
              <div 
                key={cat.id} 
                className="category-card"
                onClick={() => alert(`Filtering flyers for category: ${cat.label}`)}
              >
                <div className="category-icon-wrapper">
                  <span>{cat.icon}</span>
                </div>
                <span className="category-label">{cat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Today's Top Offers Section */}
        <section className="offers-container">
          <div className="section-header">
            <div className="section-title-container">
              <h2 className="section-title">Today's Top Offers</h2>
            </div>
            <a href="#" className="section-view-all">
              <span>View All</span>
              <ChevronRight size={14} />
            </a>
          </div>

          <div className="offers-grid">
            {TODAY_OFFERS.map((offer, index) => (
              <div key={index} className="offer-card">
                <div className="offer-header">
                  <span className={`brand-logo-placeholder brand-${offer.brand.toLowerCase()}`}>
                    {offer.brand}
                  </span>
                </div>
                <div>
                  <div className="offer-value">{offer.discount}</div>
                  <div className="offer-category">{offer.desc}</div>
                </div>
                <div>
                  <span className="offer-validity">{offer.valid}</span>
                </div>
                <button 
                  className={`offer-action-btn ${offer.primaryBtn ? 'primary' : 'secondary'}`}
                  onClick={() => {
                    setCouponCount(prev => prev + 1);
                    alert(`${offer.brand} coupon added to your digital wallet!`);
                  }}
                >
                  {offer.btnText}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Flash Sales Section */}
        <section className="flash-sales-container">
          <div className="section-header">
            <div className="section-title-container">
              <h2 className="section-title">Flash Sales</h2>
            </div>
            <a href="#" className="section-view-all">
              <span>View All Deals</span>
              <ChevronRight size={14} />
            </a>
          </div>

          <div className="flash-grid">
            {FLASH_SALES.map((sale, index) => (
              <div key={index} className="flash-card">
                <div className="flash-banner">
                  <div className="flash-banner-overlay"></div>
                  <span className="flash-brand-text">{sale.brand}</span>
                  <span className="flash-badge">HOT</span>
                </div>
                <div className="flash-body">
                  <h3 className="flash-title">{sale.title}</h3>
                  <div className="flash-discount">{sale.discount}</div>
                  <div className="flash-timer">
                    <Clock size={12} style={{ marginRight: '4px' }} />
                    <span>
                      {sale.timeLeft.days}d : {sale.timeLeft.hours}h : {sale.timeLeft.minutes}m
                    </span>
                    <span className="timer-dots" style={{ marginLeft: '4px' }}>🔴</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
