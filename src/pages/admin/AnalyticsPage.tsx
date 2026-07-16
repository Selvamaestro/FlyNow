import DashboardLayout from '../../components/DashboardLayout';
import { adminNav } from './admin-nav';
import { couponService, userService } from '../../lib/services';
import { useAsync } from '../../lib/use-async';
import { PageLoader } from '../../components/Spinner';
import { BarChart, DonutChart, LineChart } from '../../components/Charts';
import EmptyState from '../../components/EmptyState';

export default function AnalyticsPage() {
  const { data: coupons, loading } = useAsync(() => couponService.listAll(), []);
  const { data: users } = useAsync(() => userService.list(), []);

  if (loading) return <DashboardLayout items={adminNav} brand="Admin"><PageLoader /></DashboardLayout>;
  const cList = coupons ?? [];

  const monthlyRevenue = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth();
    return { label: d.toLocaleString('en', { month: 'short' }), value: cList.filter((c) => new Date(c.created_at).getMonth() === m && c.status === 'approved').length * 49 };
  });

  const catDist = Object.values(cList.reduce((acc, c) => {
    const name = c.category?.name ?? 'Uncategorized';
    acc[name] = acc[name] ?? { label: name, value: 0, color: c.category?.color ?? '#999' };
    acc[name].value++;
    return acc;
  }, {} as Record<string, { label: string; value: number; color: string }>));

  const topCompanies = Object.values(cList.reduce((acc, c) => {
    const name = c.company?.name ?? 'Unknown';
    acc[name] = acc[name] ?? { label: name, value: 0, color: 'var(--primary)' };
    acc[name].value += c.views;
    return acc;
  }, {} as Record<string, { label: string; value: number; color: string }>)).sort((a, b) => b.value - a.value).slice(0, 6);

  const topCoupons = [...cList].sort((a, b) => b.views - a.views).slice(0, 6).map((c) => ({ label: c.title.slice(0, 12), value: c.views, color: 'var(--info)' }));

  const userReg = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    return { label: d.toLocaleString('en', { month: 'short' }), value: (users ?? []).filter((u) => new Date(u.created_at).getMonth() === d.getMonth()).length };
  });

  return (
    <DashboardLayout items={adminNav} brand="Admin">
      <h1 style={{ fontSize: 26 }}>Analytics</h1>
      <p className="text-muted mt-8 mb-24">Platform-wide insights and trends.</p>
      {cList.length === 0 ? <EmptyState title="No data yet" /> : (
        <div className="flex-col gap-24">
          <div className="card card-body"><h3 className="mb-16">Monthly Revenue</h3><LineChart data={monthlyRevenue} color="var(--success)" /></div>
          <div className="grid grid-2" style={{ gap: 24 }}>
            <div className="card card-body"><h3 className="mb-16">Category Distribution</h3>{catDist.length ? <DonutChart data={catDist} /> : <p className="text-muted">No data</p>}</div>
            <div className="card card-body"><h3 className="mb-16">Top Companies (by views)</h3><BarChart data={topCompanies} color="var(--primary)" /></div>
          </div>
          <div className="grid grid-2" style={{ gap: 24 }}>
            <div className="card card-body"><h3 className="mb-16">Most Viewed Coupons</h3><BarChart data={topCoupons} color="var(--info)" /></div>
            <div className="card card-body"><h3 className="mb-16">User Registrations</h3><LineChart data={userReg} color="var(--primary)" /></div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
