import "./Admin.css";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getDashboardStats } from "../../services/adminService";
import CategoryManagement from "./CategoryManagement";
import DashboardStats from "./DashboardStats";
import RevenueOverview from "./RevenueOverview";
import PlatformActivity from "./PlatformActivity";
import PendingApprovals from "./PendingApprovals";
import RecentUsers from "./RecentUsers";
import NotificationPanel from "./NotificationPanel";
import QuickActions from "./QuickActions";
import SystemStatus from "./SystemStatus";
import {
  LayoutDashboard,
  Users,
  Building2,
  TicketPercent,
  FileText,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Search,
  FolderTree,
} from "lucide-react";

const Admin = () => {
    const [stats, setStats] = useState({
  totalUsers: 0,
  totalCompanies: 0,
  totalCoupons: 0,
  revenue: 0,
  activeFlyers: 0,
  platformHealth: 0,
});
useEffect(() => {
  const loadDashboard = async () => {
    const data = await getDashboardStats();

    if (data) {
      setStats(data);
    }
  };

  loadDashboard();
}, []);
  return (
    <div className="admin-container">

      {/* Sidebar */}

      <aside className="sidebar">

        <div className="logo">

          <h2>FlyNow</h2>

          <span>Admin</span>

        </div>

        <nav>

<NavLink
  to="/admin"
  className={({ isActive }) => (isActive ? "active" : "")}
>
  <LayoutDashboard size={20}/>
  Dashboard
</NavLink>
<NavLink
  to="/admin/categories"
  className={({ isActive }) => (isActive ? "active" : "")}
>
  <FolderTree size={20}/>
  Categories
</NavLink>
<NavLink
  to="/admin/users"
  className={({ isActive }) => (isActive ? "active" : "")}
>
  <Users size={20}/>
  Users
</NavLink>

<NavLink
  to="/admin/companies"
  className={({ isActive }) => (isActive ? "active" : "")}
>
  <Building2 size={20}/>
  Companies
</NavLink>

<NavLink
  to="/admin/coupons"
  className={({ isActive }) => (isActive ? "active" : "")}
>
  <TicketPercent size={20}/>
  Coupons
</NavLink>

<NavLink
  to="/admin/reports"
  className={({ isActive }) => (isActive ? "active" : "")}
>
  <FileText size={20}/>
  Reports
</NavLink>

<NavLink
  to="/admin/analytics"
  className={({ isActive }) => (isActive ? "active" : "")}
>
  <BarChart3 size={20}/>
  Analytics
</NavLink>

<NavLink
  to="/admin/notifications"
  className={({ isActive }) => (isActive ? "active" : "")}
>
  <Bell size={20}/>
  Notifications
</NavLink>

<NavLink
  to="/admin/settings"
  className={({ isActive }) => (isActive ? "active" : "")}
>
  <Settings size={20}/>
  Settings
</NavLink>
          <a>
            <LogOut size={20} />
            Logout
          </a>

        </nav>

      </aside>

      {/* Main */}

      <main className="main">

        {/* Navbar */}

        <header className="navbar">

          <div className="search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search..."
            />

          </div>

          <div className="profile">

            <img
              src="https://i.pravatar.cc/100"
              alt=""
            />

            <div>

              <h4>Admin</h4>

              <span>Super Admin</span>

            </div>

          </div>

        </header>

        {/* Welcome */}

<section className="welcome">

<div>

<h1>

Welcome Back 👋

</h1>

<p>

Manage companies, users and monitor the FlyNow platform.

</p>

</div>

<div className="hero-actions">

<button>

Generate Report

</button>

<button>

Add Company

</button>

</div>

</section>
        {/* Statistics */}

 <DashboardStats stats={stats} />
{/* Category Management */}

<CategoryManagement />
{/* Analytics Section */}

<section className="analytics-section">

          <RevenueOverview />
          <PlatformActivity />

</section>
{/* Company Management */}

<section className="company-section">

  <div className="section-title">

    <h2>Registered Companies</h2>

    <button>View All</button>

  </div>

  <table className="company-table">

    <thead>

      <tr>
        <th>Company</th>
        <th>Category</th>
        <th>Status</th>
        <th>Coupons</th>
        <th>Revenue</th>
        <th>Action</th>
      </tr>

    </thead>

    <tbody>

      <tr>

        <td>
          <div className="company-info">
            <img src="https://logo.clearbit.com/amazon.com" alt="" />
            <span>Amazon</span>
          </div>
        </td>

        <td>Electronics</td>

        <td>
          <span className="status approved">
            Approved
          </span>
        </td>

        <td>245</td>

        <td>₹5,42,000</td>

        <td>
          <button className="action-btn">View</button>
        </td>

      </tr>

      <tr>

        <td>
          <div className="company-info">
            <img src="https://logo.clearbit.com/samsung.com" alt="" />
            <span>Samsung</span>
          </div>
        </td>

        <td>Electronics</td>

        <td>
          <span className="status pending">
            Pending
          </span>
        </td>

        <td>128</td>

        <td>₹3,85,000</td>

        <td>
          <button className="action-btn">Approve</button>
        </td>

      </tr>

      <tr>

        <td>
          <div className="company-info">
            <img src="https://logo.clearbit.com/nike.com" alt="" />
            <span>Nike</span>
          </div>
        </td>

        <td>Fashion</td>

        <td>
          <span className="status approved">
            Approved
          </span>
        </td>

        <td>189</td>

        <td>₹2,96,000</td>

        <td>
          <button className="action-btn">View</button>
        </td>

      </tr>

      <tr>

        <td>
          <div className="company-info">
            <img src="https://logo.clearbit.com/myntra.com" alt="" />
            <span>Myntra</span>
          </div>
        </td>

        <td>Fashion</td>

        <td>
          <span className="status pending">
            Pending
          </span>
        </td>

        <td>92</td>

        <td>₹1,85,000</td>

        <td>
          <button className="action-btn">Approve</button>
        </td>

      </tr>

    </tbody>

  </table>

</section>
{/* Pending Flyer Approvals */}

<PendingApprovals />
{/* Bottom Dashboard */}

<section className="bottom-dashboard">

  {/* Users */}

  <RecentUsers />

  {/* Notifications */}

  <NotificationPanel />

</section>
{/* Quick Actions & System */}

<section className="admin-footer-grid">

  {/* Quick Actions */}

<QuickActions />
  {/* Activity Timeline */}

  <div className="dashboard-card">

    <h2>Recent Activity</h2>

    <div className="timeline">

      <div className="timeline-item">
        <span className="timeline-dot"></span>
        <p>Amazon flyer approved</p>
      </div>

      <div className="timeline-item">
        <span className="timeline-dot"></span>
        <p>Samsung coupon added</p>
      </div>

      <div className="timeline-item">
        <span className="timeline-dot"></span>
        <p>New company registered</p>
      </div>

      <div className="timeline-item">
        <span className="timeline-dot"></span>
        <p>Platform backup completed</p>
      </div>

      <div className="timeline-item">
        <span className="timeline-dot"></span>
        <p>Monthly report exported</p>
      </div>

    </div>

  </div>

  {/* System Status */}

  <SystemStatus />

</section>

<footer className="admin-footer">

  © 2026 FlyNow Admin Dashboard • Version 2.0

</footer>

      </main>

    </div>
  );
};

export default Admin;