import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building2, ShoppingBag, Shield, AlertCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../lib/auth-context';
import { useToast } from '../../lib/toast-context';
import type { Role } from '../../lib/types';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles: { v: Role; l: string; icon: typeof User; desc: string }[] = [
    { v: 'user', l: 'User', icon: ShoppingBag, desc: 'Browse & redeem coupons' },
    { v: 'company', l: 'Company', icon: Building2, desc: 'Upload flyers & coupons' },
    { v: 'admin', l: 'Admin', icon: Shield, desc: 'Manage the platform' },
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    const { error } = await signUp(email, password, name, role);
    setLoading(false);
    if (error) { setError(error); return; }
    show('Account created! Please sign in.', 'success');
    navigate(role === 'company' ? '/company/login' : role === 'admin' ? '/admin/login' : '/login');
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join FlyNow and start saving today.">
      <div className="grid grid-3 mb-24" style={{ gap: 8 }}>
        {roles.map((r) => (
          <button key={r.v} type="button" onClick={() => setRole(r.v)} className="card card-body-sm" style={{ textAlign: 'center', cursor: 'pointer', borderColor: role === r.v ? 'var(--primary)' : 'var(--border)', background: role === r.v ? 'var(--primary-50)' : 'var(--surface)' }}>
            <r.icon size={20} style={{ color: role === r.v ? 'var(--primary-dark)' : 'var(--text-muted)', margin: '0 auto 6px' }} />
            <div className="font-semibold text-sm">{r.l}</div>
            <div className="text-xs text-muted">{r.desc}</div>
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="flex-col gap-16">
        <div className="field">
          <label className="label">{role === 'company' ? 'Company Name' : 'Full Name'}</label>
          <div className="flex items-center gap-8"><User size={18} style={{ color: 'var(--text-muted)' }} /><input className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder={role === 'company' ? 'Acme Inc.' : 'John Doe'} /></div>
        </div>
        <div className="field">
          <label className="label">Email</label>
          <div className="flex items-center gap-8"><Mail size={18} style={{ color: 'var(--text-muted)' }} /><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="flex items-center gap-8"><Lock size={18} style={{ color: 'var(--text-muted)' }} /><input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" /></div>
        </div>
        <div className="field">
          <label className="label">Confirm Password</label>
          <div className="flex items-center gap-8"><Lock size={18} style={{ color: 'var(--text-muted)' }} /><input className="input" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" /></div>
        </div>
        {error && <div className="field-error flex items-center gap-8"><AlertCircle size={14} /> {error}</div>}
        <button className="btn btn-primary btn-lg w-full" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button>
      </form>
      <p className="text-center text-sm text-muted mt-24">Already have an account? <Link to="/login" style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>User sign in</Link> · <Link to="/company/login" style={{ color: '#5B5FEF', fontWeight: 600 }}>Company</Link> · <Link to="/admin/login" style={{ color: 'var(--text)', fontWeight: 600 }}>Admin</Link></p>
    </AuthLayout>
  );
}
