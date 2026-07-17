import { useState } from 'react';
import { Eye, CheckCircle, XCircle, Trash2, Ticket } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminNav } from './admin-nav';
import { couponService, notificationService } from '../../lib/services';
import { useAsync } from '../../lib/use-async';
import { TableSkeleton } from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../lib/toast-context';
import { formatDate, isExpired } from '../../lib/utils';
import type { Coupon } from '../../lib/types';

export default function AdminCouponsPage() {
  const { show } = useToast();
  const { data: coupons, loading, reload } = useAsync(() => couponService.listAll(), []);
  const [filter, setFilter] = useState('all');
  const [viewing, setViewing] = useState<Coupon | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const list = (coupons ?? []).filter((c) => filter === 'all' || c.status === filter);

  const setStatus = async (c: Coupon, status: 'approved' | 'rejected') => {
    try {
      await couponService.update(c.id, { status });
      await notificationService.create({ type: status === 'approved' ? 'approval' : 'rejection', title: `Coupon ${status}`, message: `"${c.title}" was ${status}.`, target_role: 'company', ref_id: c.company_id });
      show(`Coupon ${status}`, 'success'); reload();
    } catch (e) { show((e as Error).message, 'error'); }
  };

  const del = async () => {
    if (!toDelete) return;
    try { await couponService.remove(toDelete); show('Coupon deleted', 'success'); reload(); } catch (e) { show((e as Error).message, 'error'); }
    setToDelete(null);
  };

  return (
    <DashboardLayout items={adminNav} brand="Admin">
      <div className="flex items-center justify-between mb-24 wrap">
        <div><h1 style={{ fontSize: 26 }}>Coupon Management</h1><p className="text-muted mt-8">Review submitted coupons. Admins cannot create coupons.</p></div>
        <div className="flex items-center gap-8">
          {['all','pending','approved','rejected'].map((f) => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>
      </div>
      {loading ? <TableSkeleton /> : list.length === 0 ? <EmptyState icon={<Ticket size={48} />} title="No coupons" /> : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead><tr><th>Flyer</th><th>Title</th><th>Company</th><th>Category</th><th>Discount</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td><img src={c.flyer_image_url} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} /></td>
                  <td><div className="font-semibold">{c.title}</div><div className="text-xs text-muted">{c.coupon_code}</div></td>
                  <td>{c.company?.name ?? '—'}</td>
                  <td>{c.category?.name ?? '—'}</td>
                  <td><span className="badge badge-primary">{c.discount}</span></td>
                  <td className={isExpired(c.expiry_date) ? 'text-muted' : ''}>{formatDate(c.expiry_date)}</td>
                  <td><span className={`badge ${c.status === 'approved' ? 'badge-success' : c.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{c.status}</span></td>
                  <td>
                    <div className="flex items-center gap-8">
                      <button className="btn-icon btn-secondary" onClick={() => setViewing(c)} title="View"><Eye size={15} /></button>
                      <button className="btn-icon btn-success" disabled={c.status !== 'pending'} onClick={() => setStatus(c, 'approved')} title="Approve"><CheckCircle size={15} /></button>
                      <button className="btn-icon btn-danger" disabled={c.status !== 'pending'} onClick={() => setStatus(c, 'rejected')} title="Reject"><XCircle size={15} /></button>
                      <button className="btn-icon btn-danger" onClick={() => setToDelete(c.id)} title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Coupon Details" maxWidth={620}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setViewing(null)}>Close</button>
            {viewing?.status === 'pending' && (
              <>
                <button className="btn btn-success" onClick={() => { setStatus(viewing, 'approved'); setViewing(null); }}>Approve</button>
                <button className="btn btn-danger" onClick={() => { setStatus(viewing, 'rejected'); setViewing(null); }}>Reject</button>
              </>
            )}
          </>
        }>
        {viewing && (
          <div className="flex-col gap-16">
            <img src={viewing.flyer_image_url} style={{ width: '100%', height: 220, borderRadius: 12, objectFit: 'cover' }} />
            <div className="flex items-center gap-12">
              {viewing.logo_url ? <img src={viewing.logo_url} style={{ width: 40, height: 40, borderRadius: 10 }} /> : <div className="stat-icon" style={{ width: 40, height: 40, background: 'var(--primary-50)', color: 'var(--primary-dark)' }}>{viewing.company?.name?.[0]}</div>}
              <div><div className="font-semibold">{viewing.company?.name}</div><div className="text-xs text-muted">{viewing.company?.contact_email}</div></div>
              <span className={`badge ${viewing.status === 'approved' ? 'badge-success' : viewing.status === 'pending' ? 'badge-warning' : 'badge-danger'}`} style={{ marginLeft: 'auto' }}>{viewing.status}</span>
            </div>
            <h3>{viewing.title}</h3>
            <div className="badge badge-primary" style={{ fontSize: 16, padding: '8px 14px' }}>{viewing.discount}</div>
            <p className="text-muted">{viewing.description}</p>
            <div className="card card-body-sm" style={{ background: 'var(--primary-50)' }}><div className="text-xs text-muted">Coupon Code</div><div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary-dark)', fontFamily: 'monospace' }}>{viewing.coupon_code}</div></div>
            <div className="grid grid-2" style={{ gap: 12 }}>
              <div><div className="text-xs text-muted">Category</div><div className="font-semibold">{viewing.category?.name ?? '—'}</div></div>
              <div><div className="text-xs text-muted">Expiry Date</div><div className="font-semibold">{formatDate(viewing.expiry_date)}</div></div>
            </div>
            {viewing.terms && <div><div className="text-xs text-muted mb-8">Terms & Conditions</div><p className="text-sm" style={{ whiteSpace: 'pre-line' }}>{viewing.terms}</p></div>}
          </div>
        )}
      </Modal>
      <ConfirmDialog open={!!toDelete} title="Delete Coupon" message="This will permanently remove the coupon submission." danger confirmLabel="Delete" onConfirm={del} onCancel={() => setToDelete(null)} />
    </DashboardLayout>
  );
}
