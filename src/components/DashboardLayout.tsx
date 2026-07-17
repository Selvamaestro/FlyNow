import { type ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Tag, Menu, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../lib/auth-context';

export interface NavItem { to: string; label: string; icon: ReactNode; }

interface DashLayoutProps {
  items: NavItem[];
  brand: string;
  children: ReactNode;
}

export default function DashboardLayout({ items, brand, children }: DashLayoutProps) {
  const { profile, signOut } = useAuth();
  const loc = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      {open && <div className="sidebar-overlay hide-mobile" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="stat-icon" style={{ width: 34, height: 34, background: 'var(--primary)', color: '#fff' }}><Tag size={18} /></div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 18 }}>{brand}</span>
        </div>
        <nav className="sidebar-nav">
          {items.map((it) => {
            const active = loc.pathname === it.to || (it.to !== `/${brand.toLowerCase()}` && loc.pathname.startsWith(it.to));
            return (
              <Link key={it.to} to={it.to} className={`sidebar-link ${active ? 'active' : ''}`} onClick={() => setOpen(false)}>
                {it.icon}<span>{it.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-link" style={{ color: 'var(--danger)' }} onClick={() => { signOut(); navigate('/'); }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="topbar">
          <div className="flex items-center gap-12">
            <button className="btn-icon btn-secondary" onClick={() => setOpen(!open)} style={{ display: 'block' }}><Menu size={18} /></button>
            <h3 style={{ fontSize: 18 }}>{items.find((i) => loc.pathname.startsWith(i.to))?.label ?? 'Dashboard'}</h3>
          </div>
          <div className="flex items-center gap-12">
            <button 
              className="btn-icon btn-secondary hide-mobile" 
              onClick={() => navigate(brand.toLowerCase() === 'admin' ? '/admin/notifications' : brand.toLowerCase() === 'company' ? '/company/notifications' : '/notifications')} 
              style={{ position: 'relative' }}
            >
              <Bell size={18} />
              <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, background: 'var(--danger)', borderRadius: '50%' }} />
            </button>
            <div className="stat-icon" style={{ width: 34, height: 34, background: 'var(--primary)', color: '#fff', fontSize: 13 }}>{profile?.display_name?.[0]?.toUpperCase()}</div>
          </div>
        </div>
        <div className="dash-content">{children}</div>
      </div>
    </div>
  );
}
