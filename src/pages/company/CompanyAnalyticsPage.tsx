import DashboardLayout from '../../components/DashboardLayout';
import { companyNav } from './company-nav';
import { useCompany } from './use-company';
import { couponService } from '../../lib/services';
import { useAsync } from '../../lib/use-async';
import StatCard from '../../components/StatCard';
import { BarChart, LineChart } from '../../components/Charts';
import EmptyState from '../../components/EmptyState';
import { PageLoader } from '../../components/Spinner';
import { Eye, Ticket, CheckCircle2, Clock } from 'lucide-react';

export default function CompanyAnalyticsPage() {
  const { company } = useCompany();
  const { data: coupons, loading } = useAsync(() => (company ? couponService.listByCompany(company.id) : Promise.resolve([])), [company?.id]);
  const list = coupons ?? [];
  const totalViews = list.reduce((s, c) => s + c.views, 0);
  const approved = list.filter((c) => c.status === 'approved').length;

  const monthly = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth();
    const count = list.filter((c) => new Date(c.created_at).getMonth() === m).length;
    return { label: d.toLocaleString('en', { month: 'short' }), value: count };
  });

  return (
    <DashboardLayout items={companyNav} brand="Company">
      <h1 style={{ fontSize: 26 }}>Analytics</h1>
      <p className="text-muted mt-8 mb-24">Performance insights for your flyers.</p>
      {loading ? <PageLoader /> : list.length === 0 ? <EmptyState title="No data yet" message="Upload flyers to see analytics." /> : (
        <>
          <div className="grid grid-4 mb-32">
            <StatCard icon={Ticket} label="Total Flyers" value={list.length} />
            <StatCard icon={CheckCircle2} label="Approved" value={approved} bg="var(--success-light)" color="var(--success)" />
            <StatCard icon={Clock} label="Pending" value={list.filter((c) => c.status === 'pending').length} bg="var(--warning-light)" color="#B45309" />
            <StatCard icon={Eye} label="Total Views" value={totalViews} bg="var(--info-light)" color="var(--info)" />
          </div>
          <div className="grid grid-2" style={{ gap: 24 }}>
            <div className="card card-body"><h3 className="mb-16">Coupon Growth</h3><LineChart data={monthly} /></div>
            <div className="card card-body"><h3 className="mb-16">Status Distribution</h3><BarChart data={[{ label: 'Pending', value: list.filter((c) => c.status === 'pending').length }, { label: 'Approved', value: approved }, { label: 'Rejected', value: list.filter((c) => c.status === 'rejected').length }]} /></div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
