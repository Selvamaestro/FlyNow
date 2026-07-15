import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  LayoutGrid,
  Tag,
  Zap,
  Wallet,
  Gift,
  User,
  HelpCircle,
  Building2,
  Plane
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { icon: <Home size={20} />, title: "Home", path: "/" },
    { icon: <LayoutGrid size={20} />, title: "Categories", path: "/" },
    { icon: <Tag size={20} />, title: "Today's Offers", path: "/" },
    { icon: <Zap size={20} />, title: "Flash Sales", path: "/" },
    { icon: <Wallet size={20} />, title: "Coupon Wallet", path: "/" },
    { icon: <Gift size={20} />, title: "Rewards", path: "/" },
    { icon: <User size={20} />, title: "Profile", path: "/" },
    {
      icon: <Building2 size={20} />,
      title: "Company Portal",
      path: "/company",
      onClick: () => {
        localStorage.removeItem("flynow_logged_in_company");
      }
    },
    { icon: <HelpCircle size={20} />, title: "Support", path: "/" }
  ];

  return (
    <div className="sidebar">
      <Link to="/" className="logo">
        <div className="logo-icon-box">
          <Plane size={24} style={{ transform: "rotate(-45deg)" }} />
        </div>
        <div className="logo-text-box">
          <h2>FlyNow</h2>
          <span>Premium Savings</span>
        </div>
      </Link>

      <div className="menu">
        {menu.map((item, index) => {
          const isActive = location.pathname === item.path && item.title === "Home" 
            ? location.pathname === "/" 
            : location.pathname === item.path;

          return (
            <Link
              to={item.path}
              className={`menu-item ${isActive ? "active" : ""}`}
              key={index}
              onClick={item.onClick}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>

      <div className="coupon-card">
        <h3>🎉 Daily Rewards</h3>
        <p>Spin today and win exciting coupons.</p>
        <button>Spin Now</button>
      </div>
    </div>
  );
};

export default Sidebar;