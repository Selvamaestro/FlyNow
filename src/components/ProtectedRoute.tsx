import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Role } from '../lib/types';

interface ProtectedProps {
  roles?: Role[];
  children: React.ReactNode;
}

const loginForRole: Record<Role, string> = {
  user: '/login',
  company: '/company/login',
  admin: '/admin/login',
};

export default function ProtectedRoute({ roles, children }: ProtectedProps) {
  const navigate = useNavigate();
  const [state, setState] = useState<'loading' | 'ok' | 'denied'>('loading');

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        navigate(roles && roles.length === 1 ? loginForRole[roles[0]] : '/login');
        return;
      }
      const { data: prof } = await supabase.from('profiles').select('role,status').eq('id', data.session.user.id).maybeSingle();
      if (!prof) {
        navigate(roles && roles.length === 1 ? loginForRole[roles[0]] : '/login');
        return;
      }
      if (prof.status === 'suspended') {
        navigate((roles && roles.length === 1 ? loginForRole[roles[0]] : '/login') + '?suspended=1');
        return;
      }
      if (roles && !roles.includes(prof.role)) {
        setState('denied');
        return;
      }
      setState('ok');
    });
  }, [navigate, roles]);

  if (state === 'loading') return <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}><div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /></div>;
  if (state === 'denied') return <div className="empty-state" style={{ minHeight: '60vh' }}><h2>Access Denied</h2><p className="text-muted mt-8">You don't have permission to view this page.</p><a href="/" className="btn btn-primary mt-24">Go Home</a></div>;
  return <>{children}</>;
}
