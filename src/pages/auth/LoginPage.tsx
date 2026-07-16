import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ShoppingBag } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../lib/auth-context';
import { useToast } from '../../lib/toast-context';

export default function LoginPage() {
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
    const { error } = await signInAsRole(email, password, 'user');
    setLoading(false);
    if (error) { setError(error); return; }
    show('Welcome back!', 'success');
    navigate('/');
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to access your FlyNow account." icon={ShoppingBag} accentColor="var(--primary)" accentGradient="linear-gradient(135deg, #F4B000, #D89700)"
      footerLink={{ to: '/register', label: "Don't have an account?" }}>
      {params.get('suspended') && <div className="badge badge-danger mb-16" style={{ padding: 12, width: '100%' }}><AlertCircle size={16} /> Your account has been suspended.</div>}
      <form onSubmit={submit} className="flex-col gap-16">
        <div className="field">
          <label className="label">Email</label>
          <div className="flex items-center gap-8"><Mail size={18} style={{ color: 'var(--text-muted)' }} /><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="flex items-center gap-8"><Lock size={18} style={{ color: 'var(--text-muted)' }} /><input className="input" type={showPw ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />{password && <button type="button" onClick={() => setShowPw(!showPw)} className="btn-icon">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>}</div>
        </div>
        {error && <div className="field-error flex items-center gap-8"><AlertCircle size={14} /> {error}</div>}
        <div className="flex items-center justify-between">
          <Link to="/forgot-password" className="text-sm" style={{ color: 'var(--primary-dark)' }}>Forgot password?</Link>
        </div>
        <button className="btn btn-primary btn-lg w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
      </form>
      <p className="text-center text-sm text-muted mt-24">Don't have an account? <Link to="/register" style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>Sign up</Link></p>
    </AuthLayout>
  );
}
