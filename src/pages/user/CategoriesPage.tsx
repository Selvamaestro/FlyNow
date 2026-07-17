import { useNavigate } from 'react-router-dom';
import { useAsync } from '../../lib/use-async';
import { categoryService, couponService } from '../../lib/services';
import { PageLoader } from '../../components/Spinner';
import { getCategoryIcon, categoryGradient } from '../../lib/category-icons';
function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "18px 22px",
        borderRadius: 18,
        minWidth: 120,
        boxShadow: "0 6px 18px rgba(0,0,0,.06)"
      }}
    >
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: "#111"
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: 13,
          color: "#777",
          marginTop: 4
        }}
      >
        {title}
      </div>
    </div>
  );
}
export default function CategoriesPage() {
  const navigate = useNavigate();
  const { data: categories, loading } = useAsync(() => categoryService.list(), []);
  const { data: coupons } = useAsync(() => couponService.listApproved(), []);
  const totalCategories = categories?.length ?? 0;
  const totalCoupons = coupons?.length ?? 0;

  const totalBrands = new Set(
    (coupons ?? [])
      .map(c => c.company?.name)
      .filter(Boolean)
  ).size;
  const count = (slug: string) => (coupons ?? []).filter((c) => c.category?.slug === slug).length;
  const categoryCoupons = (slug: string) =>
    (coupons ?? []).filter((c) => c.category?.slug === slug);

  const flashCount = (slug: string) =>
    categoryCoupons(slug).filter(c => c.is_flash).length;

  const brands = (slug: string) =>
    [...new Set(
      categoryCoupons(slug)
        .map(c => c.company?.name)
        .filter(Boolean)
    )].slice(0, 3);

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div
        style={{
          background:
            "linear-gradient(135deg,#FFF8E8 0%,#FFF2D9 50%,#FFE9BF 100%)",
          borderRadius: 24,
          padding: "40px",
          marginBottom: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
        }}
      >

        <div style={{ maxWidth: 650 }}>

          <span
            style={{
              background: "#fff",
              color: "#D97706",
              padding: "8px 14px",
              borderRadius: 30,
              fontWeight: 600,
              fontSize: 14
            }}
          >
            🏷 Browse Categories
          </span>

          <h1
            style={{
              fontSize: 44,
              marginTop: 20,
              marginBottom: 12,
              fontWeight: 800
            }}
          >
            Discover Amazing Deals
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#666",
              lineHeight: 1.6,
              marginBottom: 30
            }}
          >
            Explore verified coupons, digital flyers and exclusive
            offers from your favourite brands.
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap"
            }}
          >

            <StatCard
              title="Categories"
              value={totalCategories}
            />

            <StatCard
              title="Coupons"
              value={totalCoupons}
            />

            <StatCard
              title="Brands"
              value={`${totalBrands}+`}
            />

            <StatCard
              title="Updated"
              value="Daily"
            />

          </div>

        </div>

        <div
          style={{
            fontSize: 90,
            opacity: .9
          }}
        >
          🎁
        </div>

      </div>
      {loading ? <PageLoader /> : (
        <div className="grid grid-3">
          {(categories ?? []).map((c) => {
            const Icon = getCategoryIcon(c.icon);
            return (
              <div key={c.id} className="card card-hover"
                style={{
                  cursor: "pointer",
                  overflow: "hidden",
                  borderRadius: 20,
                  transition: "0.3s",
                  minHeight: 300,
                  display: "flex",
                  flexDirection: "column"
                }}
                onClick={() => navigate(`/categories/${c.slug}`)}>
                <div style={{ height: 100, background: categoryGradient(c.color), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={40} color="#fff" />
                </div>
                <div className="card-body flex items-center justify-between">
                  <div>

                    <h4
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        marginBottom: 8
                      }}
                    >
                      {c.name}
                    </h4>

                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        fontSize: 13,
                        color: "#666",
                        marginBottom: 16
                      }}
                    >
                      <span>{count(c.slug)} Offers</span>

                      <span
                        style={{
                          color: "#E67E22",
                          fontWeight: 600
                        }}
                      >
                        🔥 {flashCount(c.slug)} Flash Deals
                      </span>

                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap"
                      }}
                    >
                      {brands(c.slug).map(name => (
                        <span
                          key={name}
                          style={{
                            background: "#F5F5F5",
                            padding: "5px 10px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 500
                          }}
                        >
                          {name}
                        </span>
                      ))}
                    </div>

                  </div>
                  <button
                    style={{
                      border: "none",
                      background: c.color,
                      color: "#fff",
                      padding: "10px 18px",
                      borderRadius: 12,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Explore →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
