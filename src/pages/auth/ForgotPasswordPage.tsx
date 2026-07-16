import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../lib/toast-context';

export default function ForgotPasswordPage() {
  const { show } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) { show(error.message, 'error'); return; }
    setSent(true);
    show('Reset link sent!', 'success');
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a reset link.">
      {sent ? (
        <div className="card card-body text-center">
          <CheckCircle2 size={40} style={{ color: 'var(--success)', margin: '0 auto 12px' }} />
          <h3>Check Your Email</h3>
          <p className="text-muted mt-8">We've sent a password reset link to <strong>{email}</strong>.</p>
          <Link to="/login" className="btn btn-primary mt-16">Back to Login</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="flex-col gap-16">
          <div className="field">
            <label className="label">Email</label>
            <div className="flex items-center gap-8"><Mail size={18} style={{ color: 'var(--text-muted)' }} /><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
          </div>
          <button className="btn btn-primary btn-lg w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
        </form>
      )}
      <p className="text-center text-sm text-muted mt-24"><Link to="/login" style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>Back to login</Link></p>
    </AuthLayout>
  );
}
