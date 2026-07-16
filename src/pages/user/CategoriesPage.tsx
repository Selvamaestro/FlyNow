import { useNavigate } from 'react-router-dom';
import { useAsync } from '../../lib/use-async';
import { categoryService, couponService } from '../../lib/services';
import { PageLoader } from '../../components/Spinner';
import { getCategoryIcon, categoryGradient } from '../../lib/category-icons';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { data: categories, loading } = useAsync(() => categoryService.list(), []);
  const { data: coupons } = useAsync(() => couponService.listApproved(), []);

  const count = (slug: string) => (coupons ?? []).filter((c) => c.category?.slug === slug).length;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1 style={{ fontSize: 32 }}>Categories</h1>
      <p className="text-muted mt-8 mb-24">Explore offers by category.</p>
      {loading ? <PageLoader /> : (
        <div className="grid grid-3">
          {(categories ?? []).map((c) => {
            const Icon = getCategoryIcon(c.icon);
            return (
              <div key={c.id} className="card card-hover" style={{ cursor: 'pointer', overflow: 'hidden' }} onClick={() => navigate(`/categories/${c.slug}`)}>
                <div style={{ height: 100, background: categoryGradient(c.color), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={40} color="#fff" />
                </div>
                <div className="card-body flex items-center justify-between">
                  <div>
                    <h4 style={{ fontSize: 17 }}>{c.name}</h4>
                    <p className="text-sm text-muted">{count(c.slug)} active offers</p>
                  </div>
                  <div className="stat-icon" style={{ width: 36, height: 36, background: `${c.color}22`, color: c.color, borderRadius: 10 }}>
                    <Icon size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
