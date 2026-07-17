import { LayoutDashboard, Upload, Zap, FileImage, Ticket, BarChart3, Settings } from 'lucide-react';
import type { NavItem } from '../../components/DashboardLayout';

export const companyNav: NavItem[] = [
  { to: '/company', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/company/upload', label: 'Upload Flyer', icon: <Upload size={18} /> },
  { to: '/company/flash-sale', label: 'Flash Sale', icon: <Zap size={18} /> },
  { to: '/company/flyers', label: 'My Flyers', icon: <FileImage size={18} /> },
  { to: '/company/coupons', label: 'My Coupons', icon: <Ticket size={18} /> },
  { to: '/company/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  { to: '/company/settings', label: 'Settings', icon: <Settings size={18} /> },
];
