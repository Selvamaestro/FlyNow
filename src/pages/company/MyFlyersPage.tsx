import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Upload, Plus } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { companyNav } from './company-nav';
import { useCompany } from './use-company';
import { couponService, categoryService } from '../../lib/services';
import { useAsync } from '../../lib/use-async';
import EmptyState from '../../components/EmptyState';
import { TableSkeleton } from '../../components/Spinner';
import ConfirmDialog from '../../components/ConfirmDialog';
import Modal from '../../components/Modal';
import { useToast } from '../../lib/toast-context';
import { formatDate, isExpired } from '../../lib/utils';
import type { Coupon } from '../../lib/types';

export default function MyFlyersPage() {
  const { company } = useCompany();
  const { show } = useToast();
  const { data: coupons, loading, reload } = useAsync(() => (company ? couponService.listByCompany(company.id) : Promise.resolve([])), [company?.id]);
  const { data: categories } = useAsync(() => categoryService.list(), []);
  const [filter, setFilter] = useState('all');
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState({ title: '', description: '', discount: '', coupon_code: '', terms: '', expiry_date: '', category_id: '' });

  const list = (coupons ?? []).filter((c) => filter === 'all' || c.status === filter);

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({ title: c.title, description: c.description, discount: c.discount, coupon_code: c.coupon_code, terms: c.terms, expiry_date: c.expiry_date, category_id: c.category_id ?? '' });
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await couponService.update(editing.id, { ...form, category_id: form.category_id || null });
      show('Flyer updated', 'success');
      setEditing(null);
      reload();
    } catch (e) { show((e as Error).message, 'error'); }
  };

  const del = async () => {
    if (!toDelete) return;
    try { await couponService.remove(toDelete); show('Flyer deleted', 'success'); reload(); } catch (e) { show((e as Error).message, 'error'); }
    setToDelete(null);
  };

  return (
    <DashboardLayout items={companyNav} brand="Company">
      <div className="flex items-center justify-between mb-24 wrap">
        <div><h1 style={{ fontSize: 26 }}>My Flyers</h1><p className="text-muted mt-8">{(coupons ?? []).length} flyers total</p></div>
        <Link to="/company/upload" className="btn btn-primary"><Plus size={16} /> Upload New</Link>
      </div>

      <div className="flex items-center gap-8 mb-24">
        {['all','pending','approved','rejected'].map((f) => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      {loading ? <TableSkeleton /> : list.length === 0 ? <EmptyState icon={<Upload size={48} />} title="No flyers found" message="Upload your first flyer to get started." action={<Link to="/company/upload" className="btn btn-primary">Upload Flyer</Link>} /> : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead><tr><th>Flyer</th><th>Title</th><th>Category</th><th>Discount</th><th>Expiry</th><th>Status</th><th>Views</th><th>Actions</th></tr></thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td><img src={c.flyer_image_url} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} /></td>
                  <td><div className="font-semibold">{c.title}</div><div className="text-xs text-muted">{c.coupon_code}</div></td>
                  <td>{c.category?.name ?? '—'}</td>
                  <td><span className="badge badge-primary">{c.discount}</span></td>
                  <td className={isExpired(c.expiry_date) ? 'text-muted' : ''}>{formatDate(c.expiry_date)}</td>
                  <td><span className={`badge ${c.status === 'approved' ? 'badge-success' : c.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{c.status}</span></td>
                  <td>{c.views}</td>
                  <td>
                    <div className="flex items-center gap-8">
                      <button className="btn-icon btn-secondary" disabled={c.status !== 'pending'} onClick={() => openEdit(c)} title="Edit (pending only)"><Edit size={15} /></button>
                      <button className="btn-icon btn-danger" disabled={c.status !== 'pending'} onClick={() => setToDelete(c.id)} title="Delete (pending only)"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={!!toDelete} title="Delete Flyer" message="This will permanently remove the flyer." danger confirmLabel="Delete" onConfirm={del} onCancel={() => setToDelete(null)} />
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Flyer" maxWidth={520}
        footer={<><button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button><button className="btn btn-primary" onClick={saveEdit}>Save Changes</button></>}>
        <div className="flex-col gap-16">
          <div className="field"><label className="label">Title</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="field"><label className="label">Description</label><textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-2" style={{ gap: 12 }}>
            <div className="field"><label className="label">Category</label><select className="select" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}><option value="">None</option>{(categories ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div className="field"><label className="label">Discount</label><input className="input" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} /></div>
          </div>
          <div className="grid grid-2" style={{ gap: 12 }}>
            <div className="field"><label className="label">Coupon Code</label><input className="input" value={form.coupon_code} onChange={(e) => setForm({ ...form, coupon_code: e.target.value.toUpperCase() })} /></div>
            <div className="field"><label className="label">Expiry Date</label><input type="date" className="input" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} /></div>
          </div>
          <div className="field"><label className="label">Terms</label><textarea className="textarea" value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} /></div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
