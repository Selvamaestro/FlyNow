import { useAsync } from '../../lib/use-async';
import { notificationService } from '../../lib/services';
import { useAuth } from '../../lib/auth-context';
import EmptyState from '../../components/EmptyState';
import { PageLoader } from '../../components/Spinner';
import { timeAgo } from '../../lib/utils';
import { Bell, CheckCircle2, XCircle, UserPlus, Building2, Tag, AlertCircle } from 'lucide-react';

const iconFor = (t: string) => {
  if (t.includes('company')) return Building2;
  if (t.includes('coupon')) return Tag;
  if (t.includes('user')) return UserPlus;
  if (t.includes('approv')) return CheckCircle2;
  if (t.includes('reject')) return XCircle;
  return AlertCircle;
};

export default function NotificationsPage() {
  const { profile } = useAuth();
  const { data: notifs, loading, reload } = useAsync(() => notificationService.list(profile!.role), [profile?.id]);

  if (loading) return <div className="container" style={{ padding: 40 }}><PageLoader /></div>;

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 720 }}>
      <div className="flex items-center justify-between mb-24">
        <div><h1 style={{ fontSize: 32 }}>Notifications</h1><p className="text-muted mt-8">{(notifs ?? []).length} notifications</p></div>
        {profile && (notifs ?? []).some((n) => !n.read) && <button className="btn btn-secondary btn-sm" onClick={async () => { await notificationService.markAllRead(profile.role); reload(); }}>Mark all read</button>}
      </div>
      {(notifs ?? []).length === 0 ? <EmptyState icon={<Bell size={48} />} title="No notifications" message="You're all caught up!" /> : (
        <div className="flex-col gap-8">
          {(notifs ?? []).map((n) => {
            const Icon = iconFor(n.type);
            return (
              <div key={n.id} className="card card-body flex items-center gap-16" style={{ borderColor: n.read ? 'var(--border)' : 'var(--primary)' }}>
                <div className="stat-icon" style={{ width: 40, height: 40, background: 'var(--primary-50)', color: 'var(--primary-dark)' }}><Icon size={18} /></div>
                <div style={{ flex: 1 }}>
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-sm text-muted">{n.message}</div>
                </div>
                <span className="text-xs text-muted">{timeAgo(n.created_at)}</span>
                {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
