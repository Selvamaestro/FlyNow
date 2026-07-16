import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminNav } from './admin-nav';
import { useAuth } from '../../lib/auth-context';
import { useToast } from '../../lib/toast-context';
import { supabase } from '../../lib/supabase';
import { User, Lock, Save, Palette, Globe } from 'lucide-react';

export default function AdminSettingsPage() {
  const { profile, refreshProfile } = useAuth();
  const { show } = useToast();
  const [name, setName] = useState(profile?.display_name ?? '');
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [theme, setTheme] = useState('light');
  const [platformName, setPlatformName] = useState('FlyNow');

  const saveProfile = async () => {
    const { error } = await supabase.from('profiles').update({ display_name: name }).eq('id', profile!.id);
    if (error) { show(error.message, 'error'); return; }
    await refreshProfile(); show('Profile updated', 'success');
  };

  const changePw = async () => {
    if (pw !== confirm) { show('Passwords do not match', 'error'); return; }
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) { show(error.message, 'error'); return; }
    setPw(''); setConfirm(''); show('Password updated', 'success');
  };

  return (
    <DashboardLayout items={adminNav} brand="Admin">
      <h1 style={{ fontSize: 26 }}>Settings</h1>
      <p className="text-muted mt-8 mb-24">Manage your profile and platform configuration.</p>
      <div className="flex-col gap-24" style={{ maxWidth: 640 }}>
        <div className="card card-body">
          <h3 className="flex items-center gap-8 mb-16"><User size={18} /> Profile Settings</h3>
          <div className="flex items-center gap-16 mb-16">
            <div className="stat-icon" style={{ width: 56, height: 56, background: 'var(--primary)', color: '#fff', borderRadius: '50%', fontSize: 22 }}>{profile?.display_name?.[0]?.toUpperCase()}</div>
            <div><div className="font-semibold">{profile?.display_name}</div><span className="badge badge-primary">{profile?.role}</span></div>
          </div>
          <div className="field mb-16"><label className="label">Display Name</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <button className="btn btn-primary" onClick={saveProfile}><Save size={16} /> Save</button>
        </div>

        <div className="card card-body">
          <h3 className="flex items-center gap-8 mb-16"><Lock size={18} /> Password Management</h3>
          <div className="field mb-16"><label className="label">New Password</label><input type="password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
          <div className="field mb-16"><label className="label">Confirm Password</label><input type="password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
          <button className="btn btn-secondary" onClick={changePw}>Update Password</button>
        </div>

        <div className="card card-body">
          <h3 className="flex items-center gap-8 mb-16"><Palette size={18} /> Theme Options</h3>
          <div className="flex items-center gap-12">
            {['light','amber','warm'].map((t) => (
              <button key={t} className={`card card-body-sm ${theme === t ? '' : ''}`} style={{ cursor: 'pointer', borderColor: theme === t ? 'var(--primary)' : 'var(--border)', background: theme === t ? 'var(--primary-50)' : 'var(--surface)', textTransform: 'capitalize' }} onClick={() => { setTheme(t); show(`Theme set to ${t}`, 'success'); }}>{t}</button>
            ))}
          </div>
        </div>

        <div className="card card-body">
          <h3 className="flex items-center gap-8 mb-16"><Globe size={18} /> Platform Configuration</h3>
          <div className="field mb-16"><label className="label">Platform Name</label><input className="input" value={platformName} onChange={(e) => setPlatformName(e.target.value)} /></div>
          <button className="btn btn-primary" onClick={() => show('Platform settings saved', 'success')}>Save Configuration</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
