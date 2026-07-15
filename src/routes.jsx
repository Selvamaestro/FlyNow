import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CompanyDashboard from "./pages/CompanyDashboard";
import Categories from "./pages/Categories";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />
      <Route
        path="/categories"
        element={<Categories />}
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