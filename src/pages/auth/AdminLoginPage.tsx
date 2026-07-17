import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
    <AuthLayout
      title="Sign in"
      subtitle="Restricted access. Administrators only."
      icon={Shield}
      variant="admin"
      leftTitle="Admin Portal"
      leftDesc="Full platform control at your fingertips. Manage users, companies, analytics and more."
      leftBtnLabel=""
      leftBtnTo=""
      features={[
        'Full platform management',
        'Review and approve coupons',
        'Manage companies and users',
        'Analytics and revenue reports',
      ]}
    >
      {params.get('suspended') && (
        <div className="auth-suspended">
          <AlertCircle size={16} /> Your account has been suspended.
        </div>
      )}

      {error && (
        <div className="auth-error">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={submit}>
        <div className="auth-field">
          <input
            id="admin-email"
            className="auth-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
          />
          <Mail size={18} className="auth-input-icon" />
        </div>

        <div className="auth-field">
          <input
            id="admin-password"
            className="auth-input"
            type={showPw ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <Lock size={18} className="auth-input-icon" />
          {password && (
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="auth-toggle-pw"
              aria-label="Toggle password visibility"
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        <button
          id="admin-login-btn"
          className="auth-submit-btn admin-btn"
          type="submit"
          disabled={loading}
        >
          {loading && <span className="btn-spinner" />}
          {loading ? 'Signing in...' : 'LOGIN'}
        </button>
      </form>


    </AuthLayout>
  );
}
