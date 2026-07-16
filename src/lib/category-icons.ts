import {
  Home, Laptop, Baby, Shirt, Footprints, CookingPot, Sparkles,
  ShoppingCart, Dumbbell, Sofa, Tag, type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Home, Laptop, Baby, Shirt, Footprints, CookingPot, Sparkles,
  ShoppingCart, Dumbbell, Sofa,
};

export function getCategoryIcon(name: string): LucideIcon {
  return iconMap[name] ?? Tag;
}

export function categoryGradient(color: string): string {
  return `linear-gradient(135deg, ${color}, ${color}cc)`;
}
