import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CompanyDashboard from "./pages/CompanyDashboard";
import Categories from "./pages/Categories";
import CategoryDetails from "./pages/CategoryDetails";

import Admin from "./pages/admin/Admin";
import CategoryManagement from "./pages/admin/CategoryManagement";
import CouponManagement from "./pages/admin/CouponManagement";
import CompanyManagement from "./pages/admin/CompanyManagement";
import UserManagement from "./pages/admin/UserManagement";
import Reports from "./pages/admin/Reports";
import Analytics from "./pages/admin/Analytics";
import SettingsPage from "./pages/admin/SettingsPage";

const AppRoutes = () => {
  return (

    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/admin" element={<Admin />} />

      <Route
        path="/admin/categories"
        element={<CategoryManagement />}
      />

      <Route
        path="/admin/coupons"
        element={<CouponManagement />}
      />

      <Route
        path="/admin/companies"
        element={<CompanyManagement />}
      />

      <Route
        path="/admin/users"
        element={<UserManagement />}
      />

      <Route
        path="/admin/reports"
        element={<Reports />}
      />

      <Route
        path="/admin/analytics"
        element={<Analytics />}
      />

      <Route
        path="/admin/settings"
        element={<SettingsPage />}
      />
      <Route
        path="/categories"
        element={<Categories />}
      />
      <Route
        path="/category/:categorySlug"
        element={<CategoryDetails />}
      />
      <Route
        path="/company"
        element={<CompanyDashboard />}
      />
      <Route
        path="/company/dashboard"
        element={<CompanyDashboard />}
      />
    </Routes>

  );
};

export default AppRoutes;