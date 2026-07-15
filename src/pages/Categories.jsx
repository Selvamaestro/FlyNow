import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import categories from "../data/categories";
import {
  House,
  Laptop,
  Shirt,
  Dumbbell,
  Plane,
  Utensils,
  Car,
  Tv,
  GraduationCap,
  Sparkles,
  LayoutGrid,
  List,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import "./Categories.css";

const Categories = () => {
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  const iconMap = {
    home: <House size={22} />,
    electronics: <Laptop size={22} />,
    fashion: <Shirt size={22} />,
    wellness: <Dumbbell size={22} />,
    travel: <Plane size={22} />,
    dining: <Utensils size={22} />,
    automotive: <Car size={22} />,
    entertainment: <Tv size={22} />,
    learning: <GraduationCap size={22} />,
    beauty: <Sparkles size={22} />,
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="content">
        <Navbar />
        
        <main className="categories-page-container">
          {/* Breadcrumbs */}
          <nav className="categories-breadcrumbs">
            <Link to="/">Home</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-active">Categories</span>
          </nav>

          {/* Page Header */}
          <header className="categories-page-header">
            <div className="header-text-block">
              <h1>Discover Savings</h1>
              <p>
                Browse through our curated selection of premium discounts across every facet of your lifestyle.
              </p>
            </div>
            
            {/* View Mode Switcher */}
            <div className="view-mode-switcher">
              <button
                className={`switcher-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid View"
              >
                <LayoutGrid size={16} />
                <span>Grid</span>
              </button>
              <button
                className={`switcher-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="List View"
              >
                <List size={16} />
                <span>List</span>
              </button>
            </div>
          </header>

          {/* Categories Grid or List container */}
          <div className={`categories-content-layout ${viewMode}`}>
            {categories.map((category) => {
              const iconElement = iconMap[category.icon] || <Sparkles size={22} />;
              
              return (
                <div
                  key={category.id}
                  className="category-showcase-card"
                  style={{
                    "--theme-color": category.color,
                    "--theme-bg-light": category.bg,
                    "--badge-color": category.badgeColor,
                    "--badge-bg": category.badgeBg,
                  }}
                >
                  <div className="card-top-row">
                    <div className="category-showcase-icon-box">
                      {iconElement}
                    </div>
                  </div>

                  <div className="card-details-row">
                    <div className="category-title-badge-wrap">
                      <h3 className="category-showcase-title">{category.title}</h3>
                      <span className="category-showcase-badge">{category.offers}</span>
                    </div>
                    
                    <p className="category-showcase-desc">
                      {category.description}
                    </p>
                  </div>

                  <div className="card-action-row">
                    <Link to={`/category/${category.icon}`} className="category-explore-link">
                      <span>{category.exploreText}</span>
                      <ArrowRight size={16} className="explore-arrow" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Categories;
