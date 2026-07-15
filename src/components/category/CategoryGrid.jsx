import "./Category.css";
import categories from "../../data/categories";
import CategoryCard from "./CategoryCard";
import { Link } from "react-router-dom";

const CategoryGrid = () => {
  return (
    <section className="categories-section">
      <div className="category-section-header">
        <div className="category-section-title-box">
          <h2>Browse Categories</h2>
          <p>Curated savings across everything you need</p>
        </div>
        <Link to="/categories" className="category-view-all-btn" style={{ textDecoration: "none" }}>
          View All
        </Link>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            to={`/category/${category.icon}`}
            style={{ textDecoration: "none" }}
          >
            <CategoryCard
              category={category}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;