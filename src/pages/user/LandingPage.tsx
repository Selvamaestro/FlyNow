import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Zap, ArrowRight, Star, Quote } from 'lucide-react';
import { useAsync } from '../../lib/use-async';
import { couponService, companyService, categoryService } from '../../lib/services';
import CouponCard from '../../components/CouponCard';
import EmptyState from '../../components/EmptyState';
import { PageLoader } from '../../components/Spinner';
import { formatDate } from '../../lib/utils';
import { getCategoryIcon, categoryGradient } from '../../lib/category-icons';

export default function LandingPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { data: coupons, loading } = useAsync(() => couponService.listApproved(), []);
  const { data: companies } = useAsync(() => companyService.listApproved(), []);
  const { data: categories } = useAsync(() => categoryService.list(), []);

  const featured = (coupons ?? []).slice(0, 8);
  const trending = (companies ?? []).slice(0, 6);
  const flash = (coupons ?? []).filter((c) => new Date(c.expiry_date).getTime() - Date.now() < 7 * 86400000).slice(0, 4);
  const latest = (coupons ?? []).slice(0, 6);

  const search = () => navigate(`/offers?q=${encodeURIComponent(query)}`);

  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--bg) 60%)', padding: '64px 0 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,176,0,0.18), transparent 70%)' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <span className="badge badge-primary" style={{ marginBottom: 20, padding: '6px 16px' }}>
              <Zap size={14} /> Premium Digital Coupons
            </span>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.1, marginBottom: 16 }}>
              Discover & Redeem Exclusive <span style={{ color: 'var(--primary-dark)' }}>Flyer Coupons</span> From Top Brands
            </h1>
            <p className="text-lg text-muted" style={{ marginBottom: 32 }}>
              Browse thousands of verified offers, save your favorites, and redeem in-store or online — all in one premium platform.
            </p>
            <div className="flex items-center gap-8" style={{ maxWidth: 560, margin: '0 auto', background: 'var(--surface)', borderRadius: 999, padding: 8, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
              <Search size={20} style={{ color: 'var(--text-muted)', marginLeft: 16 }} />
              <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()} placeholder="Search brands, categories, or offers..." style={{ border: 'none', boxShadow: 'none', background: 'transparent', flex: 1 }} />
              <button className="btn btn-primary" onClick={search}>Search</button>
            </div>
            <div className="flex items-center justify-center gap-32 mt-32 wrap">
              {[['12k+','Active Coupons'],['850+','Top Brands'],['2.4M','Happy Users'],['98%','Satisfaction']].map(([n,l]) => (
                <div key={l} className="text-center">
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 28, color: 'var(--primary-dark)' }}>{n}</div>
                  <div className="text-sm text-muted">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container" style={{ padding: '56px 24px' }}>
        <div className="flex items-center justify-between mb-24">
          <div><h2 style={{ fontSize: 28 }}>Browse Categories</h2><p className="text-muted mt-8">Find offers by category</p></div>
          <Link to="/categories" className="btn btn-ghost btn-sm">View all <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-4">
          {(categories ?? []).slice(0, 8).map((c) => {
            const Icon = getCategoryIcon(c.icon);
            return (
              <Link key={c.id} to={`/categories/${c.slug}`} className="card card-hover" style={{ overflow: 'hidden' }}>
                <div style={{ height: 72, background: categoryGradient(c.color), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={28} color="#fff" />
                </div>
                <div className="card-body-sm">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted">Explore offers</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Coupons */}
      <section className="container" style={{ padding: '0 24px 56px' }}>
        <div className="flex items-center justify-between mb-24">
          <div><h2 style={{ fontSize: 28 }}>Featured Coupons</h2><p className="text-muted mt-8">Hand-picked top offers</p></div>
          <Link to="/offers" className="btn btn-ghost btn-sm">See all <ArrowRight size={16} /></Link>
        </div>
        {loading ? <PageLoader /> : featured.length === 0 ? <EmptyState title="No coupons yet" message="Check back soon for featured offers." /> : (
          <div className="grid grid-auto">
            {featured.map((c) => <CouponCard key={c.id} coupon={c} onView={() => navigate(`/coupons/${c.id}`)} />)}
          </div>
        )}
      </section>

      {/* Trending Companies */}
      <section className="container" style={{ padding: '0 24px 56px' }}>
        <div className="flex items-center justify-between mb-24">
          <div><h2 style={{ fontSize: 28 }}>Trending Companies</h2><p className="text-muted mt-8">Most popular brands</p></div>
        </div>
        <div className="grid grid-3">
          {trending.map((co) => (
            <div key={co.id} className="card card-hover card-body flex items-center gap-16">
              {co.logo_url ? <img src={co.logo_url} style={{ width: 56, height: 56, borderRadius: 14, objectFit: 'cover' }} />
                : <div className="stat-icon" style={{ width: 56, height: 56, background: 'var(--primary-50)', color: 'var(--primary-dark)', fontSize: 22, borderRadius: 14 }}>{co.name[0]}</div>}
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 16 }}>{co.name}</h4>
                <p className="text-xs text-muted" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{co.description}</p>
                <span className="badge badge-primary mt-8"><TrendingUp size={12} /> Trending</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Sales */}
      {flash.length > 0 && (
        <section style={{ background: 'linear-gradient(135deg, #2E2E2E, #1a1a1a)', color: '#fff', padding: '56px 0' }}>
          <div className="container">
            <div className="flex items-center gap-12 mb-24"><Zap size={24} style={{ color: 'var(--primary)' }} /><h2 style={{ color: '#fff', fontSize: 28 }}>Flash Sales</h2></div>
            <div className="grid grid-4">
              {flash.map((c) => (
                <div key={c.id} className="card card-hover" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => navigate(`/coupons/${c.id}`)}>
                  <img src={c.flyer_image_url} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                  <div className="card-body-sm">
                    <div className="badge badge-warning" style={{ marginBottom: 8 }}>Ends {formatDate(c.expiry_date)}</div>
                    <h4 style={{ color: '#fff', fontSize: 15 }}>{c.title}</h4>
                    <p style={{ color: '#ccc', fontSize: 13 }}>{c.discount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Flyers */}
      <section className="container" style={{ padding: '56px 24px' }}>
        <div className="flex items-center justify-between mb-24">
          <div><h2 style={{ fontSize: 28 }}>Latest Flyers</h2><p className="text-muted mt-8">Fresh off the press</p></div>
          <Link to="/offers" className="btn btn-ghost btn-sm">See all <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-3">
          {latest.map((c) => (
            <div key={c.id} className="card card-hover" onClick={() => navigate(`/coupons/${c.id}`)}>
              <img src={c.flyer_image_url} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
              <div className="card-body-sm">
                <span className="badge badge-primary">{c.discount}</span>
                <h4 style={{ fontSize: 15, marginTop: 8 }}>{c.title}</h4>
                <p className="text-xs text-muted">{c.company?.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: 'var(--primary-50)', padding: '56px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 28, textAlign: 'center', marginBottom: 32 }}>What Our Users Say</h2>
          <div className="grid grid-3">
            {[
              { n: 'Sarah M.', r: 'Shopper', t: 'FlyNow saved me hundreds on my weekly groceries. The coupons are always valid and easy to redeem.' },
              { n: 'James K.', r: 'Deal Hunter', t: 'Best coupon app I have used. Clean interface, real offers, and I love the flash sales section.' },
              { n: 'Priya L.', r: 'Mom of 3', t: 'I find offers for every category my family needs. The save feature keeps everything organized.' },
            ].map((tm) => (
              <div key={tm.n} className="card card-body">
                <Quote size={28} style={{ color: 'var(--primary)', opacity: 0.4 }} />
                <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6 }}>{tm.t}</p>
                <div className="flex items-center gap-12 mt-16">
                  <div className="stat-icon" style={{ width: 40, height: 40, background: 'var(--primary)', color: '#fff', borderRadius: '50%' }}>{tm.n[0]}</div>
                  <div><div className="font-semibold">{tm.n}</div><div className="text-xs text-muted">{tm.r}</div></div>
                  <div className="flex" style={{ marginLeft: 'auto', color: 'var(--primary)' }}>{Array.from({length:5}).map((_,i)=><Star key={i} size={14} fill="currentColor" />)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container" style={{ padding: '56px 24px' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: '#fff', padding: 48, textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: 28 }}>Never Miss a Deal</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: 8 }}>Subscribe to get the hottest coupons delivered to your inbox weekly.</p>
          <div className="flex items-center gap-8" style={{ maxWidth: 480, margin: '24px auto 0' }}>
            <input className="input" placeholder="Enter your email" style={{ background: 'rgba(255,255,255,0.95)' }} />
            <button className="btn" style={{ background: 'var(--text)', color: '#fff' }}>Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
