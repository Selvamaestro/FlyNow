import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';
import { ToastProvider } from './lib/toast-context';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/PublicLayout';

import LandingPage from './pages/user/LandingPage';
import OffersPage from './pages/user/OffersPage';
import CategoriesPage from './pages/user/CategoriesPage';
import CategoryPage from './pages/user/CategoryPage';
import CouponDetailPage from './pages/user/CouponDetailPage';
import SavedCouponsPage from './pages/user/SavedCouponsPage';
import WalletPage from './pages/user/WalletPage';
import ProfilePage from './pages/user/ProfilePage';
import NotificationsPage from './pages/user/NotificationsPage';
import AboutPage from './pages/user/AboutPage';
import ContactPage from './pages/user/ContactPage';

import LoginPage from './pages/auth/LoginPage';
import CompanyLoginPage from './pages/auth/CompanyLoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import CompanyDashboard from './pages/company/CompanyDashboard';
import UploadFlyerPage from './pages/company/UploadFlyerPage';
import UploadFlashSalePage from './pages/company/UploadFlashSalePage';
import MyFlyersPage from './pages/company/MyFlyersPage';
import MyCouponsPage from './pages/company/MyCouponsPage';
import CompanyAnalyticsPage from './pages/company/CompanyAnalyticsPage';
import CompanySettingsPage from './pages/company/CompanySettingsPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategoriesPage from './pages/admin/CategoriesPage';
import CompaniesPage from './pages/admin/CompaniesPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import ReportsPage from './pages/admin/ReportsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/company/login" element={<CompanyLoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Public */}
            <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
            <Route path="/offers" element={<PublicLayout><OffersPage /></PublicLayout>} />
            <Route path="/categories" element={<PublicLayout><CategoriesPage /></PublicLayout>} />
            <Route path="/categories/:slug" element={<PublicLayout><CategoryPage /></PublicLayout>} />
            <Route path="/coupons/:id" element={<PublicLayout><CouponDetailPage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

            {/* User protected */}
            <Route path="/saved" element={<ProtectedRoute roles={['user', 'company', 'admin']}><PublicLayout><SavedCouponsPage /></PublicLayout></ProtectedRoute>} />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute roles={['user', 'company', 'admin']}>
                  <PublicLayout>
                    <WalletPage />
                  </PublicLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<ProtectedRoute><PublicLayout><ProfilePage /></PublicLayout></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><PublicLayout><NotificationsPage /></PublicLayout></ProtectedRoute>} />

            {/* Company */}
            <Route path="/company" element={<ProtectedRoute roles={['company']}><CompanyDashboard /></ProtectedRoute>} />
            <Route path="/company/upload" element={<ProtectedRoute roles={['company']}><UploadFlyerPage /></ProtectedRoute>} />
            <Route path="/company/flash-sale" element={<ProtectedRoute roles={['company']}><UploadFlashSalePage /></ProtectedRoute>} />
            <Route path="/company/flyers" element={<ProtectedRoute roles={['company']}><MyFlyersPage /></ProtectedRoute>} />
            <Route path="/company/coupons" element={<ProtectedRoute roles={['company']}><MyCouponsPage /></ProtectedRoute>} />
            <Route path="/company/analytics" element={<ProtectedRoute roles={['company']}><CompanyAnalyticsPage /></ProtectedRoute>} />
            <Route path="/company/settings" element={<ProtectedRoute roles={['company']}><CompanySettingsPage /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute roles={['admin']}><AdminCategoriesPage /></ProtectedRoute>} />
            <Route path="/admin/companies" element={<ProtectedRoute roles={['admin']}><CompaniesPage /></ProtectedRoute>} />
            <Route path="/admin/coupons" element={<ProtectedRoute roles={['admin']}><AdminCouponsPage /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><ReportsPage /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute roles={['admin']}><AdminNotificationsPage /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><AdminSettingsPage /></ProtectedRoute>} />

            <Route path="*" element={<PublicLayout><div className="empty-state" style={{ minHeight: '60vh' }}><h1 style={{ fontSize: 48 }}>404</h1><p className="text-muted mt-8">Page not found</p><a href="/" className="btn btn-primary mt-24">Go Home</a></div></PublicLayout>} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
