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
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back! Please enter your credentials."
      icon={ShoppingBag}
      variant="user"
      leftTitle="New here?"
      leftDesc="Join us today and discover a world of possibilities. Create your account in seconds!"
      leftBtnLabel="SIGN UP"
      leftBtnTo="/register"
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
            id="user-email"
            className="auth-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Mail size={18} className="auth-input-icon" />
        </div>

        <div className="auth-field">
          <input
            id="user-password"
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
          id="user-login-btn"
          className="auth-submit-btn user-btn"
          type="submit"
          disabled={loading}
        >
          {loading && <span className="btn-spinner" />}
          {loading ? 'Signing in...' : 'LOGIN'}
        </button>
      </form>

      <div className="auth-footer" style={{ marginTop: 32 }}>
        <span>Do you have a business account? </span>
        <Link to="/company/login">Company </Link>
        <span> · </span>

      </div>
    </AuthLayout>
  );
}

