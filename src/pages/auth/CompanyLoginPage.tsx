import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Building2 } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../lib/auth-context';
import { useToast } from '../../lib/toast-context';

export default function CompanyLoginPage() {
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
    const { error } = await signInAsRole(email, password, 'company');
    setLoading(false);
    if (error) { setError(error); return; }
    show('Welcome back!', 'success');
    navigate('/company');
  };

  return (
    <AuthLayout title="Company Portal" subtitle="Sign in to manage your flyers and coupons." icon={Building2} accentColor="#E4A817" accentGradient="linear-gradient(135deg, #E4A817, #D89B17)"
      features={['Upload unlimited flyers', 'Track coupon performance', 'Real-time analytics dashboard', 'Manage your company profile']}
      footerLink={{ to: '/register', label: "Don't have a company account?" }}>
      {params.get('suspended') && <div className="badge badge-danger mb-16" style={{ padding: 12, width: '100%' }}><AlertCircle size={16} /> Your account has been suspended.</div>}
      <form onSubmit={submit} className="flex-col gap-16">
        <div className="field">
          <label className="label">Company Email</label>
          <div className="flex items-center gap-8"><Mail size={18} style={{ color: 'var(--text-muted)' }} /><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="company@example.com" /></div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="flex items-center gap-8"><Lock size={18} style={{ color: 'var(--text-muted)' }} /><input className="input" type={showPw ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />{password && <button type="button" onClick={() => setShowPw(!showPw)} className="btn-icon">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>}</div>
        </div>
        {error && <div className="field-error flex items-center gap-8"><AlertCircle size={14} /> {error}</div>}
        <div className="flex items-center justify-between">
          <Link to="/forgot-password" className="text-sm" style={{ color: '#E4A817' }}>Forgot password?</Link>
        </div>
        <button className="btn btn-lg w-full" style={{ background: 'linear-gradient(135deg, #E4A817, #D89B17)', color: '#fff', border: 'none' }} disabled={loading}>{loading ? 'Signing in...' : 'Sign In to Company Portal'}</button>
      </form>
      <p className="text-center text-sm text-muted mt-24">Don't have a company account? <Link to="/register" style={{ color: '#E4A817', fontWeight: 600 }}>Register</Link></p>
    </AuthLayout>
  );
}
