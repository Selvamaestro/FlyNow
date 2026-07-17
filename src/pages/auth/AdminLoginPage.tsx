import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../lib/auth-context';
import { useToast } from '../../lib/toast-context';

export default function AdminLoginPage() {
  const { signInAsRole } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signInAsRole(email, password, 'admin');
    setLoading(false);
    if (error) { setError(error); return; }
    show('Welcome, Administrator', 'success');
    navigate('/admin');
  };

  return (
    <AuthLayout title="Admin Portal" subtitle="Restricted access. Administrators only." icon={Shield} accentColor="#E4A817" accentGradient="linear-gradient(135deg, #E4A817, #D89B17)"
      features={['Full platform management', 'Review and approve coupons', 'Manage companies and users', 'Analytics and revenue reports']}
      footerLink={{ to: '/login', label: 'Not an admin? Back to' }}>
      {params.get('suspended') && <div className="badge badge-danger mb-16" style={{ padding: 12, width: '100%' }}><AlertCircle size={16} /> Your account has been suspended.</div>}
      <form onSubmit={submit} className="flex-col gap-16">
        <div className="field">
          <label className="label">Admin Email</label>
          <div className="flex items-center gap-8"><Mail size={18} style={{ color: 'var(--text-muted)' }} /><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@flynow.com" /></div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="flex items-center gap-8"><Lock size={18} style={{ color: 'var(--text-muted)' }} /><input className="input" type={showPw ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />{password && <button type="button" onClick={() => setShowPw(!showPw)} className="btn-icon">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>}</div>
        </div>
        {error && <div className="field-error flex items-center gap-8"><AlertCircle size={14} /> {error}</div>}
        <button className="btn btn-lg w-full" style={{ background: 'linear-gradient(135deg, #E4A817, #D89B17)', color: '#fff', border: 'none' }} disabled={loading}>{loading ? 'Signing in...' : 'Sign In to Admin Portal'}</button>
      </form>
      <p className="text-center text-sm text-muted mt-24">Not an admin? <Link to="/login" style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>User login</Link> · <Link to="/company/login" style={{ color: '#E4A817', fontWeight: 600 }}>Company login</Link></p>
    </AuthLayout>
  );
}
