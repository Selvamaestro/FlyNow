import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { companyNav } from './company-nav';
import { useCompany } from './use-company';
import { companyService, uploadFlyer } from '../../lib/services';
import { useToast } from '../../lib/toast-context';
import { useAuth } from '../../lib/auth-context';
import { PageLoader } from '../../components/Spinner';
import { Building2, Upload, Save } from 'lucide-react';

export default function CompanySettingsPage() {
  const { company, loading, setCompany } = useCompany();
  const { profile } = useAuth();
  const { show } = useToast();
  const [form, setForm] = useState({ name: '', description: '', contact_email: '', phone: '', address: '', website: '' });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company) setForm({ name: company.name, description: company.description, contact_email: company.contact_email, phone: company.phone, address: company.address, website: company.website });
  }, [company]);

  if (loading) return <DashboardLayout items={companyNav} brand="Company"><PageLoader /></DashboardLayout>;

  const save = async () => {
    setSaving(true);
    let logoUrl = company?.logo_url ?? null;
    if (logoFile) {
      const { url, error } = await uploadFlyer(logoFile);
      if (!error && url) logoUrl = url;
    }
    try {
      if (company) {
        const updated = await companyService.update(company.id, { ...form, logo_url: logoUrl });
        setCompany(updated);
      } else {
        const created = await companyService.create({ owner_id: profile!.id, ...form, logo_url: logoUrl });
        setCompany(created);
      }
      show('Company profile saved', 'success');
    } catch (e) { show((e as Error).message, 'error'); }
    setSaving(false);
  };

  return (
    <DashboardLayout items={companyNav} brand="Company">
      <h1 style={{ fontSize: 26 }}>Company Settings</h1>
      <p className="text-muted mt-8 mb-24">Manage your company profile and information.</p>
      <div className="card card-body" style={{ maxWidth: 640 }}>
        <div className="flex items-center gap-16 mb-24">
          <div className="stat-icon" style={{ width: 64, height: 64, background: 'var(--primary-50)', color: 'var(--primary-dark)', borderRadius: 14, fontSize: 26 }}><Building2 size={28} /></div>
          <div><h3>{company?.name ?? 'New Company'}</h3>{company && <span className={`badge ${company.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>{company.status}</span>}</div>
        </div>
        <div className="flex-col gap-16">
          <div className="field"><label className="label">Company Name *</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field"><label className="label">Description</label><textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-2" style={{ gap: 12 }}>
            <div className="field"><label className="label">Contact Email</label><input className="input" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></div>
            <div className="field"><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          </div>
          <div className="grid grid-2" style={{ gap: 12 }}>
            <div className="field"><label className="label">Address</label><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="field"><label className="label">Website</label><input className="input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
          </div>
          <div className="field"><label className="label">Logo</label><label className="btn btn-secondary" style={{ cursor: 'pointer' }}><Upload size={16} /> Upload Logo<input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} /></label>{logoFile && <span className="text-sm text-muted mt-8">{logoFile.name}</span>}</div>
          <button className="btn btn-primary" onClick={save} disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
