import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Building2 } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../lib/auth-context';
import { useToast } from '../../lib/toast-context';

/* Inline SVG social icons */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#1DA1F2">
    <path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

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

      <div className="auth-divider">Or sign in with social platforms</div>

      <div className="auth-social-row">
        <button className="auth-social-btn" aria-label="Sign in with Google" type="button">
          <GoogleIcon />
        </button>
        <button className="auth-social-btn" aria-label="Sign in with Facebook" type="button">
          <FacebookIcon />
        </button>
        <button className="auth-social-btn" aria-label="Sign in with Twitter" type="button">
          <TwitterIcon />
        </button>
        <button className="auth-social-btn" aria-label="Sign in with LinkedIn" type="button">
          <LinkedInIcon />
        </button>
      </div>

      <div className="auth-footer">
        <span>Not a company? </span>
        <Link to="/login">User login</Link>
        <span> · </span>
        <Link to="/admin/login">Admin</Link>
      </div>
    </AuthLayout>
  );
}
