import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CompanyDashboard from "./pages/CompanyDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
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