
import DashboardLayout from '../../components/DashboardLayout';
import { companyNav } from './company-nav';
import { notificationService } from '../../lib/services';
import { useCompany } from './use-company';
import { useAsync } from '../../lib/use-async';
import { TableSkeleton } from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../lib/toast-context';
import { timeAgo, formatDateTime } from '../../lib/utils';
import { Bell, CheckCircle2, XCircle, Tag, AlertCircle, Trash2, CheckCheck, Zap } from 'lucide-react';

const iconFor = (t: string) => {
  if (t.includes('pending')) return AlertCircle;
  if (t.includes('approval')) return CheckCircle2;
  if (t.includes('reject')) return XCircle;
  if (t.includes('flash')) return Zap;
  return Tag;
};

export default function CompanyNotificationsPage() {
  const { company, loading: coLoading } = useCompany();
  const { show } = useToast();
  
  const { data: allNotifs, loading: notifLoading, reload } = useAsync(async () => {
    if (!company) return [];
    return notificationService.list('company');
  }, [company]);

  const notifs = (allNotifs ?? []).filter(
    (n) => n.ref_id === company?.id || n.target_role === 'all'
  );

  const markAll = async () => {
    try {
      await notificationService.markAllRead('company');
      show('All notifications marked as read', 'success');
      reload();
    } catch (e) {
      show((e as Error).message, 'error');
    }
  };

  const remove = async (id: string) => {
    try {
      await notificationService.remove(id);
      show('Notification removed', 'success');
      reload();
    } catch (e) {
      show((e as Error).message, 'error');
    }
  };

  const getCardColor = (n: any) => {
    if (!n.read) return 'var(--primary-100)';
    if (n.type.includes('reject')) return '#FFF5F5';
    if (n.type.includes('approval')) return '#F3FCF5';
    return 'var(--bg)';
  };

  const getBorderColor = (n: any) => {
    if (!n.read) return 'var(--primary)';
    if (n.type.includes('reject')) return '#FEB2B2';
    if (n.type.includes('approval')) return '#C6F6D5';
    return 'var(--border)';
  };

  if (coLoading) return <DashboardLayout items={companyNav} brand="Company"><TableSkeleton /></DashboardLayout>;

  return (
    <DashboardLayout items={companyNav} brand="Company">
      <div className="flex items-center justify-between mb-24">
        <div>
          <h1 style={{ fontSize: 26, margin: 0 }}>Company Notifications</h1>
          <p className="text-muted mt-8">{notifs.length} messages received</p>
        </div>
        {notifs.length > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={markAll}>
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {notifLoading ? (
        <TableSkeleton />
      ) : notifs.length === 0 ? (
        <EmptyState icon={<Bell size={48} />} title="No notifications yet" />
      ) : (
        <div className="flex-col gap-12">
          {notifs.map((n) => {
            const Icon = iconFor(n.type);
            const isApproved = n.type.includes('approval') || n.title.toLowerCase().includes('approved');
            const isRejected = n.type.includes('reject') || n.title.toLowerCase().includes('rejected');
            
            return (
              <div 
                key={n.id} 
                className="card card-body flex items-center gap-16" 
                style={{ 
                  background: getCardColor(n),
                  borderColor: getBorderColor(n),
                  transition: 'all 0.2s ease',
                  borderWidth: n.read ? '1px' : '2px'
                }}
              >
                <div 
                  className="stat-icon" 
                  style={{ 
                    width: 42, 
                    height: 42, 
                    background: isApproved ? '#DEF7EC' : isRejected ? '#FDE8E8' : 'var(--primary-50)', 
                    color: isApproved ? '#03543F' : isRejected ? '#9B1C1C' : 'var(--primary-dark)' 
                  }}
                >
                  <Icon size={20} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-8 flex-wrap">
                    <div className="font-semibold" style={{ fontSize: 16 }}>{n.title}</div>
                    {isApproved && <span className="badge badge-success" style={{ background: '#DEF7EC', color: '#03543F' }}>Approved</span>}
                    {isRejected && <span className="badge badge-danger" style={{ background: '#FDE8E8', color: '#9B1C1C' }}>Rejected</span>}
                    {n.type.includes('pending') && <span className="badge badge-warning" style={{ background: '#FEF08A', color: '#854D0E' }}>Pending Review</span>}
                  </div>
                  
                  <div className="text-sm text-muted mt-4" style={{ lineHeight: 1.5 }}>{n.message}</div>
                  <div className="text-xs text-muted mt-8">{formatDateTime(n.created_at)}</div>
                </div>

                <div className="flex items-center gap-12">
                  <span className="text-xs text-muted hide-mobile">{timeAgo(n.created_at)}</span>
                  {!n.read && (
                    <span 
                      style={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        background: 'var(--primary)',
                        display: 'inline-block' 
                      }} 
                    />
                  )}
                  <button 
                    className="btn-icon btn-danger" 
                    onClick={() => remove(n.id)}
                    style={{ padding: 8, borderRadius: 8 }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
