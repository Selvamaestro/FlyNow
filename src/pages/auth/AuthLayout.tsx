import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import '../../styles/auth.css';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  icon?: LucideIcon;
  /** 'user' | 'company' | 'admin' – drives gradient + accent colours */
  variant?: 'user' | 'company' | 'admin';
  /** CTA for the left panel */
  leftTitle?: string;
  leftDesc?: string;
  leftBtnLabel?: string;
  leftBtnTo?: string;
  features?: string[];
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  icon: Icon,
  variant = 'user',
  leftTitle = 'New here?',
  leftDesc = 'Join us today and discover a world of possibilities. Create your account in seconds!',
  leftBtnLabel = 'SIGN UP',
  leftBtnTo = '/register',
  features,
}: AuthLayoutProps) {
  const gradientClass =
    variant === 'company'
      ? 'company-gradient'
      : variant === 'admin'
        ? 'admin-gradient'
        : 'user-gradient';

  const badgeClass =
    variant === 'company'
      ? 'company-badge'
      : variant === 'admin'
        ? 'admin-badge'
        : 'user-badge';

  return (
    <div className="auth-page">
      {/* ---------- Left gradient panel ---------- */}
      <div className={`auth-left ${gradientClass}`}>
        {/* Decorative shapes */}
        <div className="auth-decor" />
        <div className="auth-decor" />
        <div className="auth-decor" />

        <div className="auth-left-content">
          {Icon && (
            <div style={{ marginBottom: 20, opacity: 0.9 }}>
              <Icon size={48} strokeWidth={1.5} />
            </div>
          )}
          <h2 className="auth-left-title">{leftTitle}</h2>
          <p className="auth-left-desc">{leftDesc}</p>

          {features && features.length > 0 && (
            <div className="auth-features">
              {features.map((f) => (
                <div key={f} className="auth-feature-item">
                  <span className="auth-feature-check">
                    <CheckCircle2 size={14} />
                  </span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}

          {leftBtnTo && (
            <Link to={leftBtnTo} className="auth-left-btn" style={{ marginTop: features ? 32 : 0 }}>
              {leftBtnLabel}
            </Link>
          )}
        </div>
      </div>

      {/* ---------- Right form panel ---------- */}
      <div className="auth-right">
        <div className="auth-form-container">
          {Icon && (
            <div className={`auth-portal-badge ${badgeClass}`}>
              <Icon size={14} />
              {variant === 'company' ? 'Company Portal' : variant === 'admin' ? 'Admin Portal' : 'User Login'}
            </div>
          )}
          <h1 className="auth-form-title">{title}</h1>
          <p className="auth-form-subtitle">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
