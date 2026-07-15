import "./Category.css";

import categories from "../../data/categories";
import CategoryCard from "./CategoryCard";

const CategoryGrid = () => {

  return (

    <section className="categories-section">

      <div className="section-heading">

        <h2>

          Explore Categories

        </h2>

        <p>

          Browse offers from your favourite shopping categories

        </p>

      </div>

      <div className="categories-grid">

        {

          categories.map((category)=>(

            <CategoryCard

              key={category.id}

              category={category}

            />

          ))

        }

      </div>

    </section>

  );

};

export default CategoryGrid;