import { Download } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminNav } from './admin-nav';
import { couponService, companyService, userService } from '../../lib/services';
import { useAsync } from '../../lib/use-async';
import { PageLoader } from '../../components/Spinner';
import { LineChart, BarChart } from '../../components/Charts';
import { downloadCSV, formatDate } from '../../lib/utils';
import { useToast } from '../../lib/toast-context';

export default function ReportsPage() {
  const { show } = useToast();
  const { data: coupons, loading } = useAsync(() => couponService.listAll(), []);
  const { data: companies } = useAsync(() => companyService.listAll(), []);
  const { data: users } = useAsync(() => userService.list(), []);

  if (loading) return <DashboardLayout items={adminNav} brand="Admin"><PageLoader /></DashboardLayout>;

  const cList = coupons ?? [];
  const coList = companies ?? [];
  const uList = users ?? [];

  const exportRevenue = () => {
    downloadCSV('revenue-report.csv', cList.filter((c) => c.status === 'approved').map((c) => ({ title: c.title, company: c.company?.name, discount: c.discount, revenue: 49, date: formatDate(c.created_at) })));
    show('Revenue report exported', 'success');
  };
  const exportCompanies = () => { downloadCSV('company-report.csv', coList.map((c) => ({ name: c.name, email: c.contact_email, status: c.status, joined: formatDate(c.created_at) }))); show('Company report exported', 'success'); };
  const exportCoupons = () => { downloadCSV('coupon-report.csv', cList.map((c) => ({ title: c.title, company: c.company?.name, status: c.status, views: c.views, expiry: formatDate(c.expiry_date) }))); show('Coupon report exported', 'success'); };
  const exportUsers = () => { downloadCSV('user-report.csv', uList.map((u) => ({ name: u.display_name, role: u.role, status: u.status, joined: formatDate(u.created_at) }))); show('User report exported', 'success'); };

  const userGrowth = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    return { label: d.toLocaleString('en', { month: 'short' }), value: uList.filter((u) => new Date(u.created_at).getMonth() === d.getMonth()).length };
  });

  return (
    <DashboardLayout items={adminNav} brand="Admin">
      <h1 style={{ fontSize: 26 }}>Reports</h1>
      <p className="text-muted mt-8 mb-24">Export platform data and view growth reports.</p>

      <div className="grid grid-4 mb-32">
        <div className="card card-body"><h3 style={{ fontSize: 22 }}>$ {(cList.filter((c) => c.status === 'approved').length * 49)}</h3><p className="text-sm text-muted">Total Revenue</p><button className="btn btn-secondary btn-sm mt-16" onClick={exportRevenue}><Download size={14} /> Export CSV</button></div>
        <div className="card card-body"><h3 style={{ fontSize: 22 }}>{coList.length}</h3><p className="text-sm text-muted">Companies</p><button className="btn btn-secondary btn-sm mt-16" onClick={exportCompanies}><Download size={14} /> Export CSV</button></div>
        <div className="card card-body"><h3 style={{ fontSize: 22 }}>{cList.length}</h3><p className="text-sm text-muted">Coupons</p><button className="btn btn-secondary btn-sm mt-16" onClick={exportCoupons}><Download size={14} /> Export CSV</button></div>
        <div className="card card-body"><h3 style={{ fontSize: 22 }}>{uList.length}</h3><p className="text-sm text-muted">Users</p><button className="btn btn-secondary btn-sm mt-16" onClick={exportUsers}><Download size={14} /> Export CSV</button></div>
      </div>

      <div className="grid grid-2" style={{ gap: 24 }}>
        <div className="card card-body"><h3 className="mb-16">User Growth</h3><LineChart data={userGrowth} /></div>
        <div className="card card-body"><h3 className="mb-16">Coupon Growth</h3><BarChart data={Array.from({ length: 6 }).map((_, i) => { const d = new Date(); d.setMonth(d.getMonth() - (5 - i)); return { label: d.toLocaleString('en', { month: 'short' }), value: cList.filter((c) => new Date(c.created_at).getMonth() === d.getMonth()).length }; })} /></div>
      </div>
    </DashboardLayout>
  );
}
