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
    <AuthLayout
      title="Sign in"
      subtitle="Access your company dashboard and manage your campaigns."
      icon={Building2}
      variant="company"
      leftTitle="Grow Your Business"
      leftDesc="Upload flyers, create coupon campaigns, and track performance — all from one powerful dashboard."
      leftBtnLabel="SIGN UP"
      leftBtnTo="/register"
      features={[
        'Upload unlimited flyers',
        'Track coupon performance',
        'Real-time analytics dashboard',
        'Manage your company profile',
      ]}
    >
      {params.get('suspended') && (
        <div className="auth-suspended">
          <AlertCircle size={16} /> Your company account has been suspended.
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
            id="company-email"
            className="auth-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Company Email"
          />
          <Mail size={18} className="auth-input-icon" />
        </div>

        <div className="auth-field">
          <input
            id="company-password"
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

        <Link to="/forgot-password" className="auth-forgot">
          Forgot password?
        </Link>

        <button
          id="company-login-btn"
          className="auth-submit-btn company-btn"
          type="submit"
          disabled={loading}
        >
          {loading && <span className="btn-spinner" />}
          {loading ? 'Signing in...' : 'LOGIN'}
        </button>
      </form>

      <div className="auth-footer" style={{ marginTop: 32 }}>
        <span>Not a business acount? </span>
        <Link to="/login">User</Link>
        <span> · </span>

      </div>
    </AuthLayout>
  );
}

