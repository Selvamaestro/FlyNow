import { useAsync } from '../../lib/use-async';
import { couponService } from '../../lib/services';
import { useCompany } from './use-company';
import DashboardLayout from '../../components/DashboardLayout';
import { companyNav } from './company-nav';
import StatCard from '../../components/StatCard';
import { BarChart } from '../../components/Charts';
import { FileImage, Clock, CheckCircle2, Eye, TrendingUp } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import { PageLoader } from '../../components/Spinner';
import { formatDate } from '../../lib/utils';

export default function CompanyDashboard() {
  const { company, loading: coLoading } = useCompany();
  const { data: coupons } = useAsync(() => (company ? couponService.listByCompany(company.id) : Promise.resolve([])), [company?.id]);

  if (coLoading) return <DashboardLayout items={companyNav} brand="Company"><PageLoader /></DashboardLayout>;
  if (!company) return <DashboardLayout items={companyNav} brand="Company"><EmptyState title="No company profile" message="Create your company profile in Settings to start uploading flyers." /></DashboardLayout>;

  const list = coupons ?? [];
  const pending = list.filter((c) => c.status === 'pending').length;
  const approved = list.filter((c) => c.status === 'approved').length;
  const rejected = list.filter((c) => c.status === 'rejected').length;
  const totalViews = list.reduce((s, c) => s + c.views, 0);

  const chartData = [
    { label: 'Pending', value: pending },
    { label: 'Approved', value: approved },
    { label: 'Rejected', value: rejected },
    { label: 'Views', value: Math.floor(totalViews / 10) },
  ];

  return (
    <DashboardLayout items={companyNav} brand="Company">
      <div className="flex items-center justify-between mb-24">
        <div><h1 style={{ fontSize: 26 }}>Welcome, {company.name}</h1><p className="text-muted mt-8">Here's your flyer performance overview.</p></div>
        <span className={`badge ${company.status === 'approved' ? 'badge-success' : company.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{company.status}</span>
      </div>

      <div className="grid grid-4 mb-32">
        <StatCard icon={FileImage} label="Total Flyers" value={list.length} bg="var(--primary-50)" color="var(--primary-dark)" />
        <StatCard icon={Clock} label="Pending" value={pending} bg="var(--warning-light)" color="#B45309" />
        <StatCard icon={CheckCircle2} label="Approved" value={approved} bg="var(--success-light)" color="var(--success)" />
        <StatCard icon={Eye} label="Total Views" value={totalViews} bg="var(--info-light)" color="var(--info)" />
      </div>

      <div className="grid grid-2" style={{ gap: 24 }}>
        <div className="card card-body">
          <h3 className="flex items-center gap-8 mb-16"><TrendingUp size={18} /> Flyer Status Breakdown</h3>
          <BarChart data={chartData} />
        </div>
        <div className="card card-body">
          <h3 className="mb-16">Recent Flyers</h3>
          {list.length === 0 ? <EmptyState title="No flyers yet" /> : (
            <div className="flex-col gap-8">
              {list.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center gap-12 card-body-sm" style={{ background: 'var(--bg)', borderRadius: 10 }}>
                  <img src={c.flyer_image_url} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}><div className="font-semibold text-sm">{c.title}</div><div className="text-xs text-muted">{formatDate(c.created_at)}</div></div>
                  <span className={`badge ${c.status === 'approved' ? 'badge-success' : c.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{c.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
