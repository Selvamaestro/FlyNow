import { LayoutDashboard, FolderTree, Building2, Ticket, Users, FileBarChart, BarChart3, Bell, Settings } from 'lucide-react';
import type { NavItem } from '../../components/DashboardLayout';

export const adminNav: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/admin/categories', label: 'Categories', icon: <FolderTree size={18} /> },
  { to: '/admin/companies', label: 'Companies', icon: <Building2 size={18} /> },
  { to: '/admin/coupons', label: 'Coupons', icon: <Ticket size={18} /> },
  { to: '/admin/reports', label: 'Reports', icon: <FileBarChart size={18} /> },
  { to: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  { to: '/admin/notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { to: '/admin/settings', label: 'Settings', icon: <Settings size={18} /> },
];
