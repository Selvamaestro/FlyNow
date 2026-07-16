import DashboardLayout from '../../components/DashboardLayout';
import { companyNav } from './company-nav';
import { useCompany } from './use-company';
import { couponService } from '../../lib/services';
import { useAsync } from '../../lib/use-async';
import EmptyState from '../../components/EmptyState';
import { PageLoader } from '../../components/Spinner';
import { Ticket, TrendingUp } from 'lucide-react';
import { formatDate, isExpired } from '../../lib/utils';

export default function MyCouponsPage() {
  const { company } = useCompany();
  const { data: coupons, loading } = useAsync(() => (company ? couponService.listByCompany(company.id) : Promise.resolve([])), [company?.id]);
  const list = coupons ?? [];

  const topPerformers = [...list].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <DashboardLayout items={companyNav} brand="Company">
      <h1 style={{ fontSize: 26 }}>My Coupons</h1>
      <p className="text-muted mt-8 mb-24">Track performance of your approved coupons.</p>
      {loading ? <PageLoader /> : list.length === 0 ? <EmptyState icon={<Ticket size={48} />} title="No coupons yet" /> : (
        <>
          <div className="card card-body mb-24">
            <h3 className="flex items-center gap-8 mb-16"><TrendingUp size={18} /> Top Performing Coupons</h3>
            <div className="flex-col gap-8">
              {topPerformers.map((c, i) => (
                <div key={c.id} className="flex items-center gap-12 card-body-sm" style={{ background: 'var(--bg)', borderRadius: 10 }}>
                  <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 18, color: 'var(--primary-dark)', width: 24 }}>#{i + 1}</span>
                  <img src={c.flyer_image_url} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}><div className="font-semibold text-sm">{c.title}</div><div className="text-xs text-muted">{c.coupon_code} · {c.discount}</div></div>
                  <div className="text-center"><div className="font-bold">{c.views}</div><div className="text-xs text-muted">views</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead><tr><th>Title</th><th>Code</th><th>Discount</th><th>Expiry</th><th>Status</th><th>Views</th></tr></thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id}>
                    <td><div className="font-semibold">{c.title}</div><div className="text-xs text-muted">{c.category?.name ?? '—'}</div></td>
                    <td><span className="badge badge-primary">{c.coupon_code}</span></td>
                    <td>{c.discount}</td>
                    <td className={isExpired(c.expiry_date) ? 'text-muted' : ''}>{formatDate(c.expiry_date)}</td>
                    <td><span className={`badge ${c.status === 'approved' ? 'badge-success' : c.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{c.status}</span></td>
                    <td>{c.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
