import { useState, useRef } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminNav } from './admin-nav';
import { useAuth } from '../../lib/auth-context';
import { useToast } from '../../lib/toast-context';
import { supabase } from '../../lib/supabase';
import { Camera, Trash2, Shield, LogOut, AlertTriangle } from 'lucide-react';

export default function AdminSettingsPage() {
  const { profile, session, refreshProfile, signOut } = useAuth();
  const { show } = useToast();

  // Profile fields
  const [firstName, setFirstName] = useState(() => {
    const parts = (profile?.display_name ?? '').split(' ');
    return parts[0] || '';
  });
  const [lastName, setLastName] = useState(() => {
    const parts = (profile?.display_name ?? '').split(' ');
    return parts.slice(1).join(' ') || '';
  });
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '');
  const fileRef = useRef<HTMLInputElement>(null);

  // Security fields
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [twoStep, setTwoStep] = useState(true);
  const [supportAccess, setSupportAccess] = useState(true);

  const userEmail = session?.user?.email ?? '';

  /* ── Helpers ── */
  const saveProfile = async () => {
    const displayName = `${firstName} ${lastName}`.trim();
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName, avatar_url: avatarUrl || null })
      .eq('id', profile!.id);
    if (error) { show(error.message, 'error'); return; }
    await refreshProfile();
    show('Profile saved successfully', 'success');
  };

  const changeEmail = async () => {
    const newEmail = prompt('Enter your new email address:');
    if (!newEmail) return;
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) { show(error.message, 'error'); return; }
    show('Confirmation email sent. Please verify your new address.', 'success');
  };

  const changePassword = async () => {
    if (!newPw) { show('Please enter a new password', 'error'); return; }
    if (newPw !== confirmPw) { show('Passwords do not match', 'error'); return; }
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) { show(error.message, 'error'); return; }
    setNewPw(''); setConfirmPw('');
    show('Password updated successfully', 'success');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { show('Image must be under 2MB', 'error'); return; }
    const ext = file.name.split('.').pop();
    const path = `avatars/${profile!.id}.${ext}`;
    const { error } = await supabase.storage.from('flyers').upload(path, file, { upsert: true });
    if (error) { show(error.message, 'error'); return; }
    const { data } = supabase.storage.from('flyers').getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', profile!.id);
    await refreshProfile();
    show('Profile image updated', 'success');
  };

  const removeImage = async () => {
    setAvatarUrl('');
    await supabase.from('profiles').update({ avatar_url: null }).eq('id', profile!.id);
    await refreshProfile();
    show('Profile image removed', 'success');
  };

  const handleLogOutAll = async () => {
    await supabase.auth.signOut({ scope: 'global' });
    show('Logged out of all devices', 'success');
    signOut();
  };

  const handleDeleteAccount = () => {
    show('Account deletion requires contacting system administrator', 'error');
  };

  /* ── Shared Styles ── */
  const sectionCard: React.CSSProperties = {
    background: '#fff',
    borderRadius: 20,
    padding: '36px 40px',
    boxShadow: '0 6px 24px rgba(0,0,0,0.04)',
    border: '1px solid #F0ECDF',
    marginBottom: 28,
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 700,
    color: '#222',
    marginBottom: 28,
    paddingBottom: 16,
    borderBottom: '1px solid #F0ECDF',
  };

  const label: React.CSSProperties = {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
    marginBottom: 8,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 18px',
    borderRadius: 12,
    border: '1.5px solid #E8E2D0',
    fontSize: 15,
    color: '#333',
    background: '#FDFCF8',
    outline: 'none',
    transition: 'border-color 0.25s, box-shadow 0.25s',
    fontFamily: 'inherit',
  };

  const outlineBtn: React.CSSProperties = {
    padding: '10px 22px',
    borderRadius: 10,
    border: '1.5px solid #222',
    background: '#fff',
    color: '#222',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.25s',
    fontFamily: 'inherit',
  };

  const rowBetween: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  };

  const divider: React.CSSProperties = {
    height: 1,
    background: '#F0ECDF',
    margin: '24px 0',
    border: 'none',
  };

  return (
    <DashboardLayout items={adminNav} brand="Admin">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#222',
            marginBottom: 8,
          }}
        >
          Settings
        </h1>
        <p style={{ color: '#888', fontSize: 16 }}>
          Manage your profile, security, and account preferences.
        </p>
      </div>

      <div style={{ maxWidth: '100%' }}>

        {/* ═══════ MY PROFILE ═══════ */}
        <div style={sectionCard}>
          <h2 style={sectionTitle}>My Profile</h2>

          {/* Avatar row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            {/* Avatar */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: avatarUrl
                  ? `url(${avatarUrl}) center/cover no-repeat`
                  : 'linear-gradient(135deg, #D89B17, #F4B000)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 28,
                fontWeight: 700,
                flexShrink: 0,
                boxShadow: '0 4px 16px rgba(216,155,23,0.25)',
              }}
            >
              {!avatarUrl && (profile?.display_name?.[0]?.toUpperCase() || 'A')}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#222',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.25s',
                  fontFamily: 'inherit',
                }}
              >
                <Camera size={15} /> Change Image
              </button>
              <button
                onClick={removeImage}
                style={outlineBtn}
              >
                Remove Image
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/gif"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </div>
          </div>
          <p style={{ color: '#aaa', fontSize: 13, marginTop: -16, marginBottom: 28, marginLeft: 92 }}>
            We support PNGs, JPEGs and GIFs under 2MB
          </p>

          {/* Name fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 6 }}>
            <div>
              <label style={label}>First Name</label>
              <input
                style={inputStyle}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                onFocus={(e) => { e.target.style.borderColor = '#D89B17'; e.target.style.boxShadow = '0 0 0 3px rgba(216,155,23,0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E8E2D0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <label style={label}>Last Name</label>
              <input
                style={inputStyle}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                onFocus={(e) => { e.target.style.borderColor = '#D89B17'; e.target.style.boxShadow = '0 0 0 3px rgba(216,155,23,0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E8E2D0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          {/* Save profile */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <button
              onClick={saveProfile}
              style={{
                padding: '12px 28px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #D89B17, #E4A817)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(216,155,23,0.3)',
                transition: 'all 0.3s',
                fontFamily: 'inherit',
              }}
            >
              Save Profile
            </button>
          </div>
        </div>

        {/* ═══════ ACCOUNT SECURITY ═══════ */}
        <div style={sectionCard}>
          <h2 style={sectionTitle}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <Shield size={20} color="#D89B17" /> Account Security
            </span>
          </h2>

          {/* Email */}
          <div style={{ marginBottom: 24 }}>
            <label style={label}>Email</label>
            <div style={rowBetween}>
              <input
                style={{ ...inputStyle, maxWidth: 380, background: '#F7F5EE', color: '#888' }}
                value={userEmail}
                readOnly
              />
              <button onClick={changeEmail} style={outlineBtn}>
                Change email
              </button>
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={label}>Password</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={rowBetween}>
                <input
                  type="password"
                  style={{ ...inputStyle, maxWidth: 380 }}
                  placeholder="New password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  onFocus={(e) => { e.target.style.borderColor = '#D89B17'; e.target.style.boxShadow = '0 0 0 3px rgba(216,155,23,0.12)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8E2D0'; e.target.style.boxShadow = 'none'; }}
                />
                <button onClick={changePassword} style={outlineBtn}>
                  Change password
                </button>
              </div>
              {newPw && (
                <input
                  type="password"
                  style={{ ...inputStyle, maxWidth: 380 }}
                  placeholder="Confirm new password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  onFocus={(e) => { e.target.style.borderColor = '#D89B17'; e.target.style.boxShadow = '0 0 0 3px rgba(216,155,23,0.12)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8E2D0'; e.target.style.boxShadow = 'none'; }}
                />
              )}
            </div>
          </div>

          <hr style={divider} />

          {/* 2-Step Verification */}
          <div style={rowBetween}>
            <div>
              <div style={{ fontWeight: 600, color: '#222', fontSize: 15, marginBottom: 4 }}>
                2-Step Verification
              </div>
              <p style={{ color: '#888', fontSize: 13, margin: 0 }}>
                Add an additional layer of security to your account during login.
              </p>
            </div>
            <button
              onClick={() => { setTwoStep(!twoStep); show(`2-Step verification ${!twoStep ? 'enabled' : 'disabled'}`, 'success'); }}
              style={{
                width: 52,
                height: 28,
                borderRadius: 50,
                border: 'none',
                background: twoStep ? '#D89B17' : '#D4D0C3',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.3s',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: 3,
                  left: twoStep ? 27 : 3,
                  transition: 'left 0.3s',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}
              />
            </button>
          </div>
        </div>

        {/* ═══════ SUPPORT ACCESS ═══════ */}
        <div style={sectionCard}>
          <h2 style={sectionTitle}>Support Access</h2>

          {/* Support access toggle */}
          <div style={{ ...rowBetween, marginBottom: 24 }}>
            <div>
              <div style={{ fontWeight: 600, color: '#222', fontSize: 15, marginBottom: 4 }}>
                Support access
              </div>
              <p style={{ color: '#888', fontSize: 13, margin: 0 }}>
                You have granted us access to your account for support purposes until{' '}
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}.
              </p>
            </div>
            <button
              onClick={() => { setSupportAccess(!supportAccess); show(`Support access ${!supportAccess ? 'granted' : 'revoked'}`, 'success'); }}
              style={{
                width: 52,
                height: 28,
                borderRadius: 50,
                border: 'none',
                background: supportAccess ? '#D89B17' : '#D4D0C3',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.3s',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: 3,
                  left: supportAccess ? 27 : 3,
                  transition: 'left 0.3s',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}
              />
            </button>
          </div>

          <hr style={divider} />

          {/* Log out all devices */}
          <div style={{ ...rowBetween, marginBottom: 24 }}>
            <div>
              <div style={{ fontWeight: 600, color: '#222', fontSize: 15, marginBottom: 4 }}>
                Log out of all devices
              </div>
              <p style={{ color: '#888', fontSize: 13, margin: 0 }}>
                Log out of all other active sessions on other devices besides this one.
              </p>
            </div>
            <button
              onClick={handleLogOutAll}
              style={{
                ...outlineBtn,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <LogOut size={14} /> Log out
            </button>
          </div>

          <hr style={divider} />

          {/* Delete account */}
          <div style={rowBetween}>
            <div>
              <div style={{ fontWeight: 600, color: '#C53030', fontSize: 15, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={15} /> Delete my account
              </div>
              <p style={{ color: '#888', fontSize: 13, margin: 0 }}>
                Permanently delete the account and remove access from all workspaces.
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              style={{
                ...outlineBtn,
                borderColor: '#C53030',
                color: '#C53030',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Trash2 size={14} /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
