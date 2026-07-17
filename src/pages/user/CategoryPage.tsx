import { useParams, useNavigate } from 'react-router-dom';
import { useAsync } from '../../lib/use-async';
import { categoryService, couponService } from '../../lib/services';
import CouponCard from '../../components/CouponCard';
import EmptyState from '../../components/EmptyState';
import { PageLoader } from '../../components/Spinner';
import { getCategoryIcon, categoryGradient } from '../../lib/category-icons';
import { useMemo, useState } from "react";
function HeroStat({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) {

  return (

    <div
      style={{
        background: "#fff",
        padding: "16px 20px",
        borderRadius: 16,
        minWidth: 120,
        boxShadow: "0 4px 14px rgba(0,0,0,.05)"
      }}
    >

      <div
        style={{
          fontSize: 26,
          fontWeight: 700
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#777",
          fontSize: 13
        }}
      >
        {label}
      </div>

    </div>

  );

}
export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: categories } = useAsync(() => categoryService.list(), []);
  const { data: coupons, loading } = useAsync(() => couponService.listApproved(), []);
  const category = (categories ?? []).find((c) => c.slug === slug);
  const list = (coupons ?? []).filter((c) => c.category?.slug === slug);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const flashDeals = list.filter(c => c.is_flash).length;
  const filteredCoupons = useMemo(() => {
    let data = [...list];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();

      data = data.filter(c =>
        (c.title ?? "").toLowerCase().includes(q) ||
        (c.company?.name ?? "").toLowerCase().includes(q)
      );
    }

    // Filters
    if (filter === "flash") {
      data = data.filter(c => c.is_flash);
    }

    if (filter === "popular") {
      data = data.filter(c => c.views > 500);
    }

    if (filter === "ending") {
      data = data.filter(c => {
        const days =
          (new Date(c.expiry_date).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24);

        return days >= 0 && days <= 7;
      });
    }

    if (filter === "under1000") {
      data = data.filter(c => c.discount_price < 1000);
    }

    // Sorting
    switch (sortBy) {
      case "views":
        data.sort((a, b) => b.views - a.views);
        break;

      case "discount":
        data.sort(
          (a, b) =>
            Number(b.retail_price) -
            Number(b.discount_price) -
            (Number(a.retail_price) - Number(a.discount_price))
        );
        break;

      case "priceLow":
        data.sort(
          (a, b) =>
            Number(a.discount_price) -
            Number(b.discount_price)
        );
        break;

      case "priceHigh":
        data.sort(
          (a, b) =>
            Number(b.discount_price) -
            Number(a.discount_price)
        );
        break;

      case "expiry":
        data.sort(
          (a, b) =>
            new Date(a.expiry_date).getTime() -
            new Date(b.expiry_date).getTime()
        );
        break;
    }

    return data;
  }, [list, search, filter, sortBy]);
  const brandCount = new Set(
    list.map(c => c.company?.name).filter(Boolean)
  ).size;
  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div
        style={{
          background:
            "linear-gradient(135deg,#FFF6F2 0%,#FFF0E8 50%,#FFE6D8 100%)",
          borderRadius: 24,
          padding: 36,
          marginBottom: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          boxShadow: "0 8px 24px rgba(0,0,0,.05)"
        }}
      >

        <div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18
            }}
          >

            <div
              className="stat-icon"
              style={{
                width: 70,
                height: 70,
                borderRadius: 18,
                background: categoryGradient(category?.color ?? "#F4B000"),
                color: "#fff"
              }}
            >
              {(() => {
                const Icon = getCategoryIcon(category?.icon ?? "Tag");
                return <Icon size={34} />;
              })()}
            </div>

            <div>

              <h1
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  marginBottom: 8
                }}
              >
                {category?.name}
              </h1>

              <p
                style={{
                  color: "#666",
                  fontSize: 18,
                  maxWidth: 520
                }}
              >
                Discover exclusive coupons and digital flyers from trusted brands.
              </p>

            </div>

          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 28,
              flexWrap: "wrap"
            }}
          >

            <HeroStat
              value={list.length}
              label="Offers"
            />

            <HeroStat
              value={flashDeals}
              label="Flash Deals"
            />

            <HeroStat
              value={brandCount}
              label="Brands"
            />

            <HeroStat
              value="Daily"
              label="Updated"
            />

          </div>

        </div>

        <div
          style={{
            fontSize: 90
          }}
        >
          🎁
        </div>

      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 16
        }}
      >

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${category?.name}...`}
          style={{
            width: 320,
            padding: "14px 18px",
            borderRadius: 14,
            border: "1px solid #ddd",
            fontSize: 15
          }}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "14px",
            borderRadius: 14,
            border: "1px solid #ddd",
            fontSize: 15
          }}
        >
          <option value="default">Sort By</option>
          <option value="discount">Highest Discount</option>
          <option value="views">Most Viewed</option>
          <option value="expiry">Ending Soon</option>
          <option value="priceLow">Price Low → High</option>
          <option value="priceHigh">Price High → Low</option>
        </select>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          {[
            ["all", "All"],
            ["flash", "🔥 Flash Sale"],
            ["popular", "⭐ Popular"],
            ["ending", "⏰ Ending Soon"],
            ["under1000", "💰 Under ₹1000"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: "10px 18px",
                borderRadius: 25,
                border: "none",
                cursor: "pointer",
                background:
                  filter === key
                    ? category?.color ?? "#F4B000"
                    : "#F3F4F6",
                color: filter === key ? "#fff" : "#333",
                fontWeight: 600,
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <p
          style={{
            color: "#666",
            marginBottom: 24,
            fontWeight: 500,
          }}
        >
          Showing <strong>{filteredCoupons.length}</strong> of{" "}
          <strong>{list.length}</strong> offers
        </p>

      </div>
      {loading ? <PageLoader /> : filteredCoupons.length === 0 ? <EmptyState
        title="No matching offers"
        message="Try changing your search or filters."
      /> : (

        <div className="grid grid-auto">
          {filteredCoupons.map((c) => <CouponCard key={c.id} coupon={c} onView={() => navigate(`/coupons/${c.id}`)} />)}
        </div>
      )}
    </div>
  );
}
