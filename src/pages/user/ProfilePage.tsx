import { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { useToast } from '../../lib/toast-context';
import { supabase } from '../../lib/supabase';
import { User, Mail, Lock, Save } from 'lucide-react';

export default function ProfilePage() {
  const { profile, refreshProfile, signOut } = useAuth();
  const { show } = useToast();
  const [name, setName] = useState(profile?.display_name ?? '');
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');

  if (!profile) return null;

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ display_name: name }).eq('id', profile.id);
    setSaving(false);
    if (error) { show(error.message, 'error'); return; }
    await refreshProfile();
    show('Profile updated', 'success');
  };

  const changePw = async () => {
    if (pw !== confirm) { show('Passwords do not match', 'error'); return; }
    if (pw.length < 6) { show('Password too short', 'error'); return; }
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) { show(error.message, 'error'); return; }
    setPw(''); setConfirm('');
    show('Password updated', 'success');
  };

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 720 }}>
      <h1 style={{ fontSize: 32 }}>My Profile</h1>
      <p className="text-muted mt-8 mb-24">Manage your account settings.</p>

      <div className="card card-body mb-24">
        <div className="flex items-center gap-16 mb-24">
          <div className="stat-icon" style={{ width: 64, height: 64, background: 'var(--primary)', color: '#fff', borderRadius: '50%', fontSize: 24 }}>{profile.display_name?.[0]?.toUpperCase()}</div>
          <div><h3>{profile.display_name}</h3><span className="badge badge-primary">{profile.role}</span></div>
        </div>
        <div className="field mb-16">
          <label className="label">Display Name</label>
          <div className="flex items-center gap-8"><User size={18} style={{ color: 'var(--text-muted)' }} /><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
        </div>
        <div className="field mb-24">
          <label className="label">Email</label>
          <div className="flex items-center gap-8"><Mail size={18} style={{ color: 'var(--text-muted)' }} /><input className="input" value={profile.id} disabled style={{ opacity: 0.6 }} /></div>
        </div>
        <button className="btn btn-primary" onClick={saveProfile} disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}</button>
      </div>

      <div className="card card-body">
        <h3 className="flex items-center gap-8 mb-16"><Lock size={18} /> Change Password</h3>
        <div className="field mb-16"><label className="label">New Password</label><input className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
        <div className="field mb-16"><label className="label">Confirm Password</label><input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
        <button className="btn btn-secondary" onClick={changePw}>Update Password</button>
      </div>

      <button className="btn btn-danger mt-24" onClick={signOut}>Sign Out</button>
    </div>
  );
}
