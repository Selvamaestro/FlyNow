import { useState } from 'react';
import { Ban, Trash2, Users, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminNav } from './admin-nav';
import { userService } from '../../lib/services';
import { useAsync } from '../../lib/use-async';
import { TableSkeleton } from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../lib/toast-context';
import { formatDate } from '../../lib/utils';

export default function UsersPage() {
  const { show } = useToast();
  const { data: users, loading, reload } = useAsync(() => userService.list(), []);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const list = (users ?? []).filter((u) => filter === 'all' || u.role === filter);

  const setStatus = async (id: string, status: 'active' | 'suspended') => {
    try { await userService.updateStatus(id, status); show(`User ${status}`, 'success'); reload(); } catch (e) { show((e as Error).message, 'error'); }
  };

  const del = async () => {
    if (!toDelete) return;
    try { await userService.remove(toDelete); show('User deleted', 'success'); reload(); } catch (e) { show((e as Error).message, 'error'); }
    setToDelete(null);
  };

  return (
    <DashboardLayout items={adminNav} brand="Admin">
      <div className="flex items-center justify-between mb-24 wrap">
        <div><h1 style={{ fontSize: 26 }}>Users</h1><p className="text-muted mt-8">Manage platform users.</p></div>
        <div className="flex items-center gap-8">
          {['all','user','company','admin'].map((f) => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>
      </div>
      {loading ? <TableSkeleton /> : list.length === 0 ? <EmptyState icon={<Users size={48} />} title="No users" /> : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead><tr><th>User</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id}>
                  <td><div className="flex items-center gap-12"><div className="stat-icon" style={{ width: 36, height: 36, background: 'var(--primary)', color: '#fff', borderRadius: '50%', fontSize: 13 }}>{u.display_name?.[0]?.toUpperCase()}</div><div className="font-semibold">{u.display_name}</div></div></td>
                  <td><span className="badge badge-primary">{u.role}</span></td>
                  <td className="text-sm">{formatDate(u.created_at)}</td>
                  <td><span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{u.status}</span></td>
                  <td>
                    <div className="flex items-center gap-8">
                      <button className="btn-icon btn-secondary" disabled={u.status === 'suspended'} onClick={() => setStatus(u.id, 'suspended')} title="Suspend"><Ban size={15} /></button>
                      <button className="btn-icon btn-success" disabled={u.status === 'active'} onClick={() => setStatus(u.id, 'active')} title="Activate"><CheckCircle size={15} /></button>
                      <button className="btn-icon btn-danger" onClick={() => setToDelete(u.id)} title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog open={!!toDelete} title="Delete User" message="This will permanently remove the user account." danger confirmLabel="Delete" onConfirm={del} onCancel={() => setToDelete(null)} />
    </DashboardLayout>
  );
}
