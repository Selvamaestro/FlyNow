import { Inbox } from 'lucide-react';
import { type ReactNode } from 'react';

export default function EmptyState({ icon, title, message, action }: { icon?: ReactNode; title: string; message?: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      {icon ?? <Inbox size={48} />}
      <h3 style={{ marginTop: 12, fontSize: 18 }}>{title}</h3>
      {message && <p className="text-sm mt-8" style={{ maxWidth: 360, margin: '8px auto 0' }}>{message}</p>}
      {action && <div className="mt-24">{action}</div>}
    </div>
  );
}
