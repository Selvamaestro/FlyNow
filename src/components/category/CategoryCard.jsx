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
} from "lucide-react";

const categoryStyleMap = {
  home: { bg: "#FDF2F8", color: "#EC4899", iconBg: "#FCE7F3" },
  electronics: { bg: "#EFF6FF", color: "#2563EB", iconBg: "#DBEAFE" },
  fashion: { bg: "#F5F3FF", color: "#7C3AED", iconBg: "#EDE9FE" },
  wellness: { bg: "#ECFDF5", color: "#10B981", iconBg: "#D1FAE5" },
  travel: { bg: "#FFFBEB", color: "#F59E0B", iconBg: "#FEF3C7" },
  dining: { bg: "#FEF2F2", color: "#EF4444", iconBg: "#FEE2E2" },
  automotive: { bg: "#F9FAFB", color: "#4B5563", iconBg: "#F3F4F6" },
  entertainment: { bg: "#FDF2F8", color: "#DB2777", iconBg: "#FCE7F3" },
  learning: { bg: "#ECFEFF", color: "#06B6D4", iconBg: "#CFFAFE" },
  beauty: { bg: "#FFF5F5", color: "#EC4899", iconBg: "#FFE4E6" },
};

const CategoryCard = ({ category }) => {
  const styles = categoryStyleMap[category.icon] || { bg: "#FAF6F0", color: "#3C3325", iconBg: "#EFE6D9" };

  const iconMap = {
    home: <House size={20} color={styles.color} />,
    electronics: <Laptop size={20} color={styles.color} />,
    fashion: <Shirt size={20} color={styles.color} />,
    wellness: <Dumbbell size={20} color={styles.color} />,
    travel: <Plane size={20} color={styles.color} />,
    dining: <Utensils size={20} color={styles.color} />,
    automotive: <Car size={20} color={styles.color} />,
    entertainment: <Tv size={20} color={styles.color} />,
    learning: <GraduationCap size={20} color={styles.color} />,
    beauty: <Sparkles size={20} color={styles.color} />,
  };

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
        {category.title}
      </span>
    </div>
  );
};

export default CategoryCard;