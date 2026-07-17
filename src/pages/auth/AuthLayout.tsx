import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Tag, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  icon?: LucideIcon;
  accentColor?: string;
  accentGradient?: string;
  features?: string[];
  footerLink?: { to: string; label: string };
}

export default function AuthLayout({ title, subtitle, children, icon: Icon = Tag, accentColor = 'var(--primary)', accentGradient = 'linear-gradient(135deg, var(--primary), var(--primary-dark))', features = ['12,000+ verified coupons', '850+ trusted brands', 'Real-time flash sales', 'Save & organize favorites'], footerLink }: AuthLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ maxWidth: 420, width: '100%' }}>
          <Link to="/" className="flex items-center gap-8 mb-32">
            <div className="stat-icon" style={{ width: 38, height: 38, background: accentColor, color: '#fff' }}><Icon size={20} /></div>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 22 }}>FlyNow</span>
          </Link>
          <h1 style={{ fontSize: 28 }}>{title}</h1>
          <p className="text-muted mt-8 mb-32">{subtitle}</p>
          {children}
          {footerLink && <p className="text-center text-sm text-muted mt-24">{footerLink.label} <Link to={footerLink.to} style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>{footerLink.label.includes('Don') ? 'Sign up' : footerLink.label.includes('Back') ? 'Click here' : ''}</Link></p>}
        </div>
      </div>
      <div style={{ flex: 1, background: accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }} className="hide-mobile">
        <div style={{ maxWidth: 420, color: '#fff' }}>
          <h2 style={{ color: '#fff', fontSize: 32, lineHeight: 1.2 }}>The premium way to discover and redeem coupons.</h2>
          <div className="flex-col gap-16 mt-32">
            {features.map((t) => (
              <div key={t} className="flex items-center gap-12"><CheckCircle2 size={20} /> <span style={{ fontSize: 16 }}>{t}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
