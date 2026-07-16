import { type Coupon } from '../lib/types';
import { Bookmark, Calendar, Tag, Eye } from 'lucide-react';
import { formatDate, daysUntil, isExpired } from '../lib/utils';

interface CouponCardProps {
  coupon: Coupon;
  saved?: boolean;
  onToggleSave?: () => void;
  onView?: () => void;
  showStatus?: boolean;
}

export default function CouponCard({ coupon, saved, onToggleSave, onView, showStatus }: CouponCardProps) {
  const expired = isExpired(coupon.expiry_date);
  const days = daysUntil(coupon.expiry_date);
  const statusBadge = coupon.status === 'approved' ? <span className="badge badge-success">Approved</span>
    : coupon.status === 'pending' ? <span className="badge badge-warning">Pending</span>
    : <span className="badge badge-danger">Rejected</span>;

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onView}>
        <img src={coupon.flyer_image_url} alt={coupon.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--primary)', color: '#fff', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
          {coupon.discount || 'OFFER'}
        </div>
        {showStatus && <div style={{ position: 'absolute', top: 12, right: 12 }}>{statusBadge}</div>}
        {expired && <div style={{ position: 'absolute', inset: 0, background: 'rgba(46,46,46,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="badge badge-danger" style={{ fontSize: 14, padding: '6px 14px' }}>Expired</span>
        </div>}
      </div>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div className="flex items-center gap-8">
          {coupon.logo_url ? <img src={coupon.logo_url} alt="" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />
            : <div className="stat-icon" style={{ width: 28, height: 28, background: 'var(--primary-50)', color: 'var(--primary-dark)', fontSize: 11 }}>{coupon.company?.name?.[0]}</div>}
          <span className="text-sm font-semibold">{coupon.company?.name}</span>
          {coupon.category && <span className="badge badge-muted" style={{ marginLeft: 'auto' }}>{coupon.category.name}</span>}
        </div>
        <h3 style={{ fontSize: 16, lineHeight: 1.3 }} className="cursor-pointer" onClick={onView}>{coupon.title}</h3>
        <p className="text-sm text-muted" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{coupon.description}</p>
        <div className="flex items-center gap-12 text-xs text-muted" style={{ marginTop: 'auto' }}>
          <span className="flex items-center gap-8"><Calendar size={13} /> {formatDate(coupon.expiry_date)}</span>
          {!expired && days <= 7 && <span className="badge badge-warning">Ends in {days}d</span>}
          <span className="flex items-center gap-8"><Eye size={13} /> {coupon.views}</span>
        </div>
        <div className="flex items-center gap-8 mt-8">
          <div className="flex items-center gap-8" style={{ flex: 1, padding: '8px 12px', background: 'var(--primary-50)', borderRadius: 8, border: '1px dashed var(--primary)' }}>
            <Tag size={14} style={{ color: 'var(--primary-dark)' }} />
            <span className="text-sm font-bold" style={{ color: 'var(--primary-dark)' }}>{coupon.coupon_code || 'AUTO'}</span>
          </div>
          {onToggleSave && (
            <button className={`btn-icon ${saved ? 'btn-primary' : 'btn-secondary'}`} onClick={onToggleSave} title={saved ? 'Unsave' : 'Save'}>
              <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
