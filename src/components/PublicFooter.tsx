import { Link } from 'react-router-dom';
import { Tag, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer style={{ background: 'var(--text)', color: '#fff', marginTop: 80 }}>
      <div className="container" style={{ padding: '56px 24px 24px' }}>
        <div className="grid grid-4" style={{ gap: 40 }}>
          <div>
            <Link to="/" className="flex items-center gap-8 mb-16">
              <div className="stat-icon" style={{ width: 36, height: 36, background: 'var(--primary)', color: '#fff' }}><Tag size={20} /></div>
              <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 20 }}>FlyNow</span>
            </Link>
            <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.6 }}>The premium digital flyer and coupon platform. Discover, save, and redeem exclusive offers from top brands.</p>
            <div className="flex gap-8 mt-16">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="btn-icon" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}><Icon size={16} /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: 15, marginBottom: 16 }}>Explore</h4>
            <div className="flex-col gap-8">
              {[['/offers','All Offers'],['/categories','Categories'],['/about','About Us'],['/contact','Contact']].map(([to,l]) => (
                <Link key={to} to={to} style={{ color: '#aaa', fontSize: 14 }}>{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: 15, marginBottom: 16 }}>For Companies</h4>
            <div className="flex-col gap-8">
              {[['/register','Register Company'],['/login','Company Login'],['/about','How It Works']].map(([to,l]) => (
                <Link key={to} to={to} style={{ color: '#aaa', fontSize: 14 }}>{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: 15, marginBottom: 16 }}>Contact</h4>
            <div className="flex-col gap-8" style={{ color: '#aaa', fontSize: 14 }}>
              <span className="flex items-center gap-8"><Mail size={14} /> hello@flynow.app</span>
              <span className="flex items-center gap-8"><Phone size={14} /> +1 (555) 010-2025</span>
              <span className="flex items-center gap-8"><MapPin size={14} /> 240 Market St, SF</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 40, paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ color: '#aaa', fontSize: 13 }}>© 2025 FlyNow. All rights reserved.</span>
          <div className="flex gap-16" style={{ color: '#aaa', fontSize: 13 }}>
            <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
