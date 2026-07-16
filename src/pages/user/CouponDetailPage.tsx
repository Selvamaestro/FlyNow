import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Tag, Building2, FileText, Bookmark, ArrowLeft, Copy, Check, Eye } from 'lucide-react';
import { couponService, savedCouponService } from '../../lib/services';
import { useAuth } from '../../lib/auth-context';
import { useToast } from '../../lib/toast-context';
import type { Coupon } from '../../lib/types';
import { formatDate, daysUntil, isExpired } from '../../lib/utils';
import { PageLoader } from '../../components/Spinner';

export default function CouponDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { show } = useToast();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    couponService.get(id).then((c) => {
      setCoupon(c);
      setLoading(false);
      if (c) couponService.incrementViews(id);
    });
    if (profile) savedCouponService.isSaved(profile.id, id!).then(setSaved);
  }, [id, profile]);

  const toggleSave = async () => {
    if (!profile) { navigate('/login'); return; }
    const now = await savedCouponService.toggle(profile.id, id!);
    setSaved(now);
    show(now ? 'Coupon saved!' : 'Removed from saved', 'success');
  };

  const copyCode = () => {
    if (!coupon?.coupon_code) return;
    navigator.clipboard.writeText(coupon.coupon_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    show('Code copied!', 'success');
  };

  if (loading) return <PageLoader />;
  if (!coupon) return <div className="container" style={{ padding: 40 }}><div className="empty-state"><h2>Coupon not found</h2><Link to="/offers" className="btn btn-primary mt-16">Browse offers</Link></div></div>;

  const expired = isExpired(coupon.expiry_date);

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 960 }}>
      <Link to="/offers" className="flex items-center gap-8 text-muted mb-16 text-sm"><ArrowLeft size={16} /> Back to offers</Link>
      <div className="grid grid-2" style={{ gap: 32 }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <img src={coupon.flyer_image_url} alt={coupon.title} style={{ width: '100%', height: 360, objectFit: 'cover' }} />
          <div className="card-body flex items-center gap-12">
            <div className="stat-icon" style={{ width: 44, height: 44, background: 'var(--primary-50)', color: 'var(--primary-dark)' }}><Eye size={20} /></div>
            <span className="text-sm text-muted">{coupon.views} views</span>
            {expired && <span className="badge badge-danger" style={{ marginLeft: 'auto' }}>Expired</span>}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-8 mb-16">
            {coupon.logo_url ? <img src={coupon.logo_url} style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} /> : <div className="stat-icon" style={{ width: 40, height: 40, background: 'var(--primary-50)', color: 'var(--primary-dark)' }}><Building2 size={20} /></div>}
            <div><div className="font-semibold">{coupon.company?.name}</div><Link to="#" className="text-xs text-muted">View company</Link></div>
            {coupon.category && <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>{coupon.category.name}</span>}
          </div>
          <h1 style={{ fontSize: 28 }}>{coupon.title}</h1>
          <div className="badge badge-primary" style={{ fontSize: 16, padding: '8px 16px', marginTop: 12 }}>{coupon.discount}</div>
          <p className="text-muted mt-16" style={{ lineHeight: 1.7 }}>{coupon.description}</p>

          <div className="card card-body mt-24" style={{ background: 'var(--primary-50)', borderColor: 'var(--primary)' }}>
            <div className="flex items-center justify-between">
              <div><div className="text-xs text-muted">Coupon Code</div><div className="flex items-center gap-8 mt-8"><Tag size={18} style={{ color: 'var(--primary-dark)' }} /><span style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-dark)', fontFamily: 'monospace' }}>{coupon.coupon_code || 'AUTO'}</span></div></div>
              <button className="btn btn-primary" onClick={copyCode}>{copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}</button>
            </div>
          </div>

          <div className="flex items-center gap-12 mt-16">
            <div className="card card-body-sm flex items-center gap-8" style={{ flex: 1 }}><Calendar size={18} style={{ color: 'var(--text-muted)' }} /><div><div className="text-xs text-muted">Expires</div><div className="font-semibold">{formatDate(coupon.expiry_date)}</div></div></div>
            {!expired && <div className="badge badge-warning">{daysUntil(coupon.expiry_date)} days left</div>}
            <button className={`btn ${saved ? 'btn-primary' : 'btn-secondary'}`} onClick={toggleSave}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}</button>
          </div>

          {coupon.terms && (
            <div className="card card-body mt-24">
              <h4 className="flex items-center gap-8 mb-16"><FileText size={18} /> Terms & Conditions</h4>
              <p className="text-sm text-muted" style={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>{coupon.terms}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
