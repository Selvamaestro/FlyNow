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

const categoryStyleMap = {
  home: { bg: "#FEF2F2", color: "#B91C1C", iconBg: "#FEE2E2" },
  electronics: { bg: "#EFF6FF", color: "#1E40AF", iconBg: "#DBEAFE" },
  baby: { bg: "#FDF2F8", color: "#9D174D", iconBg: "#FCE7F3" },
  fashion: { bg: "#F5F3FF", color: "#5B21B6", iconBg: "#EDE9FE" },
  footwear: { bg: "#ECFDF5", color: "#047857", iconBg: "#D1FAE5" },
  cookware: { bg: "#FFFBEB", color: "#B45309", iconBg: "#FEF3C7" },
  skincare: { bg: "#F0FDF4", color: "#15803D", iconBg: "#DCFCE7" },
  grocery: { bg: "#F0FDF4", color: "#15803D", iconBg: "#DCFCE7" },
  sports: { bg: "#FEF2F2", color: "#B91C1C", iconBg: "#FEE2E2" },
  furniture: { bg: "#FEF3C7", color: "#B45309", iconBg: "#FEF3C7" },
};

const CategoryCard = ({ category }) => {
  const styles = categoryStyleMap[category.icon] || { bg: "#FAF6F0", color: "#3C3325", iconBg: "#EFE6D9" };

  const iconMap = {
    home: <House size={20} color={styles.color} />,
    electronics: <Laptop size={20} color={styles.color} />,
    baby: <Baby size={20} color={styles.color} />,
    fashion: <Shirt size={20} color={styles.color} />,
    footwear: <Footprints size={20} color={styles.color} />,
    cookware: <CookingPot size={20} color={styles.color} />,
    skincare: <Sparkles size={20} color={styles.color} />,
    grocery: <ShoppingCart size={20} color={styles.color} />,
    sports: <Trophy size={20} color={styles.color} />,
    furniture: <Sofa size={20} color={styles.color} />,
  };

  const displayName = category.title === "Home Products" 
    ? "Home" 
    : category.title === "Baby Products" 
      ? "Baby" 
      : category.title;

  return (
    <div 
      className="category-pill-card"
      style={{ backgroundColor: styles.bg }}
    >
      <div 
        className="category-pill-icon-wrapper"
        style={{ backgroundColor: styles.iconBg }}
      >
        {iconMap[category.icon]}
      </div>
      <span 
        className="category-pill-title"
        style={{ color: styles.color }}
      >
        {displayName}
      </span>
    </div>
  );
};

export default CategoryCard;