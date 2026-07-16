import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useAsync } from '../../lib/use-async';
import { couponService, categoryService } from '../../lib/services';
import CouponCard from '../../components/CouponCard';
import EmptyState from '../../components/EmptyState';
import { PageLoader } from '../../components/Spinner';
import { useNavigate } from 'react-router-dom';

export default function OffersPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('newest');
  const { data: coupons, loading } = useAsync(() => couponService.listApproved(), []);
  const { data: categories } = useAsync(() => categoryService.list(), []);

  const filtered = useMemo(() => {
    let list = coupons ?? [];
    if (q) list = list.filter((c) => (c.title + c.description + (c.company?.name ?? '')).toLowerCase().includes(q.toLowerCase()));
    if (cat !== 'all') list = list.filter((c) => c.category?.slug === cat);
    if (sort === 'newest') list = [...list].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    if (sort === 'expiring') list = [...list].sort((a, b) => +new Date(a.expiry_date) - +new Date(b.expiry_date));
    if (sort === 'popular') list = [...list].sort((a, b) => b.views - a.views);
    return list;
  }, [coupons, q, cat, sort]);

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1 style={{ fontSize: 32 }}>All Offers</h1>
      <p className="text-muted mt-8 mb-24">Browse {filtered.length} verified coupons from top brands.</p>

      <div className="card card-body mb-24 flex items-center gap-12 wrap">
        <div className="flex items-center gap-8" style={{ flex: 1, minWidth: 240 }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input className="input" style={{ border: 'none', boxShadow: 'none', background: 'transparent' }} placeholder="Search offers..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex items-center gap-8"><SlidersHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
          <select className="select" style={{ minWidth: 140 }} value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="all">All Categories</option>
            {(categories ?? []).map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <select className="select" style={{ minWidth: 130 }} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="expiring">Expiring Soon</option>
          <option value="popular">Most Viewed</option>
        </select>
      </div>

      {loading ? <PageLoader /> : filtered.length === 0 ? <EmptyState title="No offers found" message="Try adjusting your search or filters." /> : (
        <div className="grid grid-auto">
          {filtered.map((c) => <CouponCard key={c.id} coupon={c} onView={() => navigate(`/coupons/${c.id}`)} />)}
        </div>
      )}
    </div>
  );
}
