import { useState } from 'react';
import { Eye, CheckCircle, Ban, Trash2, Building2 } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminNav } from './admin-nav';
import { companyService, notificationService } from '../../lib/services';
import { useAsync } from '../../lib/use-async';
import { TableSkeleton } from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../lib/toast-context';
import { formatDate } from '../../lib/utils';
import type { Company } from '../../lib/types';

export default function CompaniesPage() {
  const { show } = useToast();
  const { data: companies, loading, reload } = useAsync(() => companyService.listAll(), []);
  const [filter, setFilter] = useState('all');
  const [viewing, setViewing] = useState<Company | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const list = (companies ?? []).filter((c) => filter === 'all' || c.status === filter);

  const setStatus = async (c: Company, status: 'approved' | 'suspended' | 'pending') => {
    try {
      await companyService.update(c.id, { status });
      await notificationService.create({ type: status === 'approved' ? 'company_approval' : 'company_status', title: `Company ${status}`, message: `${c.name} is now ${status}.`, target_role: 'all', ref_id: c.id });
      show(`Company ${status}`, 'success'); reload();
    } catch (e) { show((e as Error).message, 'error'); }
  };

  const del = async () => {
    if (!toDelete) return;
    try { await companyService.remove(toDelete); show('Company deleted', 'success'); reload(); } catch (e) { show((e as Error).message, 'error'); }
    setToDelete(null);
  };

  return (
    <DashboardLayout items={adminNav} brand="Admin">
      <div className="flex items-center justify-between mb-24 wrap">
        <div><h1 style={{ fontSize: 26 }}>Companies</h1><p className="text-muted mt-8">Approve, suspend, or remove companies.</p></div>
        <div className="flex items-center gap-8">
          {['all','pending','approved','suspended'].map((f) => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>
      </div>
      {loading ? <TableSkeleton /> : list.length === 0 ? <EmptyState icon={<Building2 size={48} />} title="No companies" /> : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead><tr><th>Company</th><th>Contact</th><th>Website</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td><div className="flex items-center gap-12">{c.logo_url ? <img src={c.logo_url} style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} /> : <div className="stat-icon" style={{ width: 40, height: 40, background: 'var(--primary-50)', color: 'var(--primary-dark)' }}>{c.name[0]}</div>}<div><div className="font-semibold">{c.name}</div><div className="text-xs text-muted">{c.description?.slice(0, 40)}</div></div></div></td>
                  <td><div className="text-sm">{c.contact_email}</div><div className="text-xs text-muted">{c.phone}</div></td>
                  <td className="text-sm">{c.website || '—'}</td>
                  <td className="text-sm">{formatDate(c.created_at)}</td>
                  <td><span className={`badge ${c.status === 'approved' ? 'badge-success' : c.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{c.status}</span></td>
                  <td>
                    <div className="flex items-center gap-8">
                      <button className="btn-icon btn-secondary" onClick={() => setViewing(c)} title="View"><Eye size={15} /></button>
                      <button className="btn-icon btn-success" disabled={c.status === 'approved'} onClick={() => setStatus(c, 'approved')} title="Approve"><CheckCircle size={15} /></button>
                      <button className="btn-icon btn-secondary" disabled={c.status === 'suspended'} onClick={() => setStatus(c, 'suspended')} title="Suspend"><Ban size={15} /></button>
                      <button className="btn-icon btn-danger" onClick={() => setToDelete(c.id)} title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Company Details" maxWidth={540}
        footer={<><button className="btn btn-secondary" onClick={() => setViewing(null)}>Close</button>{viewing?.status === 'pending' && <button className="btn btn-success" onClick={() => { setStatus(viewing, 'approved'); setViewing(null); }}>Approve</button>}</>}>
        {viewing && (
          <div className="flex-col gap-16">
            <div className="flex items-center gap-16">
              {viewing.logo_url ? <img src={viewing.logo_url} style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover' }} /> : <div className="stat-icon" style={{ width: 64, height: 64, background: 'var(--primary-50)', color: 'var(--primary-dark)', borderRadius: 14, fontSize: 26 }}>{viewing.name[0]}</div>}
              <div><h3>{viewing.name}</h3><span className={`badge ${viewing.status === 'approved' ? 'badge-success' : viewing.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{viewing.status}</span></div>
            </div>
            <p className="text-muted">{viewing.description}</p>
            <div className="grid grid-2" style={{ gap: 12 }}>
              <div><div className="text-xs text-muted">Email</div><div className="font-semibold">{viewing.contact_email}</div></div>
              <div><div className="text-xs text-muted">Phone</div><div className="font-semibold">{viewing.phone || '—'}</div></div>
              <div><div className="text-xs text-muted">Address</div><div className="font-semibold">{viewing.address || '—'}</div></div>
              <div><div className="text-xs text-muted">Website</div><div className="font-semibold">{viewing.website || '—'}</div></div>
            </div>
          </div>
        )}
      </Modal>
      <ConfirmDialog open={!!toDelete} title="Delete Company" message="This will remove the company and all its coupons." danger confirmLabel="Delete" onConfirm={del} onCancel={() => setToDelete(null)} />
    </DashboardLayout>
  );
}
