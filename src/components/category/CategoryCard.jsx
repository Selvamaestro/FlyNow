import "./Category.css";

import {
  House,
  Laptop,
  Baby,
  Shirt,
  Footprints,
  CookingPot,
  Sparkles,
  ShoppingCart,
  Trophy,
  Sofa,
} from "lucide-react";

const iconMap = {
  home: <House size={52} color="white" />,
  electronics: <Laptop size={52} color="white" />,
  baby: <Baby size={52} color="white" />,
  fashion: <Shirt size={52} color="white" />,
  footwear: <Footprints size={52} color="white" />,
  cookware: <CookingPot size={52} color="white" />,
  skincare: <Sparkles size={52} color="white" />,
  grocery: <ShoppingCart size={52} color="white" />,
  sports: <Trophy size={52} color="white" />,
  furniture: <Sofa size={52} color="white" />,
};

const CategoryCard = ({ category }) => {
  return (
    <div className="category-card">

      <div
        className="category-icon"
        style={{
          background: `linear-gradient(135deg, ${category.gradient[0]}, ${category.gradient[1]})`,
        }}
      >
        {iconMap[category.icon]}
      </div>

      <h3>{category.title}</h3>

      <p className="offer-count">
        {category.offers}
      </p>

    </div>
  );
};

export default CategoryCard;