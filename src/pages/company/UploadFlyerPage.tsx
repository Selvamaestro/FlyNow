import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { companyNav } from './company-nav';
import { useCompany } from './use-company';
import { couponService, categoryService, notificationService, uploadFlyer } from '../../lib/services';
import { useToast } from '../../lib/toast-context';
import { useAsync } from '../../lib/use-async';
import { PageLoader } from '../../components/Spinner';

export default function UploadFlyerPage() {
  const { company, loading: coLoading } = useCompany();
  const { show } = useToast();
  const navigate = useNavigate();
  const { data: categories } = useAsync(() => categoryService.list(), []);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    discount: '',
    coupon_code: '',
    terms: '',
    expiry_date: '',
    retail_price: '',
    discount_price: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const calculateDiscountedPrice = (retailVal: string, discountVal: string) => {
    const retail = parseFloat(retailVal);
    if (isNaN(retail) || retail <= 0) return '';
    const pctMatch = discountVal.match(/(\d+(?:\.\d+)?)\s*%/);
    if (pctMatch) {
      const pct = parseFloat(pctMatch[1]);
      return (retail * (1 - pct / 100)).toFixed(2);
    }
    const valMatch = discountVal.match(/(?:\$|usd)?\s*(\d+(?:\.\d+)?)/i);
    if (valMatch && !discountVal.includes('%')) {
      const amt = parseFloat(valMatch[1]);
      if (amt < retail) {
        return (retail - amt).toFixed(2);
      }
    }
    return '';
  };

  const handleRetailPriceChange = (val: string) => {
    const calculated = calculateDiscountedPrice(val, form.discount);
    setForm({ ...form, retail_price: val, discount_price: calculated || form.discount_price });
  };

  const handleDiscountChange = (val: string) => {
    const calculated = calculateDiscountedPrice(form.retail_price, val);
    setForm({ ...form, discount: val, discount_price: calculated || form.discount_price });
  };

  const onFile = (f: File | null) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!file) e.file = 'Flyer image is required';
    if (!form.title) e.title = 'Title is required';
    if (!form.discount) e.discount = 'Discount is required';
    if (!form.coupon_code) e.coupon_code = 'Coupon code is required';
    if (!form.expiry_date) e.expiry_date = 'Expiry date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) { show('Create your company profile first', 'error'); return; }
    if (company.status !== 'approved') { show('Your company must be approved before uploading', 'error'); return; }
    if (!validate()) return;
    setSaving(true);
    const { url, error: upErr } = await uploadFlyer(file!);
    if (upErr || !url) { setSaving(false); show(upErr ?? 'Upload failed', 'error'); return; }
    try {
      await couponService.create({
        company_id: company.id,
        category_id: form.category_id || null,
        title: form.title,
        description: form.description,
        flyer_image_url: url,
        logo_url: company.logo_url,
        discount: form.discount,
        coupon_code: form.coupon_code,
        terms: form.terms,
        expiry_date: form.expiry_date,
        retail_price: form.retail_price ? parseFloat(form.retail_price) : null,
        discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
      });
      await notificationService.create({ type: 'coupon_submission', title: 'New coupon submission', message: `${company.name} submitted "${form.title}" for review.`, target_role: 'admin', ref_id: company.id });
      show('Flyer uploaded! Status: Pending', 'success');
      navigate('/company/flyers');
    } catch (err) {
      show((err as Error).message, 'error');
    }
    setSaving(false);
  };

  if (coLoading) return <DashboardLayout items={companyNav} brand="Company"><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout items={companyNav} brand="Company">
      <h1 style={{ fontSize: 26 }}>Upload Flyer</h1>
      <p className="text-muted mt-8 mb-24">Upload a new promotional flyer. It will be reviewed by admin before going live.</p>
      {company?.status !== 'approved' && <div className="badge badge-warning mb-24" style={{ padding: 12, width: '100%' }}><AlertCircle size={16} /> Your company is {company?.status}. Only approved companies can upload.</div>}
      <form onSubmit={submit} className="grid grid-2" style={{ gap: 24, maxWidth: 900 }}>
        <div className="card card-body">
          <label className="label mb-16">Flyer Image</label>
          <label className="flex-col items-center justify-center" style={{ border: '2px dashed var(--border)', borderRadius: 14, padding: 32, cursor: 'pointer', minHeight: 240, background: 'var(--bg)' }}>
            {preview ? <img src={preview} style={{ maxHeight: 200, borderRadius: 10 }} /> : (
              <div className="text-center text-muted"><Upload size={40} style={{ margin: '0 auto 12px' }} /><p>Click to upload flyer image</p><p className="text-xs mt-8">PNG, JPG up to 5MB</p></div>
            )}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
          </label>
          {errors.file && <div className="field-error mt-8 flex items-center gap-8"><AlertCircle size={14} /> {errors.file}</div>}
        </div>
        <div className="card card-body flex-col gap-16">
          <div className="field"><label className="label">Coupon Title *</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />{errors.title && <div className="field-error">{errors.title}</div>}</div>
          <div className="field"><label className="label">Description</label><textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-2" style={{ gap: 12 }}>
            <div className="field"><label className="label">Category</label><select className="select" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}><option value="">Select</option>{(categories ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div className="field"><label className="label">Discount *</label><input className="input" placeholder="e.g. 25% OFF" value={form.discount} onChange={(e) => handleDiscountChange(e.target.value)} />{errors.discount && <div className="field-error">{errors.discount}</div>}</div>
          </div>
          <div className="grid grid-2" style={{ gap: 12 }}>
            <div className="field"><label className="label">Retail Price ($)</label><input type="number" step="0.01" min="0" className="input" placeholder="e.g. 99.99" value={form.retail_price} onChange={(e) => handleRetailPriceChange(e.target.value)} /></div>
            <div className="field"><label className="label">Discounted Price ($)</label><input type="number" step="0.01" min="0" className="input" placeholder="e.g. 74.99" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} /></div>
          </div>
          <div className="grid grid-2" style={{ gap: 12 }}>
            <div className="field"><label className="label">Coupon Code *</label><input className="input" value={form.coupon_code} onChange={(e) => setForm({ ...form, coupon_code: e.target.value.toUpperCase() })} />{errors.coupon_code && <div className="field-error">{errors.coupon_code}</div>}</div>
            <div className="field"><label className="label">Expiry Date *</label><input type="date" className="input" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />{errors.expiry_date && <div className="field-error">{errors.expiry_date}</div>}</div>
          </div>
          <div className="field"><label className="label">Terms & Conditions</label><textarea className="textarea" value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} placeholder="One per customer. Valid until expiry..." /></div>
          <button className="btn btn-primary" disabled={saving}><ImageIcon size={16} /> {saving ? 'Uploading...' : 'Upload Flyer'}</button>
        </div>
      </form>
    </DashboardLayout>
  );
}
