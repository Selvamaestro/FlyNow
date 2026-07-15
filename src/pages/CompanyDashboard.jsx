import React, { useState } from "react";
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

  // Form states - empty by default
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState("");
  const [campaignTitle, setCampaignTitle] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [flyerImage, setFlyerImage] = useState("");

  const [flyersList, setFlyersList] = useState([
    {
      id: 1,
      name: "Early Bird Coffee 20%",
      started: "Started 3 days ago",
      reach: "12,402",
      redemptions: "842",
      status: "Active",
      image: "/coffee_flyer.png"
    },
    {
      id: 2,
      name: "Luxury Accessories Flash",
      started: "Ended 2 hours ago",
      reach: "45,120",
      redemptions: "2,109",
      status: "Expired",
      image: "/accessories_flyer.png"
    },
    {
      id: 3,
      name: "Weekend Market Specials",
      started: "Started 1 day ago",
      reach: "8,230",
      redemptions: "312",
      status: "Active",
      image: "/market_flyer.png"
    }
  ]);

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
    } else if (menuName === "My Flyers") {
      setView("create-flyer");
      setCurrentStep(1);
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
        alert("Please enter an Expiration Date.");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePublish = () => {
    if (!companyName.trim() || !category || !flyerImage || !campaignTitle.trim() || !promoCode.trim() || !expiryDate.trim()) {
      alert("Please ensure all fields in all steps are completely filled before publishing.");
      return;
    }

    const newFlyer = {
      id: Date.now(),
      name: campaignTitle,
      started: "Started just now",
      reach: "0",
      redemptions: "0",
      status: "Active",
      image: flyerImage
    };
    setFlyersList([newFlyer, ...flyersList]);
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
      </aside>

      {/* Main Content */}
      <main className="company-content-wrapper">
        {/* Header */}
        <header className="company-header">
          <div className="company-header-left">
            <h1 className="company-title">
              {view === "create-flyer" ? "Create Flyer" : "Overview"}
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
            <div className="company-profile-avatar">
              <img src="https://i.pravatar.cc/100?img=47" alt="Profile" />
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
                  <h3 className="company-stat-value">1,429</h3>
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
                  <h3 className="company-stat-value">$12,840</h3>
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
                  <h3 className="company-stat-value">{flyersList.filter(f => f.status === "Active").length + 21}</h3>
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
                </div>

                <div className="company-chart-container">
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
                </div>
              </section>

              {/* Campaign Pulse Section */}
              <section className="company-pulse-card">
                <h4 className="company-card-title">Campaign Pulse</h4>
                
                <div className="company-pulse-items">
                  <div className="company-pulse-item brown-stripe">
                    <h5>Flash Sale: Summer Kickoff</h5>
                    <p>3,420 impressions today</p>
                  </div>

                  <div className="company-pulse-item blue-stripe">
                    <h5>BOGO Drinks Weekend</h5>
                    <p>892 redemptions</p>
                  </div>
                </div>

                <div className="company-sentiment-section">
                  <div className="company-sentiment-info">
                    <span>Customer Sentiment</span>
                    <span className="company-sentiment-score">4.8/5</span>
                  </div>
                  <div className="company-sentiment-bar-bg">
                    <div className="company-sentiment-bar-fill" style={{ width: "96%" }}></div>
                  </div>
                </div>
              </section>
            </div>

            {/* Recent Flyers Section */}
            <section className="company-recent-flyers">
              <div className="company-table-header-row">
                <h4 className="company-card-title">Recent Flyers</h4>
                <button className="company-view-all-link">
                  View All <ArrowUpRight size={16} />
                </button>
              </div>

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
                    {flyersList.map((flyer) => (
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
                          <span className={`company-status-badge ${flyer.status.toLowerCase()}`}>
                            {flyer.status}
                          </span>
                        </td>
                        <td>
                          <button className="company-action-menu-btn">
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : (
          /* Create Flyer Wizard */
          <div className="company-wizard-container">
            {/* Left Steps Panel */}
            <div className="company-wizard-sidebar">
              <div className="company-wizard-sidebar-header">
                <h2>Create Flyer</h2>
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
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="e.g. Dec 31"
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
                          <span className="company-flyer-card-expiry">Expires {expiryDate || "Dec 31"}</span>
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
                    <span>Publish Flyer</span>
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
            <p>© 2024 FlyNow Premium Discovery. All rights reserved.</p>
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
