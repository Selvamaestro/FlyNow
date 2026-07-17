import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tag, Search, User, LogOut, LayoutDashboard, Wallet } from 'lucide-react';
import { useAuth } from '../lib/auth-context';

export default function PublicNavbar() {
  const { profile, signOut } = useAuth();
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

const links = [
  { to: '/', label: 'Home' },
  { to: '/offers', label: 'Offers' },
  { to: '/categories', label: 'Categories' },
  { to: '/wallet', label: 'Wallet' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

  const dashLink = profile?.role === 'company' ? '/company' : profile?.role === 'admin' ? '/admin' : null;

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(250,248,242,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
      <div className="container flex items-center justify-between" style={{ height: 68 }}>
        <Link to="/" className="flex items-center gap-8">
          <div className="stat-icon" style={{ width: 36, height: 36, background: 'var(--primary)', color: '#fff' }}><Tag size={20} /></div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 20 }}>FlyNow</span>
        </Link>

        <nav className="flex items-center gap-24 hide-mobile">
          {links.map((l) => <Link key={l.to} to={l.to} className="text-sm font-medium" style={{ color: 'var(--text-muted)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>{l.label}</Link>)}
        </nav>

        <div className="flex items-center gap-12">
          <button className="btn-icon btn-secondary hide-mobile" onClick={() => navigate('/offers')}><Search size={18} /></button>
          {profile ? (
            <div style={{ position: 'relative' }}>
              <button className="btn btn-secondary btn-sm hide-mobile" onClick={() => setMenu(!menu)}>
                <div className="stat-icon" style={{ width: 26, height: 26, background: 'var(--primary)', color: '#fff', fontSize: 12 }}>{profile.display_name?.[0]?.toUpperCase()}</div>
                {profile.display_name.split(' ')[0]}
              </button>
              {menu && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setMenu(false)} />
                  <div className="card" style={{ position: 'absolute', right: 0, top: 48, zIndex: 50, minWidth: 200, padding: 8 }}>
                    <Link to="/profile" className="sidebar-link" onClick={() => setMenu(false)}><User size={16} /> Profile</Link>
<Link
  to="/wallet"
  className="sidebar-link"
  onClick={() => setMenu(false)}
>
  <Wallet size={16} /> Digital Wallet
</Link>                    {dashLink && <Link to={dashLink} className="sidebar-link" onClick={() => setMenu(false)}><LayoutDashboard size={16} /> Dashboard</Link>}
                    <button className="sidebar-link" style={{ color: 'var(--danger)' }} onClick={() => { signOut(); setMenu(false); navigate('/'); }}><LogOut size={16} /> Logout</button>
                  </div>
                </>
              )}
            </div>
          ) : (
<div className="hide-mobile">
  <Link to="/login" className="btn btn-primary btn-sm">
    Sign In
  </Link>
</div>
          )}
        </div>
      </div>


    </header>
  );
}
