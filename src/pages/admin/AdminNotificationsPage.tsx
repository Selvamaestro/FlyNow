import DashboardLayout from '../../components/DashboardLayout';
import { adminNav } from './admin-nav';
import { notificationService } from '../../lib/services';
import { useAsync } from '../../lib/use-async';
import { TableSkeleton } from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../lib/toast-context';
import { timeAgo, formatDateTime } from '../../lib/utils';
import { Bell, CheckCircle2, XCircle, UserPlus, Building2, Tag, AlertCircle, Trash2, CheckCheck } from 'lucide-react';

const iconFor = (t: string) => {
  if (t.includes('company')) return Building2;
  if (t.includes('coupon')) return Tag;
  if (t.includes('user')) return UserPlus;
  if (t.includes('approv')) return CheckCircle2;
  if (t.includes('reject')) return XCircle;
  return AlertCircle;
};

export default function AdminNotificationsPage() {
  const { show } = useToast();
  const { data: notifs, loading, reload } = useAsync(() => notificationService.listAll(), []);

  const markAll = async () => { try { await notificationService.markAllRead('admin'); show('All marked read', 'success'); reload(); } catch (e) { show((e as Error).message, 'error'); } };
  const remove = async (id: string) => { try { await notificationService.remove(id); show('Notification removed', 'success'); reload(); } catch (e) { show((e as Error).message, 'error'); } };

  return (
    <DashboardLayout items={adminNav} brand="Admin">
      <div className="flex items-center justify-between mb-24">
        <div><h1 style={{ fontSize: 26 }}>Notifications</h1><p className="text-muted mt-8">{(notifs ?? []).length} notifications</p></div>
        <button className="btn btn-secondary btn-sm" onClick={markAll}><CheckCheck size={14} /> Mark all read</button>
      </div>
      {loading ? <TableSkeleton /> : (notifs ?? []).length === 0 ? <EmptyState icon={<Bell size={48} />} title="No notifications" /> : (
        <div className="flex-col gap-8">
          {(notifs ?? []).map((n) => {
            const Icon = iconFor(n.type);
            return (
              <div key={n.id} className="card card-body flex items-center gap-16" style={{ borderColor: n.read ? 'var(--border)' : 'var(--primary)' }}>
                <div className="stat-icon" style={{ width: 40, height: 40, background: 'var(--primary-50)', color: 'var(--primary-dark)' }}><Icon size={18} /></div>
                <div style={{ flex: 1 }}><div className="flex items-center gap-8"><div className="font-semibold">{n.title}</div><span className="badge badge-muted">{n.target_role}</span></div><div className="text-sm text-muted">{n.message}</div><div className="text-xs text-muted mt-8">{formatDateTime(n.created_at)}</div></div>
                <span className="text-xs text-muted">{timeAgo(n.created_at)}</span>
                {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />}
                <button className="btn-icon btn-danger" onClick={() => remove(n.id)}><Trash2 size={15} /></button>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
