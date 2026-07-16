import { useNavigate } from 'react-router-dom';
import { useAsync } from '../../lib/use-async';
import { savedCouponService } from '../../lib/services';
import { useAuth } from '../../lib/auth-context';
import CouponCard from '../../components/CouponCard';
import EmptyState from '../../components/EmptyState';
import { PageLoader } from '../../components/Spinner';

export default function SavedCouponsPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { data: saved, loading, reload } = useAsync(() => savedCouponService.list(profile!.id), [profile?.id]);

  if (!profile) return <div className="container" style={{ padding: 40 }}><EmptyState title="Sign in to view saved coupons" action={<button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>} /></div>;
  if (loading) return <div className="container" style={{ padding: 40 }}><PageLoader /></div>;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1 style={{ fontSize: 32 }}>Saved Coupons</h1>
      <p className="text-muted mt-8 mb-24">{(saved ?? []).length} coupons bookmarked.</p>
      {(saved ?? []).length === 0 ? <EmptyState title="No saved coupons yet" message="Tap the bookmark icon on any coupon to save it here." action={<button className="btn btn-primary" onClick={() => navigate('/offers')}>Browse Offers</button>} /> : (
        <div className="grid grid-auto">
          {(saved ?? []).map((s) => (
            <CouponCard key={s.id} coupon={s.coupon!} saved onView={() => navigate(`/coupons/${s.coupon_id}`)} onToggleSave={async () => { await savedCouponService.toggle(profile.id, s.coupon_id); reload(); }} />
          ))}
        </div>
      )}
    </div>
  );
}
