import { useAsync } from '../../lib/use-async';
import { couponService, companyService, categoryService, notificationService } from '../../lib/services';
import DashboardLayout from '../../components/DashboardLayout';
import { adminNav } from './admin-nav';
import StatCard from '../../components/StatCard';
import { BarChart, LineChart, DonutChart } from '../../components/Charts';
import { PageLoader } from '../../components/Spinner';
import { FolderTree, Building2, Ticket, DollarSign, FileImage, Activity, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { timeAgo } from '../../lib/utils';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { data: coupons, loading } = useAsync(() => couponService.listAll(), []);
  const { data: companies } = useAsync(() => companyService.listAll(), []);
  const { data: categories } = useAsync(() => categoryService.list(), []);
  const { data: notifs } = useAsync(() => notificationService.listAll(), []);

  const cList = coupons ?? [];
  const coList = companies ?? [];
  const catList = categories ?? [];
  const pendingCoupons = cList.filter((c) => c.status === 'pending');
  const pendingCompanies = coList.filter((c) => c.status === 'pending');
  const approved = cList.filter((c) => c.status === 'approved').length;
  const rejected = cList.filter((c) => c.status === 'rejected').length;
  const revenue = cList.filter((c) => c.status === 'approved').length * 49;

  const monthly = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth();
    return { label: d.toLocaleString('en', { month: 'short' }), value: cList.filter((c) => new Date(c.created_at).getMonth() === m).length };
  });

  const catDist = Object.values(cList.reduce((acc, c) => {
    const name = c.category?.name ?? 'Uncategorized';
    acc[name] = acc[name] ?? { label: name, value: 0, color: c.category?.color ?? '#999' };
    acc[name].value++;
    return acc;
  }, {} as Record<string, { label: string; value: number; color: string }>)).slice(0, 6);

  const health = coList.length > 0 ? 'Healthy' : 'Needs Attention';

  return (
    <DashboardLayout items={adminNav} brand="Admin">
      <div className="flex items-center justify-between mb-24 wrap">
        <div><h1 style={{ fontSize: 26 }}>Welcome, {profile?.display_name}</h1><p className="text-muted mt-8">Platform overview and system health.</p></div>
        <div className="flex items-center gap-12"><span className="badge badge-success"><Activity size={14} /> {health}</span></div>
      </div>

      {loading ? <PageLoader /> : (
        <>
          <div className="grid grid-4 mb-32">
            <StatCard icon={FolderTree} label="Categories" value={catList.length} />
            <StatCard icon={Building2} label="Companies" value={coList.length} bg="var(--info-light)" color="var(--info)" />
            <StatCard icon={Ticket} label="Total Coupons" value={cList.length} bg="var(--success-light)" color="var(--success)" />
            <StatCard icon={DollarSign} label="Revenue" value={`$${revenue}`} bg="var(--warning-light)" color="#B45309" />
          </div>
          <div className="grid grid-4 mb-32">
            <StatCard icon={FileImage} label="Active Flyers" value={approved} bg="var(--primary-50)" color="var(--primary-dark)" />
            <StatCard icon={Clock} label="Pending Approvals" value={pendingCoupons.length + pendingCompanies.length} bg="var(--warning-light)" color="#B45309" />
            <StatCard icon={CheckCircle2} label="Approved" value={approved} bg="var(--success-light)" color="var(--success)" />
            <StatCard icon={XCircle} label="Rejected" value={rejected} bg="var(--danger-light)" color="var(--danger)" />
          </div>

          <div className="grid grid-2 mb-32" style={{ gap: 24 }}>
            <div className="card card-body"><h3 className="mb-16">Revenue Overview</h3><LineChart data={monthly.map((m) => ({ ...m, value: m.value * 49 }))} color="var(--success)" /></div>
            <div className="card card-body"><h3 className="mb-16">Platform Activity</h3><BarChart data={monthly} /></div>
          </div>

          <div className="grid grid-2" style={{ gap: 24 }}>
            <div className="card card-body">
              <div className="flex items-center justify-between mb-16"><h3>Pending Approvals</h3><Link to="/admin/coupons" className="text-sm" style={{ color: 'var(--primary-dark)' }}>View all</Link></div>
              {pendingCoupons.length === 0 ? <p className="text-muted text-sm">No pending coupons.</p> : (
                <div className="flex-col gap-8">
                  {pendingCoupons.slice(0, 4).map((c) => (
                    <div key={c.id} className="flex items-center gap-12 card-body-sm" style={{ background: 'var(--bg)', borderRadius: 10 }}>
                      <img src={c.flyer_image_url} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}><div className="font-semibold text-sm">{c.title}</div><div className="text-xs text-muted">{c.company?.name}</div></div>
                      <span className="badge badge-warning">Pending</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card card-body">
              <h3 className="mb-16">Category Distribution</h3>
              {catDist.length === 0 ? <p className="text-muted text-sm">No data.</p> : <DonutChart data={catDist} />}
            </div>
          </div>

          <div className="grid grid-1 mt-32" style={{ gap: 24 }}>
            <div className="card card-body">
              <h3 className="mb-16">Recent Activity Timeline</h3>
              <div className="flex-col gap-8">
                {(notifs ?? []).slice(0, 6).map((n) => (
                  <div key={n.id} className="flex items-center gap-12 card-body-sm" style={{ background: 'var(--bg)', borderRadius: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: n.read ? 'var(--border)' : 'var(--primary)' }} />
                    <div style={{ flex: 1 }}><div className="font-semibold text-sm">{n.title}</div><div className="text-xs text-muted">{n.message}</div></div>
                    <span className="text-xs text-muted">{timeAgo(n.created_at)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
