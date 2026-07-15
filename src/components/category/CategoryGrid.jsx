import "./Category.css";
import categories from "../../data/categories";
import CategoryCard from "./CategoryCard";

const CategoryGrid = () => {
  return (
    <section className="categories-section">
      <div className="category-section-header">
        <div className="category-section-title-box">
          <h2>Browse Categories</h2>
          <p>Curated savings across everything you need</p>
        </div>
        <button className="category-view-all-btn">
          View All
        </button>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;