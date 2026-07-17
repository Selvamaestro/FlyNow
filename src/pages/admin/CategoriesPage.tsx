import { useState } from 'react';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminNav } from './admin-nav';
import { categoryService, couponService } from '../../lib/services';
import { useAsync } from '../../lib/use-async';
import { TableSkeleton } from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../lib/toast-context';
import { slugify } from '../../lib/utils';
import { getCategoryIcon, categoryGradient } from '../../lib/category-icons';
import type { Category } from '../../lib/types';

export default function CategoriesPage() {
  const { show } = useToast();
  const { data: categories, loading, reload } = useAsync(() => categoryService.list(), []);
  const { data: coupons } = useAsync(() => couponService.listAll(), []);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', color: '#F4B000', icon: 'Tag' });

  const count = (id: string) => (coupons ?? []).filter((c) => c.category_id === id).length;

  const open = (c?: Category) => {
    setEditing(c ?? null);
    setForm(c ? { name: c.name, color: c.color, icon: c.icon } : { name: '', color: '#F4B000', icon: 'Tag' });
    setModal(true);
  };

  const save = async () => {
    if (!form.name) { show('Name is required', 'error'); return; }
    try {
      if (editing) await categoryService.update(editing.id, { ...form, slug: slugify(form.name) });
      else await categoryService.create({ ...form, slug: slugify(form.name) });
      show('Category saved', 'success');
      setModal(false); reload();
    } catch (e) { show((e as Error).message, 'error'); }
  };

  const del = async () => {
    if (!toDelete) return;
    try { await categoryService.remove(toDelete); show('Category deleted', 'success'); reload(); } catch (e) { show((e as Error).message, 'error'); }
    setToDelete(null);
  };

  return (
    <DashboardLayout items={adminNav} brand="Admin">
      <div className="flex items-center justify-between mb-24">
        <div><h1 style={{ fontSize: 26 }}>Categories</h1><p className="text-muted mt-8">Manage coupon categories.</p></div>
        <button className="btn btn-primary" onClick={() => open()}><Plus size={16} /> New Category</button>
      </div>
      {loading ? <TableSkeleton /> : (categories ?? []).length === 0 ? <EmptyState icon={<FolderTree size={48} />} title="No categories" /> : (
        <div className="grid grid-3">
          {(categories ?? []).map((c) => {
            const Icon = getCategoryIcon(c.icon);
            return (
            <div key={c.id} className="card card-body flex items-center gap-16">
              <div className="stat-icon" style={{ width: 48, height: 48, background: categoryGradient(c.color), color: '#fff', borderRadius: 14 }}><Icon size={22} /></div>
              <div style={{ flex: 1 }}><h4 style={{ fontSize: 16 }}>{c.name}</h4><p className="text-xs text-muted">{count(c.id)} offers</p></div>
              <button className="btn-icon btn-secondary" onClick={() => open(c)}><Edit size={15} /></button>
              <button className="btn-icon btn-danger" onClick={() => setToDelete(c.id)}><Trash2 size={15} /></button>
            </div>
            );
          })}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Category' : 'New Category'} maxWidth={460}
        footer={<><button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>Save</button></>}>
        <div className="flex-col gap-16">
          <div className="field"><label className="label">Category Name *</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid grid-2" style={{ gap: 12 }}>
            <div className="field"><label className="label">Color</label><input type="color" className="input" style={{ height: 44, padding: 4 }} value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></div>
            <div className="field"><label className="label">Icon Name</label><input className="input" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Tag, Star..." /></div>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!toDelete} title="Delete Category" message="This will remove the category. Coupons will remain but become uncategorized." danger confirmLabel="Delete" onConfirm={del} onCancel={() => setToDelete(null)} />
    </DashboardLayout>
  );
}
