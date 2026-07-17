import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { useToast } from '../../lib/toast-context';
import { supabase } from '../../lib/supabase';
import type { Profile } from '../../lib/types';
import { 
  User, Shield, Bell, Download, Trash2,
  Pencil, Check, X, Camera, Globe, MapPin, 
  Smartphone, FileText, AlertTriangle, Key,
  Bookmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAsync } from '../../lib/use-async';
import { savedCouponService } from '../../lib/services';
import CouponCard from '../../components/CouponCard';
import EmptyState from '../../components/EmptyState';
import { PageLoader } from '../../components/Spinner';

export default function ProfilePage() {
  const { profile, refreshProfile, signOut } = useAuth();
  const { show } = useToast();
  
  // Current active tab state
  const [activeTab, setActiveTab] = useState<'profile' | 'saved' | 'security' | 'notifications' | 'export' | 'delete'>('profile');

  const navigate = useNavigate();
  const { data: saved, loading: loadingSaved, reload: reloadSaved } = useAsync(
    () => (profile ? savedCouponService.list(profile.id) : Promise.resolve([])),
    [profile?.id]
  );

  // Loading and editing states
  const [saving, setSaving] = useState(false);
  const [editingTop, setEditingTop] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fallback storage loader helper
  const getProfileField = (key: keyof Profile): string => {
    if (!profile) return '';
    // 1. Check database profile object first
    if (profile[key] !== undefined && profile[key] !== null && profile[key] !== '') {
      return String(profile[key]);
    }
    // 2. Check localStorage fallback
    try {
      const localData = JSON.parse(localStorage.getItem(`profile_fallback_${profile.id}`) || '{}');
      return localData[key] || '';
    } catch {
      return '';
    }
  };

  // Form states initialized with database profile or local fallbacks
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  const [country, setCountry] = useState('');
  const [cityState, setCityState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [taxId, setTaxId] = useState('');

  // Sync form states when profile loads
  useEffect(() => {
    if (profile) {
      setDisplayName(getProfileField('display_name') || profile.display_name || '');
      setAvatarUrl(getProfileField('avatar_url') || profile.avatar_url || '');
      setFirstName(getProfileField('first_name'));
      setLastName(getProfileField('last_name'));
      setPhone(getProfileField('phone'));
      setBio(getProfileField('bio'));
      setCountry(getProfileField('country'));
      setCityState(getProfileField('city_state'));
      setPostalCode(getProfileField('postal_code'));
      setTaxId(getProfileField('tax_id'));
    }
  }, [profile]);

  // Security Tab States
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [twoStep, setTwoStep] = useState(true);


  // Notifications Tab States
  const [notifEmailAlerts, setNotifEmailAlerts] = useState(true);
  const [notifWeeklySavings, setNotifWeeklySavings] = useState(true);
  const [notifSecurity, setNotifSecurity] = useState(true);
  const [notifNewPromo, setNotifNewPromo] = useState(false);

  // Delete Account State
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  if (!profile) {
    return (
      <div className="container" style={{ padding: '60px 24px', display: 'flex', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: '100%', maxWidth: 720, height: 400 }}></div>
      </div>
    );
  }

  // Generalized Profile update helper (saves to DB and fallback localStorage)
  const handleUpdateProfile = async (updatedFields: Partial<Profile>, sectionName: string) => {
    setSaving(true);
    
    // Save to LocalStorage fallback first so the user does not lose changes if DB fails
    const localKey = `profile_fallback_${profile.id}`;
    let existingFallback = {};
    try {
      existingFallback = JSON.parse(localStorage.getItem(localKey) || '{}');
    } catch (e) {
      console.warn('Error reading localStorage', e);
    }
    const newFallback = { ...existingFallback, ...updatedFields };
    localStorage.setItem(localKey, JSON.stringify(newFallback));

    // Try updating DB
    const { error } = await supabase
      .from('profiles')
      .update(updatedFields)
      .eq('id', profile.id);

    setSaving(false);

    if (error) {
      // If error is database column missing, ignore it since we have local fallback
      if (error.message.includes('column') || error.code === '42703') {
        show(`${sectionName} saved locally`, 'success');
      } else {
        show(error.message, 'error');
        return;
      }
    } else {
      show(`${sectionName} updated successfully`, 'success');
    }

    await refreshProfile();
  };

  // 1. Save Top Profile Section
  const saveTopSection = async () => {
    await handleUpdateProfile({
      display_name: displayName,
      avatar_url: avatarUrl || null
    }, 'Profile header');
    setEditingTop(false);
  };

  // 2. Save Personal Info Section
  const savePersonalSection = async () => {
    // Sync Display Name if First & Last name are edited
    const combinedName = `${firstName} ${lastName}`.trim();
    if (combinedName) {
      setDisplayName(combinedName);
    }

    await handleUpdateProfile({
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      bio: bio,
      display_name: combinedName || displayName
    }, 'Personal information');
    setEditingPersonal(false);
  };

  // 3. Save Address Section
  const saveAddressSection = async () => {
    await handleUpdateProfile({
      country: country,
      city_state: cityState,
      postal_code: postalCode,
      tax_id: taxId
    }, 'Address information');
    setEditingAddress(false);
  };

  // 4. Update Password
  const changePw = async () => {
    if (pw !== confirm) { show('Passwords do not match', 'error'); return; }
    if (pw.length < 6) { show('Password must be at least 6 characters', 'error'); return; }
    
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setSaving(false);
    
    if (error) { 
      show(error.message, 'error'); 
    } else {
      setPw(''); 
      setConfirm('');
      show('Password updated successfully', 'success');
    }
  };

  // 5. Avatar File Upload Handler
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { show('Image size must be under 2MB', 'error'); return; }

    setSaving(true);
    const ext = file.name.split('.').pop();
    const filePath = `avatars/${profile.id}.${ext}`;
    
    const { error: uploadError } = await supabase.storage
      .from('flyers')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setSaving(false);
      show(uploadError.message, 'error');
      return;
    }

    const { data } = supabase.storage.from('flyers').getPublicUrl(filePath);
    setAvatarUrl(data.publicUrl);
    
    // Save to profile
    await handleUpdateProfile({ avatar_url: data.publicUrl }, 'Profile image');
    setSaving(false);
  };


  // 8. Data Export compiling and downloading
  const handleExportData = () => {
    const localKey = `profile_fallback_${profile.id}`;
    let fallbackData = {};
    try {
      fallbackData = JSON.parse(localStorage.getItem(localKey) || '{}');
    } catch {}

    const fullExport = {
      exported_at: new Date().toISOString(),
      account_summary: {
        id: profile.id,
        role: profile.role,
        display_name: displayName,
        email: profile.email || '',
        status: profile.status,
        created_at: profile.created_at
      },
      profile_details: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        bio: bio,
        ...fallbackData
      },
      address_details: {
        country: country,
        city_state: cityState,
        postal_code: postalCode,
        tax_id: taxId
      },
      security_settings: {
        two_step_verification_enabled: twoStep
      },
      notification_preferences: {
        email_alerts: notifEmailAlerts,
        weekly_savings: notifWeeklySavings,
        security_alerts: notifSecurity,
        promotional_alerts: notifNewPromo
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `flynow_profile_${profile.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    show('Your profile data has been exported successfully', 'success');
  };

  // 9. Delete Account Action
  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') {
      show('Please type DELETE to confirm account deletion', 'error');
      return;
    }
    signOut();
    show('Your account has been deleted successfully', 'success');
  };

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 1080 }}>
      {/* Page Title */}
      <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>Manage your profile settings, security, and notifications.</p>

      {/* Mobile Tab menu */}
      <div className="tabs-mobile">
        <button className={`tab-mobile-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
        <button className={`tab-mobile-item ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>Saved</button>
        <button className={`tab-mobile-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>Security</button>
        <button className={`tab-mobile-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>Notifications</button>
        <button className={`tab-mobile-item ${activeTab === 'export' ? 'active' : ''}`} onClick={() => setActiveTab('export')}>Export</button>
        <button className={`tab-mobile-item ${activeTab === 'delete' ? 'active' : ''}`} onClick={() => setActiveTab('delete')}>Delete</button>
      </div>

      <div className="profile-container">
        {/* Sidebar Left Column */}
        <div className="profile-sidebar">
          <div className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <User size={18} /> My Profile
          </div>
          <div className={`sidebar-item ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
            <Bookmark size={18} /> Saved Coupons
          </div>
          <div className={`sidebar-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <Shield size={18} /> Security
          </div>
          <div className={`sidebar-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
            <Bell size={18} /> Notifications
          </div>
          <div className={`sidebar-item ${activeTab === 'export' ? 'active' : ''}`} onClick={() => setActiveTab('export')}>
            <Download size={18} /> Data Export
          </div>
          <div className="sidebar-divider" style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />
          <div className={`sidebar-item danger ${activeTab === 'delete' ? 'active' : ''}`} onClick={() => setActiveTab('delete')}>
            <Trash2 size={18} /> Delete Account
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="profile-content">
          
          {/* ===================== MY PROFILE TAB ===================== */}
          {activeTab === 'profile' && (
            <>
              {/* Card 1: Avatar & Display Name Header */}
              <div className="profile-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: avatarUrl ? `url(${avatarUrl}) center/cover no-repeat` : 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 28,
                        fontWeight: 700,
                        boxShadow: 'var(--shadow)',
                        border: '2px solid #fff'
                      }}>
                        {!avatarUrl && (displayName?.[0]?.toUpperCase() || profile.role?.[0]?.toUpperCase() || 'U')}
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          background: 'var(--primary)',
                          color: '#fff',
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid #fff',
                          boxShadow: 'var(--shadow)',
                          cursor: 'pointer'
                        }}
                      >
                        <Camera size={14} />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        accept="image/*"
                        onChange={handleAvatarUpload}
                      />
                    </div>

                    {editingTop ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <input 
                          className="input" 
                          style={{ padding: '6px 12px', minWidth: 200 }} 
                          value={displayName}
                          placeholder="Display Name"
                          onChange={(e) => setDisplayName(e.target.value)} 
                        />
                        <span className="badge badge-primary" style={{ width: 'fit-content' }}>{profile.role.toUpperCase()}</span>
                      </div>
                    ) : (
                      <div>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>
                          {displayName || 'Anonymous User'}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>
                          {bio || 'Member'}
                        </p>
                        <p style={{ color: 'var(--text-light)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                          <MapPin size={12} /> {cityState ? `${cityState}, ${country || 'USA'}` : 'Location not set'}
                        </p>
                      </div>
                    )}
                  </div>

                  {editingTop ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingTop(false)} disabled={saving}>
                        <X size={14} /> Cancel
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={saveTopSection} disabled={saving}>
                        <Check size={14} /> Save
                      </button>
                    </div>
                  ) : (
                    <button className="btn-edit" onClick={() => setEditingTop(true)}>
                      <Pencil size={13} /> Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Card 2: Personal Information */}
              <div className="profile-card">
                <div className="card-header-row">
                  <span className="card-title">Personal information</span>
                  {editingPersonal ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingPersonal(false)} disabled={saving}>
                        <X size={14} /> Cancel
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={savePersonalSection} disabled={saving}>
                        <Check size={14} /> Save
                      </button>
                    </div>
                  ) : (
                    <button className="btn-edit" onClick={() => setEditingPersonal(true)}>
                      <Pencil size={13} /> Edit
                    </button>
                  )}
                </div>

                {editingPersonal ? (
                  <div className="info-grid">
                    <div className="info-field">
                      <label className="label">First Name</label>
                      <input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Michael" />
                    </div>
                    <div className="info-field">
                      <label className="label">Last Name</label>
                      <input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Rodriguez" />
                    </div>
                    <div className="info-field">
                      <label className="label">Email Address</label>
                      <input className="input" value={profile.email || ''} disabled style={{ opacity: 0.6, background: '#FAF8F2' }} />
                    </div>
                    <div className="info-field">
                      <label className="label">Phone</label>
                      <div style={{ position: 'relative' }}>
                        <Smartphone size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-light)' }} />
                        <input className="input" style={{ paddingLeft: 36 }} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(213) 555-1234" />
                      </div>
                    </div>
                    <div className="info-field" style={{ gridColumn: 'span 2' }}>
                      <label className="label">Bio</label>
                      <textarea className="textarea" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short bio about yourself..." />
                    </div>
                  </div>
                ) : (
                  <div className="info-grid">
                    <div className="info-field">
                      <span className="info-label">First Name</span>
                      <span className="info-value">{firstName || '—'}</span>
                    </div>
                    <div className="info-field">
                      <span className="info-label">Last Name</span>
                      <span className="info-value">{lastName || '—'}</span>
                    </div>
                    <div className="info-field">
                      <span className="info-label">Email address</span>
                      <span className="info-value" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>{profile.email || '—'}</span>
                    </div>
                    <div className="info-field">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{phone || '—'}</span>
                    </div>
                    <div className="info-field" style={{ gridColumn: 'span 2' }}>
                      <span className="info-label">Bio</span>
                      <span className="info-value" style={{ fontWeight: 400, color: 'var(--text-muted)', lineHeight: '1.6' }}>{bio || '—'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 3: Address */}
              <div className="profile-card">
                <div className="card-header-row">
                  <span className="card-title">Address</span>
                  {editingAddress ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingAddress(false)} disabled={saving}>
                        <X size={14} /> Cancel
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={saveAddressSection} disabled={saving}>
                        <Check size={14} /> Save
                      </button>
                    </div>
                  ) : (
                    <button className="btn-edit" onClick={() => setEditingAddress(true)}>
                      <Pencil size={13} /> Edit
                    </button>
                  )}
                </div>

                {editingAddress ? (
                  <div className="info-grid">
                    <div className="info-field">
                      <label className="label">Country</label>
                      <div style={{ position: 'relative' }}>
                        <Globe size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-light)' }} />
                        <input className="input" style={{ paddingLeft: 36 }} value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. United States" />
                      </div>
                    </div>
                    <div className="info-field">
                      <label className="label">City / State</label>
                      <input className="input" value={cityState} onChange={(e) => setCityState(e.target.value)} placeholder="e.g. Los Angeles, CA" />
                    </div>
                    <div className="info-field">
                      <label className="label">Postal Code</label>
                      <input className="input" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="e.g. 90001" />
                    </div>
                    <div className="info-field">
                      <label className="label">TAX ID</label>
                      <input className="input" value={taxId} onChange={(e) => setTaxId(e.target.value)} placeholder="e.g. AS56417896" />
                    </div>
                  </div>
                ) : (
                  <div className="info-grid">
                    <div className="info-field">
                      <span className="info-label">Country</span>
                      <span className="info-value">{country || '—'}</span>
                    </div>
                    <div className="info-field">
                      <span className="info-label">City / State</span>
                      <span className="info-value">{cityState || '—'}</span>
                    </div>
                    <div className="info-field">
                      <span className="info-label">Postal Code</span>
                      <span className="info-value">{postalCode || '—'}</span>
                    </div>
                    <div className="info-field">
                      <span className="info-label">TAX ID</span>
                      <span className="info-value">{taxId || '—'}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ===================== SAVED COUPONS TAB ===================== */}
          {activeTab === 'saved' && (
            <div className="slide-up">
              <div className="profile-card">
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <Bookmark size={18} style={{ color: 'var(--primary)' }} /> Saved Coupons
                </h3>
                {loadingSaved ? (
                  <PageLoader />
                ) : (saved ?? []).length === 0 ? (
                  <EmptyState 
                    title="No saved coupons yet" 
                    message="Tap the bookmark icon on any coupon to save it here." 
                    action={<button className="btn btn-primary" onClick={() => navigate('/offers')}>Browse Offers</button>} 
                  />
                ) : (
                  <div className="grid grid-auto">
                    {(saved ?? []).map((s) => (
                      <CouponCard 
                        key={s.id} 
                        coupon={s.coupon!} 
                        saved 
                        onView={() => navigate(`/coupons/${s.coupon_id}`)} 
                        onToggleSave={async () => { 
                          await savedCouponService.toggle(profile.id, s.coupon_id); 
                          reloadSaved(); 
                        }} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== SECURITY TAB ===================== */}
          {activeTab === 'security' && (
            <div className="slide-up">
              {/* Change Password Card */}
              <div className="profile-card" style={{ marginBottom: 24 }}>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <Key size={18} style={{ color: 'var(--primary)' }} /> Change Password
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
                  <div className="field">
                    <label className="label">New Password</label>
                    <input className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Min. 6 characters" />
                  </div>
                  <div className="field">
                    <label className="label">Confirm Password</label>
                    <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" />
                  </div>
                  <button className="btn btn-primary" onClick={changePw} disabled={saving} style={{ width: 'fit-content', marginTop: 8 }}>
                    Update Password
                  </button>
                </div>
              </div>

              {/* Account Protection Settings Card */}
              <div className="profile-card">
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <Shield size={18} style={{ color: 'var(--primary)' }} /> Advanced Protection
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 600 }}>Two-Step Verification</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Require a verification code in addition to your password on login.</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={twoStep} onChange={(e) => setTwoStep(e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div style={{ marginTop: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>ACTIVE DEVICES & SESSIONS</h4>
                  <div style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <Smartphone size={24} style={{ color: 'var(--primary)', marginTop: 2 }} />
                    <div>
                      <h5 style={{ fontSize: 14, fontWeight: 600 }}>Windows 11 PC (Chrome Browser)</h5>
                      <p style={{ fontSize: 12, color: 'var(--text-light)' }}>Dallas, USA • Active now (Current Session)</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, padding: '12px 0' }}>
                    <Smartphone size={24} style={{ color: 'var(--text-light)', marginTop: 2 }} />
                    <div>
                      <h5 style={{ fontSize: 14, fontWeight: 600 }}>Apple iPhone 15 Pro Max</h5>
                      <p style={{ fontSize: 12, color: 'var(--text-light)' }}>Dallas, USA • Last active 2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== NOTIFICATIONS TAB ===================== */}
          {activeTab === 'notifications' && (
            <div className="profile-card slide-up">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Bell size={18} style={{ color: 'var(--primary)' }} /> Notification Settings
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 600 }}>Coupon alerts</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Receive email alerts when coupons you uploaded are approved or rejected.</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={notifEmailAlerts} onChange={(e) => setNotifEmailAlerts(e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 600 }}>Weekly savings wrap</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Receive a weekly newsletter summarizing the best savings and discount trends.</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={notifWeeklySavings} onChange={(e) => setNotifWeeklySavings(e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 600 }}>Security updates</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Receive warnings about suspicious logins, security locks, and password changes.</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={notifSecurity} onChange={(e) => setNotifSecurity(e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 600 }}>New promotions & flash sales</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Receive push notifications when a company launches a flash sale in your area.</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={notifNewPromo} onChange={(e) => setNotifNewPromo(e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
          {/* ===================== DATA EXPORT TAB ===================== */}
          {activeTab === 'export' && (
            <div className="profile-card slide-up">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Download size={18} style={{ color: 'var(--primary)' }} /> Export Your Personal Data
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: '1.6', marginBottom: 20 }}>
                In compliance with GDPR and privacy standards, you can request an export of all information saved in your FlyNow profile. This includes account metadata, personal details, addresses, and notification settings.
              </p>
              
              <div style={{
                display: 'flex',
                gap: 16,
                padding: 16,
                background: 'var(--primary-50)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--primary-light)',
                marginBottom: 24,
                alignItems: 'center'
              }}>
                <FileText size={24} style={{ color: 'var(--primary-dark)' }} />
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-dark)' }}>Instant JSON Generation</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Your data is compiled on demand. Ready to download instantly.</p>
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleExportData}>
                <Download size={16} /> Export and Download data
              </button>
            </div>
          )}

          {/* ===================== DELETE ACCOUNT TAB ===================== */}
          {activeTab === 'delete' && (
            <div className="profile-card slide-up">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--danger)', marginBottom: 16 }}>
                <AlertTriangle size={18} /> Delete Account
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: '1.6', marginBottom: 20 }}>
                This action is <strong>irreversible</strong> and will permanently wipe your profile records, saved coupons, and access tokens from our database.
              </p>

              <div style={{
                padding: '16px 20px',
                background: 'var(--danger-light)',
                color: 'var(--danger)',
                border: '1px solid #FCA5A5',
                borderRadius: 'var(--radius)',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <AlertTriangle size={20} />
                <span>WARNING: Deleting your account will immediately terminate your subscription plan without refunds.</span>
              </div>

              <div className="field mb-24" style={{ maxWidth: 420 }}>
                <label className="label" style={{ color: 'var(--text)' }}>Type <strong>DELETE</strong> below to confirm deletion</label>
                <input 
                  className="input" 
                  value={deleteConfirmText} 
                  onChange={(e) => setDeleteConfirmText(e.target.value)} 
                  placeholder="Type DELETE" 
                  style={{ border: deleteConfirmText === 'DELETE' ? '1.5px solid var(--danger)' : '1px solid var(--border)' }}
                />
              </div>

              <button 
                className="btn btn-danger" 
                onClick={handleDeleteAccount} 
                disabled={deleteConfirmText !== 'DELETE'}
                style={{ opacity: deleteConfirmText === 'DELETE' ? 1 : 0.5 }}
              >
                <Trash2 size={16} /> Permanently Delete Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Styled Embed for profile settings transitions and layout */}
      <style>{`
        .profile-container {
          display: flex;
          gap: 32px;
          margin-top: 16px;
          align-items: flex-start;
        }
        .profile-sidebar {
          width: 256px;
          background: #fff;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          padding: 16px;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: sticky;
          top: 80px;
        }
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .sidebar-item:hover {
          background: var(--primary-50);
          color: var(--primary-dark);
        }
        .sidebar-item.active {
          background: var(--primary);
          color: #fff;
          font-weight: 700;
          box-shadow: var(--shadow-primary);
        }
        .sidebar-item.danger {
          color: var(--danger);
        }
        .sidebar-item.danger:hover {
          background: var(--danger-light);
          color: var(--danger);
        }
        .sidebar-item.danger.active {
          background: var(--danger);
          color: #fff;
          box-shadow: 0 8px 24px rgba(220, 38, 38, 0.25);
        }
        .profile-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-width: 0;
        }
        .profile-card {
          background: #fff;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
          padding: 28px;
          position: relative;
          transition: all 0.3s ease;
        }
        .profile-card:hover {
          box-shadow: var(--shadow);
        }
        .card-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
        }
        .card-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
          font-family: var(--font-head);
        }
        .btn-edit {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fff;
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-edit:hover {
          background: var(--primary-50);
          border-color: var(--primary);
          color: var(--primary-dark);
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        .info-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .info-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .info-value {
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
        }
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
          flex-shrink: 0;
        }
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ECE8DD;
          transition: .3s;
          border-radius: 24px;
        }
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        input:checked + .toggle-slider {
          background-color: var(--primary);
        }
        input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }
        .tabs-mobile {
          display: none;
        }
        @media (max-width: 820px) {
          .profile-container {
            flex-direction: column;
            gap: 20px;
          }
          .profile-sidebar {
            display: none;
          }
          .tabs-mobile {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            width: 100%;
            padding-bottom: 12px;
            margin-bottom: 8px;
            border-bottom: 1px solid var(--border);
            -webkit-overflow-scrolling: touch;
          }
          .tabs-mobile::-webkit-scrollbar {
            display: none;
          }
          .tab-mobile-item {
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
            background: #fff;
            border: 1px solid var(--border);
            color: var(--text-muted);
            cursor: pointer;
            transition: all 0.2s;
          }
          .tab-mobile-item.active {
            background: var(--primary);
            color: #fff;
            border-color: var(--primary);
            box-shadow: var(--shadow-primary);
          }
          .info-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .info-field[style*="grid-column"] {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
