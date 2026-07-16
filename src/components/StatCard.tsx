import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  color?: string;
  bg?: string;
}

export default function StatCard({ icon: Icon, label, value, trend, color = 'var(--primary-dark)', bg = 'var(--primary-50)' }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div className="stat-icon" style={{ background: bg, color }}>
          <Icon size={22} />
        </div>
        {trend && <span className="text-xs text-muted">{trend}</span>}
      </div>
      <h2 style={{ fontSize: 28, marginTop: 14 }}>{value}</h2>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
