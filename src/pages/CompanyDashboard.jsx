import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CompanyDashboard.css";
import {
  LayoutDashboard,
  Megaphone,
  Ticket,
  BarChart3,
  Users,
  Settings,
  MapPin,
  Bell,
  Plus,
  TrendingUp,
  PiggyBank,
  Rocket,
  MoreHorizontal,
  ArrowUpRight,
  ChevronDown,
  UploadCloud,
  Sparkles,
  Building,
  ArrowRight,
  Plane,
  ArrowLeft
} from "lucide-react";

const CompanyDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [view, setView] = useState("dashboard"); // "dashboard" or "create-flyer"
  const [currentStep, setCurrentStep] = useState(1);
  const [graphMode, setGraphMode] = useState("Week");

  // Actions menu state
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);
  const [editingFlyerId, setEditingFlyerId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form states - empty by default
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState("");
  const [campaignTitle, setCampaignTitle] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [flyerImage, setFlyerImage] = useState("");

  // Authentication states
  const [loggedCompany, setLoggedCompany] = useState(() => {
    const saved = localStorage.getItem("flynow_logged_in_company");
    return saved ? JSON.parse(saved) : null;
  });
  const [authView, setAuthView] = useState("login"); // "login" or "register"
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  // Login form inputs
  const [authEmailOrPhone, setAuthEmailOrPhone] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  // Registration form inputs
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCategory, setRegCategory] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [flyersList, setFlyersList] = useState([]);

  // Seed default demo company and load flyers list
  useEffect(() => {
    const companies = JSON.parse(localStorage.getItem("flynow_companies") || "[]");
    const demoExists = companies.some((c) => c.email === "demo@flynow.com");
    if (!demoExists) {
      const demoCompany = {
        name: "Coffee House",
        email: "demo@flynow.com",
        phone: "1234567890",
        category: "Food",
        password: "demo"
      };
      companies.push(demoCompany);
      localStorage.setItem("flynow_companies", JSON.stringify(companies));
    }

    // Seed global flyers if they do not exist
    if (!localStorage.getItem("flynow_all_flyers")) {
      const demoFlyers = [
        {
          id: 1,
          name: "Early Bird Coffee 20%",
          companyName: "Coffee House",
          category: "Food",
          promoCode: "COFFEE20",
          expiryDate: "2026-08-31",
          started: "Started 3 days ago",
          reach: "12,402",
          redemptions: "842",
          image: "/coffee_flyer.png",
          companyEmail: "demo@flynow.com"
        },
        {
          id: 2,
          name: "Luxury Accessories Flash",
          companyName: "Gold & Co",
          category: "Fashion",
          promoCode: "LUXURY15",
          expiryDate: "2026-07-10",
          started: "Ended 2 hours ago",
          reach: "45,120",
          redemptions: "2,109",
          image: "/accessories_flyer.png",
          companyEmail: "demo@flynow.com"
        },
        {
          id: 3,
          name: "Weekend Market Specials",
          companyName: "Supermarket Inc",
          category: "Grocery",
          promoCode: "MARKETWEEK",
          expiryDate: "2026-07-20",
          started: "Started 1 day ago",
          reach: "8,230",
          redemptions: "312",
          image: "/market_flyer.png",
          companyEmail: "demo@flynow.com"
        }
      ];
      localStorage.setItem("flynow_all_flyers", JSON.stringify(demoFlyers));
    }
  }, []);

  // Sync flyers when loggedCompany changes
  useEffect(() => {
    if (loggedCompany) {
      const saved = localStorage.getItem("flynow_all_flyers");
      const list = saved ? JSON.parse(saved) : [];
      const filtered = list.filter((f) => f.companyEmail === loggedCompany.email);
      setFlyersList(filtered);
    } else {
      setFlyersList([]);
    }
  }, [loggedCompany]);

  // Sync delete confirmation state with active menu
  useEffect(() => {
    if (activeActionMenuId === null) {
      setDeleteConfirmId(null);
    }
  }, [activeActionMenuId]);

  // Helper: Format YYYY-MM-DD to "MMM DD"
  const formatExpiryDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Helper: Calculate if flyer is expired relative to current date (July 15, 2026)
  const getFlyerStatus = (expiryDateStr) => {
    if (!expiryDateStr) return "Active";
    // Set reference today as 2026-07-15
    const today = new Date("2026-07-15T00:00:00");
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDateStr + "T00:00:00");
    expiry.setHours(0, 0, 0, 0);
    return expiry < today ? "Expired" : "Active";
  };

  const sidebarMenu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My Flyers", icon: <Megaphone size={20} /> },
    { name: "Coupons", icon: <Ticket size={20} /> },
    { name: "Analytics", icon: <BarChart3 size={20} /> },
    { name: "Customers", icon: <Users size={20} /> },
    { name: "Settings", icon: <Settings size={20} /> }
  ];

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
    if (menuName === "Dashboard") {
      setView("dashboard");
      setEditingFlyerId(null);
    } else if (menuName === "My Flyers") {
      setView("create-flyer");
      setCurrentStep(1);
      setEditingFlyerId(null);
      // Reset and prefill company details from the logged in profile
      setCompanyName(loggedCompany?.name || "");
      setCategory(loggedCompany?.category || "");
      setCampaignTitle("");
      setPromoCode("");
      setExpiryDate("");
      setFlyerImage("");
    }
  };

  const triggerFileInput = () => {
    document.getElementById("flyer-file-input")?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFlyerImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!companyName.trim()) {
        alert("Please enter a Company Name.");
        return;
      }
      if (!category) {
        alert("Please select a Category.");
        return;
      }
      if (!flyerImage) {
        alert("Please upload or select a Flyer Image.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!campaignTitle.trim()) {
        alert("Please enter a Campaign / Offer Title.");
        return;
      }
      if (!promoCode.trim()) {
        alert("Please enter a Promo Code.");
        return;
      }
      if (!expiryDate.trim()) {
        alert("Please select an Expiration Date.");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePublish = () => {
    if (!companyName.trim() || !category || !flyerImage || !campaignTitle.trim() || !promoCode.trim() || !expiryDate.trim()) {
      alert("Please ensure all fields in all steps are completely filled.");
      return;
    }

    const allSaved = localStorage.getItem("flynow_all_flyers");
    const allList = allSaved ? JSON.parse(allSaved) : [];
    let updatedAll;

    if (editingFlyerId) {
      // Edit existing flyer
      updatedAll = allList.map((f) =>
        f.id === editingFlyerId
          ? {
              ...f,
              name: campaignTitle,
              companyName: companyName,
              category: category,
              promoCode: promoCode,
              expiryDate: expiryDate,
              image: flyerImage
            }
          : f
      );
      setEditingFlyerId(null);
    } else {
      // Create new flyer
      const newFlyer = {
        id: Date.now(),
        name: campaignTitle,
        companyName: companyName,
        category: category,
        promoCode: promoCode,
        expiryDate: expiryDate,
        image: flyerImage,
        started: "Started just now",
        reach: "0",
        redemptions: "0",
        companyEmail: loggedCompany ? loggedCompany.email : ""
      };
      updatedAll = [newFlyer, ...allList];
    }

    localStorage.setItem("flynow_all_flyers", JSON.stringify(updatedAll));

    if (loggedCompany) {
      const filtered = updatedAll.filter((f) => f.companyEmail === loggedCompany.email);
      setFlyersList(filtered);
    }

    setView("dashboard");
    setActiveMenu("Dashboard");
    setCurrentStep(1);

    // Reset fields to empty
    setCompanyName("");
    setCategory("");
    setCampaignTitle("");
    setPromoCode("");
    setExpiryDate("");
    setFlyerImage("");
  };

  const handleEditClick = (e, flyer) => {
    e.stopPropagation();
    setEditingFlyerId(flyer.id);
    setCompanyName(flyer.companyName || "");
    setCategory(flyer.category || "");
    setCampaignTitle(flyer.name || "");
    setPromoCode(flyer.promoCode || "");
    setExpiryDate(flyer.expiryDate || "");
    setFlyerImage(flyer.image || "");

    setView("create-flyer");
    setCurrentStep(1);
    setActiveActionMenuId(null);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    const allSaved = localStorage.getItem("flynow_all_flyers");
    const allList = allSaved ? JSON.parse(allSaved) : [];
    const updatedAll = allList.filter((f) => f.id !== id);
    localStorage.setItem("flynow_all_flyers", JSON.stringify(updatedAll));

    if (loggedCompany) {
      const filtered = updatedAll.filter((f) => f.companyEmail === loggedCompany.email);
      setFlyersList(filtered);
    }
    setActiveActionMenuId(null);
    setDeleteConfirmId(null);
  };

  const toggleActionMenu = (e, id) => {
    e.stopPropagation();
    setActiveActionMenuId(activeActionMenuId === id ? null : id);
  };

  // Auth Submit Handlers
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthMessage(null);

    if (!authEmailOrPhone.trim() || !authPassword) {
      setAuthMessage({ type: "error", text: "Please fill out all fields." });
      return;
    }

    const companies = JSON.parse(localStorage.getItem("flynow_companies") || "[]");
    const found = companies.find(
      (c) =>
        (c.email.toLowerCase() === authEmailOrPhone.toLowerCase() || c.phone === authEmailOrPhone) &&
        c.password === authPassword
    );

    if (found) {
      localStorage.setItem("flynow_logged_in_company", JSON.stringify(found));
      setLoggedCompany(found);
      setAuthEmailOrPhone("");
      setAuthPassword("");
    } else {
      setAuthMessage({ type: "error", text: "Invalid email/phone or password." });
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setAuthMessage(null);

    if (!regName.trim() || !regPhone.trim() || !regEmail.trim() || !regCategory || !regPassword) {
      setAuthMessage({ type: "error", text: "Please fill out all registration fields." });
      return;
    }

    const companies = JSON.parse(localStorage.getItem("flynow_companies") || "[]");
    const emailExists = companies.some((c) => c.email.toLowerCase() === regEmail.toLowerCase());
    const phoneExists = companies.some((c) => c.phone === regPhone);

    if (emailExists) {
      setAuthMessage({ type: "error", text: "Company Email is already registered." });
      return;
    }
    if (phoneExists) {
      setAuthMessage({ type: "error", text: "Phone Number is already registered." });
      return;
    }

    const newCompany = {
      name: regName,
      phone: regPhone,
      email: regEmail,
      category: regCategory,
      password: regPassword
    };

    companies.push(newCompany);
    localStorage.setItem("flynow_companies", JSON.stringify(companies));

    // Save empty list for the new company
    localStorage.setItem("flynow_flyers_" + regEmail, JSON.stringify([]));

    // Set success banner message on the login form
    setAuthMessage({
      type: "success",
      text: "Registration successful! Please log in to access your portal."
    });

    // Prefill login input and redirect to sign-in tab
    setAuthEmailOrPhone(regEmail);
    setAuthView("login");

    // Reset registration fields
    setRegName("");
    setRegPhone("");
    setRegEmail("");
    setRegCategory("");
    setRegPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("flynow_logged_in_company");
    setLoggedCompany(null);
    setFlyersList([]);
    setProfileMenuOpen(false);
  };

  // Dynamic Statistics based on Company Identity
  const isDemo = loggedCompany?.email === "demo@flynow.com";
  const totalRedemptions = isDemo ? "1,429" : flyersList.reduce((acc, f) => acc + parseInt(f.redemptions || 0), 0);
  const totalRevenue = isDemo ? "$12,840" : `$${(flyersList.reduce((acc, f) => acc + parseInt(f.redemptions || 0), 0) * 15).toLocaleString()}`;
  const activeFlyersCount = flyersList.filter(f => getFlyerStatus(f.expiryDate) === "Active").length + (isDemo ? 21 : 0);

  // Authentication View
  if (!loggedCompany) {
    return (
      <div className="company-auth-container">
        {/* Left Side: Brand Visual */}
        <div className="company-auth-hero">
          <div className="company-auth-hero-content">
            <div className="company-auth-logo">F</div>
            <h2>Grow Your Business with FlyNow</h2>
            <p>Publish premium flyers, share coupons, and track customer engagement in real-time. Reach thousands of savvy shoppers near you.</p>
            <div className="company-auth-features">
              <div className="auth-feature-item">
                <Megaphone className="feature-icon" size={24} />
                <div>
                  <h4>Instant Campaign Launch</h4>
                  <p>Create and publish interactive flyers in less than 2 minutes.</p>
                </div>
              </div>
              <div className="auth-feature-item">
                <Ticket className="feature-icon" size={24} />
                <div>
                  <h4>Coupon Distribution</h4>
                  <p>Generate secure codes and drive high-intent foot traffic.</p>
                </div>
              </div>
              <div className="auth-feature-item">
                <BarChart3 className="feature-icon" size={24} />
                <div>
                  <h4>Real-time Analytics</h4>
                  <p>Monitor impressions, views, and redemption metrics live.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="company-auth-hero-footer">
            <span>© 2026 FlyNow Inc.</span>
          </div>
        </div>

        {/* Right Side: Forms */}
        <div className="company-auth-form-side">
          <div className="company-auth-form-card">
            <div className="company-auth-tabs">
              <button
                className={`company-auth-tab ${authView === "login" ? "active" : ""}`}
                onClick={() => {
                  setAuthView("login");
                  setAuthMessage(null);
                }}
              >
                Sign In
              </button>
              <button
                className={`company-auth-tab ${authView === "register" ? "active" : ""}`}
                onClick={() => {
                  setAuthView("register");
                  setAuthMessage(null);
                }}
              >
                Register
              </button>
            </div>

            {authMessage && (
              <div className={`company-auth-message ${authMessage.type}`}>
                <span>{authMessage.text}</span>
                <button className="company-auth-message-close" onClick={() => setAuthMessage(null)}>×</button>
              </div>
            )}

            {authView === "login" ? (
              <form className="company-auth-form" onSubmit={handleLoginSubmit}>
                <h3>Welcome Back</h3>
                <p className="auth-subtitle">Sign in to manage your company flyers and analytics.</p>

                <div className="company-form-group">
                  <label>Email Address or Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. merchant@flynow.com"
                    value={authEmailOrPhone}
                    onChange={(e) => setAuthEmailOrPhone(e.target.value)}
                  />
                </div>

                <div className="company-form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="company-auth-submit-btn">
                  Sign In
                </button>
              </form>
            ) : (
              <form className="company-auth-form" onSubmit={handleRegisterSubmit}>
                <h3>Create Merchant Account</h3>
                <p className="auth-subtitle">Get started with a free business profile today.</p>

                <div className="company-form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Skyline Travel Group"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>

                <div className="company-form-row">
                  <div className="company-form-group">
                    <label>Company Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. merchant@flynow.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>

                  <div className="company-form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 1234567890"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="company-form-row">
                  <div className="company-form-group">
                    <label>Category</label>
                    <select
                      required
                      value={regCategory}
                      onChange={(e) => setRegCategory(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      <option value="Travel">Travel</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Grocery">Grocery</option>
                      <option value="Skincare">Skincare</option>
                      <option value="Food">Food</option>
                    </select>
                  </div>

                  <div className="company-form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="company-auth-submit-btn">
                  Register Account
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="company-layout">
      {/* Sidebar */}
      <aside className="company-sidebar">
        <Link to="/" className="company-logo-section" style={{ textDecoration: "none" }}>
          <div className="company-logo-icon">F</div>
          <div className="company-logo-text">
            <h2>FlyNow</h2>
            <span>Premium Savings</span>
          </div>
        </Link>

        <nav className="company-menu">
          {sidebarMenu.map((item) => (
            <button
              key={item.name}
              className={`company-menu-item ${activeMenu === item.name ? "active" : ""}`}
              onClick={() => handleMenuClick(item.name)}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="company-promo-card">
          <p>Unlock detailed heatmaps and advanced customer segmentation.</p>
          <button className="company-premium-btn">Get Premium</button>
        </div>

        <div className="company-sidebar-footer">
          <button className="company-logout-btn" onClick={handleLogout}>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="company-content-wrapper">
        {/* Header */}
        <header className="company-header">
          <div className="company-header-left">
            <h1 className="company-title">
              {view === "create-flyer" ? (editingFlyerId ? "Edit Flyer" : "Create Flyer") : "Overview"}
            </h1>
            {view === "dashboard" && (
              <div className="company-location-pill">
                <MapPin size={16} className="location-icon" />
                <span>New York, NY</span>
                <ChevronDown size={14} className="dropdown-icon" />
              </div>
            )}
          </div>

          <div className="company-header-actions">
            <button className="company-notification-btn">
              <Bell size={20} />
              <span className="company-notification-dot"></span>
            </button>
            {view === "dashboard" && (
              <button className="company-create-btn" onClick={() => handleMenuClick("My Flyers")}>
                <Plus size={18} />
                <span>Create New Flyer</span>
              </button>
            )}
            <div className="company-profile-dropdown-wrapper">
              <button
                className="company-profile-avatar-btn"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <div className="company-profile-avatar-placeholder">
                  {loggedCompany?.name ? loggedCompany.name.charAt(0).toUpperCase() : "C"}
                </div>
              </button>
              {profileMenuOpen && (
                <>
                  <div
                    className="company-dropdown-backdrop"
                    onClick={() => setProfileMenuOpen(false)}
                  />
                  <div className="company-profile-dropdown-menu">
                    <div className="company-profile-dropdown-header">
                      <div className="company-profile-avatar-placeholder large">
                        {loggedCompany?.name ? loggedCompany.name.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div className="company-profile-dropdown-info">
                        <h6>{loggedCompany?.name}</h6>
                        <span>{loggedCompany?.email}</span>
                      </div>
                    </div>
                    <div className="company-profile-dropdown-divider" />
                    <button className="company-profile-dropdown-item logout" onClick={handleLogout}>
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {view === "dashboard" ? (
          <>
            {/* Stats Grid */}
            <section className="company-stats-grid">
              {/* Card 1 */}
              <div className="company-stat-card">
                <div className="company-stat-header">
                  <div className="company-stat-icon-wrapper yellow">
                    <Ticket size={22} />
                  </div>
                  <div className="company-stat-trend positive">
                    <span>+12.5%</span>
                    <TrendingUp size={14} />
                  </div>
                </div>
                <div className="company-stat-body">
                  <span className="company-stat-label">Coupon Redemptions</span>
                  <h3 className="company-stat-value">{totalRedemptions}</h3>
                </div>
              </div>

              {/* Card 2 */}
              <div className="company-stat-card">
                <div className="company-stat-header">
                  <div className="company-stat-icon-wrapper blue">
                    <PiggyBank size={22} />
                  </div>
                  <div className="company-stat-trend positive">
                    <span>+8.2%</span>
                    <TrendingUp size={14} />
                  </div>
                </div>
                <div className="company-stat-body">
                  <span className="company-stat-label">Revenue Saved</span>
                  <h3 className="company-stat-value">{totalRevenue}</h3>
                </div>
              </div>

              {/* Card 3 */}
              <div className="company-stat-card">
                <div className="company-stat-header">
                  <div className="company-stat-icon-wrapper beige">
                    <Rocket size={22} />
                  </div>
                  <span className="company-stat-timeframe">Last 30 Days</span>
                </div>
                <div className="company-stat-body">
                  <span className="company-stat-label">Active Flyers</span>
                  <h3 className="company-stat-value">{activeFlyersCount}</h3>
                </div>
              </div>
            </section>

            {/* Main Dashboard Section */}
            <div className="company-dashboard-sections">
              {/* Chart Section */}
              <section className="company-chart-card">
                <div className="company-card-header">
                  <div>
                    <h4 className="company-card-title">Coupon Redemption Graph</h4>
                    <p className="company-card-subtitle">Hourly tracking of user engagement</p>
                  </div>
                  {isDemo && (
                    <div className="company-toggle-group">
                      <button
                        className={`company-toggle-btn ${graphMode === "Week" ? "active" : ""}`}
                        onClick={() => setGraphMode("Week")}
                      >
                        Week
                      </button>
                      <button
                        className={`company-toggle-btn ${graphMode === "Month" ? "active" : ""}`}
                        onClick={() => setGraphMode("Month")}
                      >
                        Month
                      </button>
                    </div>
                  )}
                </div>

                <div className="company-chart-container">
                  {isDemo ? (
                    <div className="company-bars-wrapper">
                      <div className="company-bar-col">
                        <div className="company-bar" style={{ height: "35%" }}></div>
                        <span className="company-bar-label">MON</span>
                      </div>
                      <div className="company-bar-col">
                        <div className="company-bar" style={{ height: "45%" }}></div>
                      </div>
                      <div className="company-bar-col">
                        <div className="company-bar" style={{ height: "55%" }}></div>
                        <span className="company-bar-label">TUE</span>
                      </div>
                      <div className="company-bar-col">
                        <div className="company-bar" style={{ height: "50%" }}></div>
                      </div>
                      <div className="company-bar-col">
                        <div className="company-bar warning" style={{ height: "70%" }}></div>
                        <span className="company-bar-label">WED</span>
                      </div>
                      <div className="company-bar-col">
                        <div className="company-bar danger" style={{ height: "95%" }}></div>
                      </div>
                      <div className="company-bar-col">
                        <div className="company-bar" style={{ height: "65%" }}></div>
                        <span className="company-bar-label">THU</span>
                      </div>
                      <div className="company-bar-col">
                        <div className="company-bar" style={{ height: "40%" }}></div>
                      </div>
                      <div className="company-bar-col">
                        <div className="company-bar warning" style={{ height: "60%" }}></div>
                        <span className="company-bar-label">FRI</span>
                      </div>
                      <div className="company-bar-col">
                        <div className="company-bar" style={{ height: "50%" }}></div>
                      </div>
                      <div className="company-bar-col">
                        <div className="company-bar" style={{ height: "40%" }}></div>
                        <span className="company-bar-label">SAT</span>
                      </div>
                      <div className="company-bar-col">
                        <div className="company-bar" style={{ height: "30%" }}></div>
                        <span className="company-bar-label">SUN</span>
                      </div>
                    </div>
                  ) : (
                    <div className="company-chart-empty">
                      <BarChart3 size={40} className="empty-chart-icon" />
                      <h5>No Data Available Yet</h5>
                      <p>Redemption statistics will start displaying here once customers begin scanning your published flyers.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Campaign Pulse Section */}
              <section className="company-pulse-card">
                <h4 className="company-card-title">Campaign Pulse</h4>

                <div className="company-pulse-items">
                  {isDemo ? (
                    <>
                      <div className="company-pulse-item brown-stripe">
                        <h5>Flash Sale: Summer Kickoff</h5>
                        <p>3,420 impressions today</p>
                      </div>
                      <div className="company-pulse-item blue-stripe">
                        <h5>BOGO Drinks Weekend</h5>
                        <p>892 redemptions</p>
                      </div>
                    </>
                  ) : flyersList.length > 0 ? (
                    flyersList.slice(0, 2).map((f, i) => (
                      <div key={f.id} className={`company-pulse-item ${i % 2 === 0 ? "brown-stripe" : "blue-stripe"}`}>
                        <h5>{f.name}</h5>
                        <p>{f.reach} impressions / {f.redemptions} redemptions</p>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: "13px", color: "#8C8070", margin: "10px 0" }}>
                      No active campaign logs. Publish a flyer to start tracking logs.
                    </p>
                  )}
                </div>

                <div className="company-sentiment-section">
                  <div className="company-sentiment-info">
                    <span>Customer Sentiment</span>
                    <span className="company-sentiment-score">{isDemo ? "4.8/5" : "N/A"}</span>
                  </div>
                  <div className="company-sentiment-bar-bg">
                    <div className="company-sentiment-bar-fill" style={{ width: isDemo ? "96%" : "0%" }}></div>
                  </div>
                </div>
              </section>
            </div>

            {/* Recent Flyers Section */}
            <section className="company-recent-flyers">
              <div className="company-table-header-row">
                <h4 className="company-card-title">Recent Flyers</h4>
                {flyersList.length > 0 && (
                  <button className="company-view-all-link">
                    View All <ArrowUpRight size={16} />
                  </button>
                )}
              </div>

              {flyersList.length > 0 ? (
                <div className="company-table-container">
                  <table className="company-flyers-table">
                    <thead>
                      <tr>
                        <th>Flyer Campaign</th>
                        <th>Reach</th>
                        <th>Redemptions</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flyersList.map((flyer) => {
                        const status = getFlyerStatus(flyer.expiryDate);
                        return (
                          <tr key={flyer.id}>
                            <td>
                              <div className="company-campaign-cell">
                                <div className="company-campaign-img">
                                  <img src={flyer.image} alt={flyer.name} />
                                </div>
                                <div className="company-campaign-info">
                                  <h6>{flyer.name}</h6>
                                  <p>{flyer.started}</p>
                                </div>
                              </div>
                            </td>
                            <td className="company-num-cell">{flyer.reach}</td>
                            <td className="company-num-cell">{flyer.redemptions}</td>
                            <td>
                              <span className={`company-status-badge ${status.toLowerCase()}`}>
                                {status}
                              </span>
                            </td>
                            <td>
                              <div className="company-action-dropdown-wrapper">
                                <button
                                  className="company-action-menu-btn"
                                  onClick={(e) => toggleActionMenu(e, flyer.id)}
                                >
                                  <MoreHorizontal size={18} />
                                </button>
                                {activeActionMenuId === flyer.id && (
                                  <>
                                    <div
                                      className="company-dropdown-backdrop"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveActionMenuId(null);
                                      }}
                                    />
                                    <div className="company-action-dropdown-menu">
                                      {deleteConfirmId === flyer.id ? (
                                        <>
                                          <div className="company-delete-confirm-text">Confirm?</div>
                                          <button
                                            className="company-action-dropdown-item delete"
                                            onClick={(e) => handleDeleteClick(e, flyer.id)}
                                          >
                                            Yes, Delete
                                          </button>
                                          <button
                                            className="company-action-dropdown-item"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setDeleteConfirmId(null);
                                            }}
                                          >
                                            Cancel
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            className="company-action-dropdown-item"
                                            onClick={(e) => handleEditClick(e, flyer)}
                                          >
                                            Edit
                                          </button>
                                          <button
                                            className="company-action-dropdown-item delete"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setDeleteConfirmId(flyer.id);
                                            }}
                                          >
                                            Delete
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="company-empty-flyers-view">
                  <Megaphone className="empty-icon" size={48} />
                  <h5>No Flyers Published Yet</h5>
                  <p>Create your first premium campaign using the wizard and start reaching shoppers today.</p>
                  <button
                    className="use-preset-btn"
                    style={{ marginTop: "16px", backgroundColor: "#5C4308", color: "#FFFDF9", border: "none" }}
                    onClick={() => handleMenuClick("My Flyers")}
                  >
                    Create Flyer
                  </button>
                </div>
              )}
            </section>
          </>
        ) : (
          /* Create / Edit Flyer Wizard */
          <div className="company-wizard-container">
            {/* Left Steps Panel */}
            <div className="company-wizard-sidebar">
              <div className="company-wizard-sidebar-header">
                <h2>{editingFlyerId ? "Edit Flyer" : "Create Flyer"}</h2>
                <p>Design a premium offer that stands out. Our savvy shoppers value high-quality visuals and clear benefits.</p>
              </div>

              <div className="company-wizard-steps">
                <div className={`company-wizard-step ${currentStep === 1 ? "active" : ""}`}>
                  <div className="company-step-num">1</div>
                  <div className="company-step-desc">
                    <span className="company-step-tag">STEP 1</span>
                    <span className="company-step-title">Company Details</span>
                  </div>
                </div>

                <div className={`company-wizard-step ${currentStep === 2 ? "active" : ""}`}>
                  <div className="company-step-num">2</div>
                  <div className="company-step-desc">
                    <span className="company-step-tag">STEP 2</span>
                    <span className="company-step-title">Offer & Design</span>
                  </div>
                </div>

                <div className={`company-wizard-step ${currentStep === 3 ? "active" : ""}`}>
                  <div className="company-step-num">3</div>
                  <div className="company-step-desc">
                    <span className="company-step-tag">STEP 3</span>
                    <span className="company-step-title">Finalize</span>
                  </div>
                </div>
              </div>

              <div className="company-wizard-pro-tip">
                <div className="company-pro-tip-title">
                  <MapPin size={16} />
                  <span>PRO TIP</span>
                </div>
                <p>High-resolution images (at least 1200px wide) increase conversion by 42% on our platform.</p>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="company-wizard-form-card">
              {currentStep === 1 && (
                <div className="company-step-content">
                  <div className="company-step-header">
                    <Building size={20} />
                    <h3>Identity & Category</h3>
                  </div>

                  <div className="company-form-row">
                    <div className="company-form-group">
                      <label>Company Name</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Skyline Travel Group"
                      />
                    </div>

                    <div className="company-form-group">
                      <label>Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Select a category</option>
                        <option value="Travel">Travel</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Grocery">Grocery</option>
                        <option value="Skincare">Skincare</option>
                        <option value="Food">Food</option>
                      </select>
                    </div>
                  </div>

                  <div className="company-form-group">
                    <label>Flyer Image</label>
                    <div className="company-image-dropzone">
                      <input
                        type="file"
                        id="flyer-file-input"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                      {flyerImage ? (
                        <div className="company-preview-img-wrapper">
                          <img src={flyerImage} alt="Flyer Preview" className="company-preview-img" />
                          <div className="company-preview-overlay" onClick={triggerFileInput}>
                            <UploadCloud size={24} />
                            <span>Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <div className="company-dropzone-placeholder">
                          <div onClick={triggerFileInput} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                            <UploadCloud size={32} className="company-upload-icon" />
                            <span className="company-dropzone-title">Drop your flyer design here</span>
                            <span className="company-dropzone-subtitle">PNG, JPG or WEBP (Max 10MB)</span>
                          </div>
                          <button
                            type="button"
                            className="use-preset-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFlyerImage("/private_jet.png");
                            }}
                          >
                            Use Jet Template
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="company-step-content">
                  <div className="company-step-header">
                    <Ticket size={20} />
                    <h3>Offer Details & Code</h3>
                  </div>

                  <div className="company-form-group">
                    <label>Campaign / Offer Title</label>
                    <input
                      type="text"
                      value={campaignTitle}
                      onChange={(e) => setCampaignTitle(e.target.value)}
                      placeholder="e.g. 20% Off Business Class"
                    />
                  </div>

                  <div className="company-form-row">
                    <div className="company-form-group">
                      <label>Promo Code</label>
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="e.g. FLYNOW20"
                      />
                    </div>

                    <div className="company-form-group">
                      <label>Expiration Date</label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="company-step-content">
                  <div className="company-step-header">
                    <Sparkles size={20} />
                    <h3>Live Preview & Publish</h3>
                  </div>

                  <div className="company-live-preview-wrapper">
                    <div className="company-flyer-card-preview">
                      <div className="company-flyer-card-img">
                        <img src={flyerImage || "/private_jet.png"} alt="Flyer preview" />
                        <span className="company-flyer-card-badge">NEW OFFER</span>
                      </div>
                      <div className="company-flyer-card-body">
                        <div className="company-flyer-card-title-row">
                          <div className="company-flyer-card-brand-info">
                            <span className="company-flyer-card-brand">{companyName || "Skyline Travel Group"}</span>
                            <h4 className="company-flyer-card-offer">{campaignTitle || "20% Off Business Class"}</h4>
                          </div>
                          <div className="company-flyer-card-action-icon">
                            <Plane size={16} />
                          </div>
                        </div>

                        <div className="company-flyer-card-code-wrapper">
                          <div className="company-flyer-card-code">{promoCode || "FLYNOW20"}</div>
                        </div>

                        <div className="company-flyer-card-footer">
                          <span className="company-flyer-card-expiry">Expires {formatExpiryDate(expiryDate) || "Dec 31"}</span>
                          <span className="company-flyer-card-rare-badge">
                            <Sparkles size={11} />
                            Rare Deal
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="company-wizard-actions">
                {currentStep > 1 && (
                  <button className="company-wizard-back" onClick={() => setCurrentStep(currentStep - 1)}>
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                )}

                {currentStep < 3 ? (
                  <button className="company-wizard-next" onClick={handleNextStep}>
                    <span>Next Step</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button className="company-wizard-publish" onClick={handlePublish}>
                    <span>{editingFlyerId ? "Save Changes" : "Publish Flyer"}</span>
                    <Sparkles size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="company-footer">
          <div className="company-footer-left">
            <h4>FlyNow Business</h4>
            <p>© 2026 FlyNow Premium Discovery. All rights reserved.</p>
          </div>
          <div className="company-footer-right">
            <a href="#about">About Us</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#partner">Partner with Us</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default CompanyDashboard;
