import { useParams, useNavigate } from 'react-router-dom';
import { useAsync } from '../../lib/use-async';
import { categoryService, couponService } from '../../lib/services';
import CouponCard from '../../components/CouponCard';
import EmptyState from '../../components/EmptyState';
import { PageLoader } from '../../components/Spinner';
import { getCategoryIcon, categoryGradient } from '../../lib/category-icons';

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: categories } = useAsync(() => categoryService.list(), []);
  const { data: coupons, loading } = useAsync(() => couponService.listApproved(), []);
  const category = (categories ?? []).find((c) => c.slug === slug);
  const list = (coupons ?? []).filter((c) => c.category?.slug === slug);

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div className="flex items-center gap-16 mb-24">
        <div className="stat-icon" style={{ width: 56, height: 56, background: categoryGradient(category?.color ?? '#F4B000'), color: '#fff', borderRadius: 14 }}>{(() => { const Icon = getCategoryIcon(category?.icon ?? 'Tag'); return <Icon size={26} />; })()}</div>
        <div><h1 style={{ fontSize: 32 }}>{category?.name ?? 'Category'}</h1><p className="text-muted">{list.length} offers available</p></div>
      </div>
      {loading ? <PageLoader /> : list.length === 0 ? <EmptyState title="No offers in this category" message="Check back soon for new deals." /> : (
        <div className="grid grid-auto">
          {list.map((c) => <CouponCard key={c.id} coupon={c} onView={() => navigate(`/coupons/${c.id}`)} />)}
        </div>
      )}
    </div>
  );
}
