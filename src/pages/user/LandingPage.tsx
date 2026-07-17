import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAsync } from '../../lib/use-async';
import { couponService, categoryService } from '../../lib/services';
import { PageLoader } from '../../components/Spinner';
import { getCategoryIcon } from '../../lib/category-icons';

function FlashCountdown({ createdAt }: { createdAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const end = new Date(createdAt).getTime() + 48 * 60 * 60 * 1000;
      const diff = end - Date.now();
      if (diff <= 0) {
        return 'Expired';
      }
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      return `${String(hrs).padStart(2, '0')}h : ${String(mins).padStart(2, '0')}m : ${String(secs).padStart(2, '0')}s`;
    };

    setTimeLeft(calculateTime());
    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt]);

  return <span>{timeLeft}</span>;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { data: coupons, loading } = useAsync(() => couponService.listApproved(), []);
  const { data: categories } = useAsync(() => categoryService.list(), []);

  const featured = (coupons ?? []).slice(0, 8);
  const flash = (coupons ?? []).filter((c) => c.is_flash === true).slice(0, 4);

  const search = () => navigate(`/offers?q=${encodeURIComponent(query)}`);
const flashDeals = [
  {
    id: 1,
    company: "Boat",
    title: "Boat Rockerz 550",
    image: "/images/boat.jpg",
    discount: "45% OFF",
    time: "Ends in 12h",
  },
  {
    id: 2,
    company: "Prestige",
    title: "Cookware Carnival",
    image: "/images/prestige.jpg",
    discount: "30% OFF",
    time: "Ends in 8h",
  },
  {
    id: 3,
    company: "Samsung",
    title: "Smart TV Festival",
    image: "/images/samsung-tv.jpg",
    discount: "25% OFF",
    time: "Ends in 6h",
  },
  {
    id: 4,
    company: "Dell",
    title: "Laptop Weekend Sale",
    image: "/images/dell.jpg",
    discount: "18% OFF",
    time: "Ends Tonight",
  },
];
const exclusiveCoupons = [
  {
    id: 1,
    company: "Nike",
    title: "Sports Shoes Collection",
    discount: "Flat 20% OFF",
    code: "NIKE20",
    image: "/images/nike.jpg",
  },
  {
    id: 2,
    company: "Myntra",
    title: "Fashion Fiesta",
    discount: "Extra 30% OFF",
    code: "MYNTRA30",
    image: "/images/myntra.jpg",
  },
  {
    id: 3,
    company: "IKEA",
    title: "Living Room Collection",
    discount: "Up to 35% OFF",
    code: "IKEA35",
    image: "/images/ikea.jpg",
  },
  {
    id: 4,
    company: "BigBasket",
    title: "Fresh Grocery Deals",
    discount: "Flat ₹200 OFF",
    code: "BB200",
    image: "/images/bigbasket.jpg",
  },
];
const steps = [
  {
    icon: "🔍",
    title: "Browse Offers",
    desc: "Explore thousands of verified offers from top brands.",
  },
  {
    icon: "💾",
    title: "Save Coupon",
    desc: "Save your favourite coupons with one click.",
  },
  {
    icon: "👛",
    title: "Open Wallet",
    desc: "All saved coupons are stored securely in your wallet.",
  },
  {
    icon: "📱",
    title: "Show QR Code",
    desc: "Open the coupon and display its QR code.",
  },
  {
    icon: "🛒",
    title: "Scan at Store",
    desc: "The cashier scans your QR code instantly.",
  },
  {
    icon: "🎉",
    title: "Enjoy Savings",
    desc: "Discount applied successfully. Happy Shopping!",
  },
];
  return (
    <div>
      {/* Hero */}
<section
  style={{
    background:
      "radial-gradient(circle at top right,#FFF2C7 0%,#FFF8EA 30%,#ffffff 75%)",
    padding: "70px 0 90px",
    overflow: "hidden",
  }}
>
  <div
    className="container"
    style={{
      display: "grid",
      gridTemplateColumns: "1.1fr 0.9fr",
      alignItems: "center",
      gap: "60px",
    }}
  >
    {/* LEFT CONTENT */}

    <div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "#FFF4D8",
          color: "#D89B17",
          padding: "8px 18px",
          borderRadius: "30px",
          fontWeight: 600,
          marginBottom: "25px",
        }}
      >
        ⚡ Premium Digital Coupons
      </div>

      <h1
        style={{
          fontSize: "65px",
          lineHeight: "1.05",
          fontWeight: 800,
          color: "#222",
          marginBottom: "25px",
        }}
      >
        Discover & Redeem
        <br />
        Exclusive
        <span style={{ color: "#D89B17" }}> Flyer Coupons</span>
        <br />
        From Top Brands
      </h1>

      <p
        style={{
          fontSize: "20px",
          color: "#666",
          maxWidth: "650px",
          lineHeight: "1.7",
          marginBottom: "40px",
        }}
      >
        Browse thousands of verified offers, save your favorite
        coupons, and redeem them online or in-store — all in one
        premium platform.
      </p>

      {/* SEARCH */}

      <div
        style={{
          display: "flex",
          background: "#fff",
          borderRadius: "60px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,.08)",
          maxWidth: "700px",
        }}
      >
        <input
          type="text"
          placeholder="Search brands, categories or offers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            padding: "22px 28px",
            fontSize: "17px",
          }}
        />

        <button
          onClick={search}
          style={{
            background: "#E4A817",
            color: "#fff",
            border: "none",
            width: "170px",
            fontWeight: 700,
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* STATS */}

      <div
        style={{
          display: "flex",
          gap: "55px",
          marginTop: "55px",
        }}
      >
        {[
          ["12k+", "Active Coupons"],
          ["850+", "Top Brands"],
          ["2.4M", "Happy Users"],
          ["98%", "Satisfaction"],
        ].map(([num, text]) => (
          <div key={num}>
            <h2
              style={{
                color: "#D89B17",
                fontSize: "42px",
                marginBottom: "5px",
                fontWeight: 800,
              }}
            >
              {num}
            </h2>

            <p
              style={{
                color: "#666",
                fontSize: "15px",
              }}
            >
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* RIGHT IMAGE */}

    <div
      style={{
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle,#FFD768 0%,rgba(255,215,104,.15) 70%,transparent 100%)",
          filter: "blur(15px)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 0,
        }}
      />

      <img
        src="/images/image.png"
        alt="Hero"
        style={{
         width:"650px",
         maxWidth:"100%",
         display:"block",
         margin:"auto",
          position: "relative",
          zIndex: 2,
        }}
      />
    </div>
  </div>
</section>

      {/* Categories */}
<section className="container" style={{ padding: "70px 24px" }}>
  <div
    className="flex items-center justify-between"
    style={{ marginBottom: 32 }}
  >
    <div>
      <h2 style={{ fontSize: 40, fontWeight: 800 }}>
        Browse Categories
      </h2>

      <p
        className="text-muted"
        style={{ marginTop: 8, fontSize: 17 }}
      >
        Find offers by category
      </p>
    </div>

    <Link
      to="/categories"
      className="btn btn-ghost btn-sm"
      style={{ fontWeight: 700 }}
    >
      View all
      <ArrowRight size={18} />
    </Link>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: 28,
    }}
  >
    {(categories ?? []).slice(0, 10).map((c) => {
      const Icon = getCategoryIcon(c.icon);

      const offerCount =
        coupons?.filter(
          (coupon) => coupon.category?.id === c.id
        ).length ?? 0;

      return (
        <Link
          key={c.id}
          to={`/categories/${c.slug}`}
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div
            className="category-card"
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: "28px 18px",
              height: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 12px 30px rgba(0,0,0,.08)",
              transition: ".3s",
            }}
          >
            <div
              className="category-icon"
              style={{
                width: 82,
                height: 82,
                borderRadius: 22,
                background: c.color,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon size={38} color="#fff" />
            </div>

            <h3
              style={{
                fontSize: 17,
                fontWeight: 700,
                textAlign: "center",
                margin: "14px 0 6px",
              }}
            >
              {c.name}
            </h3>

            <p
              style={{
                color: "#777",
                fontSize: 15,
                margin: 0,
              }}
            >
              {offerCount} Offers
            </p>

            <span
              style={{
                color: "#D69E00",
                fontWeight: 700,
                marginTop: 12,
              }}
            >
              Explore →
            </span>
          </div>
        </Link>
      );
    })}
  </div>
</section>
{/* Today's Top Offers */}

<section className="container" style={{ padding: "0 24px 70px" }}>
  <div
    className="flex items-center justify-between"
    style={{ marginBottom: 30 }}
  >
    <div>
      <h2
        style={{
          fontSize: 36,
          fontWeight: 800,
        }}
      >
        🔥 Today's Top Offers
      </h2>

      <p
        style={{
          color: "#777",
          marginTop: 8,
          fontSize: 17,
        }}
      >
        Limited-time deals from top brands
      </p>
    </div>

    <div
      style={{
        background: "#FFF3D2",
        color: "#D89B17",
        padding: "10px 18px",
        borderRadius: 30,
        fontWeight: 700,
        fontSize: 15,
      }}
    >
        Ends In • 08 : 34 : 20
    </div>
  </div>

  {loading ? (
    <PageLoader />
  ) : (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 26,
      }}
    >
      {featured.slice(0,4).map((coupon) => (
        <div
          key={coupon.id}
          onClick={() => navigate(`/coupons/${coupon.id}`)}
          style={{
            background: "#fff",
            borderRadius: 22,
            overflow: "hidden",
            cursor: "pointer",
            boxShadow: "0 12px 28px rgba(0,0,0,.08)",
            transition: ".3s",
          }}
        >
          <div style={{ position: "relative" }}>
            <img
              src={coupon.flyer_image_url}
              alt={coupon.title}
              style={{
                width: "100%",
                height: 210,
                objectFit: "cover",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                background: "#F5B82E",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: 30,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {coupon.discount}
            </div>
          </div>

          <div style={{ padding: 22 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <strong style={{ fontSize: 20 }}>
                {coupon.company?.name}
              </strong>

              <span
                style={{
                  background: "#F7F4EE",
                  padding: "6px 12px",
                  borderRadius: 30,
                  fontSize: 13,
                }}
              >
                {coupon.category?.name}
              </span>
            </div>

            <h3
              style={{
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              {coupon.title}
            </h3>

            <p
              style={{
                color: "#666",
                lineHeight: 1.6,
                height: 52,
                overflow: "hidden",
              }}
            >
              {coupon.description}
            </p>

            <button
              style={{
                width: "100%",
                marginTop: 22,
                padding: "14px",
                border: "none",
                borderRadius: 14,
                background: "#E4A817",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              Save Coupon
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

<section className="container" style={{ padding: "60px 24px" }}>

    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
        }}
    >

        <div>

            <h2
                style={{
                    fontSize: 34,
                    fontWeight: 700,
                    marginBottom: 8,
                }}
            >
                ⚡ Flash Deals
            </h2>

            <p
                style={{
                    color: "#777",
                    fontSize: 18,
                }}
            >
                Limited-time offers you shouldn't miss
            </p>

        </div>

        <Link
            to="/offers"
            style={{
                color: "#E4A817",
                fontWeight: 600,
                textDecoration: "none",
            }}
        >
            View All →
        </Link>

    </div>

    <div
        style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 24,
        }}
    >

        {(flash.length > 0 ? flash : flashDeals).map((deal) => {
            const isDbCoupon = 'created_at' in deal;
            return (
                <div
                    key={deal.id}
                    onClick={() => isDbCoupon && navigate(`/coupons/${deal.id}`)}
                    style={{
                        background: "#fff",
                        borderRadius: 22,
                        overflow: "hidden",
                        boxShadow: "0 12px 35px rgba(0,0,0,.08)",
                        transition: ".3s",
                        cursor: isDbCoupon ? 'pointer' : 'default',
                    }}
                >

                    <div style={{ position: "relative" }}>

                        <img
                            src={isDbCoupon ? deal.flyer_image_url : deal.image}
                            alt={deal.title}
                            style={{
                                width: "100%",
                                height: 210,
                                objectFit: "cover",
                            }}
                        />

                        <div
                            style={{
                                position: "absolute",
                                top: 15,
                                left: 15,
                                background: "#F4B400",
                                color: "#fff",
                                padding: "8px 18px",
                                borderRadius: 50,
                                fontWeight: 700,
                            }}
                        >
                            {deal.discount}
                        </div>

                    </div>

                    <div style={{ padding: 22 }}>

                        <p
                            style={{
                                color: "#888",
                                marginBottom: 8,
                                fontSize: 14,
                            }}
                        >
                            {isDbCoupon ? deal.company?.name : deal.company}
                        </p>

                        <h3
                            style={{
                                fontSize: 22,
                                marginBottom: 16,
                                height: 52,
                                overflow: 'hidden',
                                fontWeight: 700,
                            }}
                        >
                            {deal.title}
                        </h3>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 20,
                            }}
                        >

                            <span
                                style={{
                                    color: "#E53935",
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                }}
                            >
                                {isDbCoupon ? (
                                  <>⏱️ <FlashCountdown createdAt={deal.created_at} /></>
                                ) : (
                                  deal.time
                                )}
                            </span>

                        </div>

                        <button
                            className="btn"
                            onClick={(e) => {
                              if (isDbCoupon) {
                                e.stopPropagation();
                                navigate(`/coupons/${deal.id}`);
                              }
                            }}
                            style={{
                                width: "100%",
                                background: "#E4A817",
                                color: "#fff",
                                borderRadius: 14,
                                border: "none",
                                padding: "14px",
                                fontWeight: 600,
                                cursor: isDbCoupon ? 'pointer' : 'pointer',
                            }}
                        >
                            {isDbCoupon ? 'View Coupon' : 'Save Coupon'}
                        </button>

                    </div>

                </div>
            );
        })}

    </div>

</section>


<section className="container" style={{ padding: "60px 24px" }}>

    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
        }}
    >

        <div>

            <h2
                style={{
                    fontSize: 34,
                    fontWeight: 700,
                    marginBottom: 8,
                }}
            >
                ⭐ Exclusive Coupons
            </h2>

            <p
                style={{
                    color: "#777",
                    fontSize: 18,
                }}
            >
                Premium coupons available only on FlyNow
            </p>

        </div>

        <Link
            to="/offers"
            style={{
                color: "#E4A817",
                fontWeight: 600,
                textDecoration: "none",
            }}
        >
            View All →
        </Link>

    </div>

    <div
        style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 24,
        }}
    >

        {exclusiveCoupons.map((coupon) => (

            <div
                key={coupon.id}
                style={{
                    background: "#fff",
                    borderRadius: 22,
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,.08)",
                }}
            >

                <img
                    src={coupon.image}
                    alt={coupon.title}
                    style={{
                        width: "100%",
                        height: 210,
                        objectFit: "cover",
                    }}
                />

                <div style={{ padding: 22 }}>

                    <div
                        style={{
                            display: "inline-block",
                            background: "#FFF4D9",
                            color: "#D89B00",
                            padding: "6px 14px",
                            borderRadius: 30,
                            fontWeight: 600,
                            marginBottom: 14,
                        }}
                    >
                        {coupon.discount}
                    </div>

                    <h3
                        style={{
                            fontSize: 24,
                            marginBottom: 8,
                        }}
                    >
                        {coupon.title}
                    </h3>

                    <p
                        style={{
                            color: "#666",
                            marginBottom: 20,
                        }}
                    >
                        {coupon.company}
                    </p>

                    <div
                        style={{
                            border: "2px dashed #E4A817",
                            borderRadius: 12,
                            padding: "12px",
                            textAlign: "center",
                            fontWeight: 700,
                            color: "#D89B00",
                            marginBottom: 18,
                        }}
                    >
                        {coupon.code}
                    </div>

                    <button
                        style={{
                            width: "100%",
                            background: "#E4A817",
                            color: "#fff",
                            border: "none",
                            borderRadius: 14,
                            padding: "14px",
                            cursor: "pointer",
                            fontWeight: 600,
                        }}
                    >
                        Save to Wallet
                    </button>

                </div>

            </div>

        ))}

    </div>

</section>
      <section
  className="container"
  style={{
    padding: "70px 24px",
  }}
>
  <div
    style={{
      textAlign: "center",
      marginBottom: 50,
    }}
  >
    <h2
      style={{
        fontSize: 38,
        fontWeight: 700,
        marginBottom: 12,
      }}
    >
      🚀 How FlyNow Works
    </h2>

    <p
      style={{
        color: "#666",
        fontSize: 18,
      }}
    >
      Save coupons digitally and redeem them instantly at stores.
    </p>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(6,1fr)",
      gap: 22,
    }}
  >
    {steps.map((step, index) => (
      <div
        key={index}
        style={{
          background: "#fff",
          borderRadius: 22,
          padding: "28px 18px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,.08)",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 75,
            height: 75,
            borderRadius: "50%",
            background: "#FFF6DD",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
            margin: "0 auto 18px",
          }}
        >
          {step.icon}
        </div>

        <h3
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          {step.title}
        </h3>

        <p
          style={{
            color: "#777",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          {step.desc}
        </p>

        {index !== steps.length - 1 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "-14px",
              fontSize: 24,
              color: "#E4A817",
              transform: "translateY(-50%)",
            }}
          >
            →
          </div>
        )}
      </div>
    ))}
  </div>
</section>
    </div>
  );
}
