import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAsync } from '../../lib/use-async';
import { couponService } from '../../lib/services';
import CouponCard from '../../components/CouponCard';
import EmptyState from '../../components/EmptyState';
import { PageLoader } from '../../components/Spinner';
import { useEffect, useMemo, useRef, useState } from "react";
import Confetti from "react-confetti";

export default function OffersPage() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 45,
    seconds: 0,
  });
  const [params] = useSearchParams();
  const [q] = useState(params.get('q') ?? '');
  const [cat] = useState('all');
  const [sort] = useState('newest');
  const { data: coupons, loading } = useAsync(() => couponService.listApproved(), []);

  const filtered = useMemo(() => {
    let list = coupons ?? [];
    if (q) list = list.filter((c) => (c.title + c.description + (c.company?.name ?? '')).toLowerCase().includes(q.toLowerCase()));
    if (cat !== 'all') list = list.filter((c) => c.category?.slug === cat);
    if (sort === 'newest') list = [...list].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    if (sort === 'expiring') list = [...list].sort((a, b) => +new Date(a.expiry_date) - +new Date(b.expiry_date));
    if (sort === 'popular') list = [...list].sort((a, b) => b.views - a.views);
    return list;
  }, [coupons, q, cat, sort]);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
    const [showSpinModal, setShowSpinModal] = useState(false);
      const drawWheel = () => {
     console.log("Canvas:", wheelRef.current);
    const canvas = wheelRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const radius = size / 2;

    ctx.clearRect(0, 0, size, size);

    const sliceAngle = (2 * Math.PI) / rewards.length;

    rewards.forEach((item, index) => {
      const start = index * sliceAngle;
      const end = start + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 8, start, end);
      ctx.closePath();

      ctx.fillStyle = item.color;
      ctx.fill();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.save();

      ctx.translate(radius, radius);
      ctx.rotate(start + sliceAngle / 2);

      ctx.textAlign = "center";
      ctx.fillStyle = "#fff";

      ctx.font = "30px Arial";
      ctx.fillText(item.emoji, radius - 80, -10);

      ctx.font = "bold 17px Arial";
      ctx.fillText(item.label, radius - 80, 18);
      ctx.beginPath();

      ctx.moveTo(radius - 30, -30);

      ctx.lineTo(radius - 10, -10);

      ctx.strokeStyle = "rgba(255,255,255,.4)";

      ctx.stroke();

      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(radius, radius, 45, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#E4A817";
    ctx.stroke();

    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "#E4A817";
    ctx.textAlign = "center";
    ctx.font = "bold 22px Arial";
    ctx.fillStyle = "#222";

    ctx.fillText("FLYNOW", radius, radius - 4);

    ctx.font = "15px Arial";

    ctx.fillStyle = "#E4A817";

    ctx.fillText("REWARDS", radius, radius + 18);
  };

useEffect(() => {
  if (showSpinModal) {
    setTimeout(() => {
      drawWheel();
    }, 50);
  }
}, [showSpinModal]);

  const [spinning, setSpinning] = useState(false);

  const [rotation, setRotation] = useState(0);

  const [reward, setReward] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const wheelRef = useRef<HTMLCanvasElement | null>(null);
  const rewards = [
    { label: "10% OFF", reward: "10% OFF Coupon", color: "#FFD54F", emoji: "🎁" },
    { label: "₹100", reward: "₹100 Cashback", color: "#4CAF50", emoji: "💰" },
    { label: "+20 PTS", reward: "20 Reward Points", color: "#42A5F5", emoji: "⭐" },
    { label: "FREE", reward: "Free Delivery", color: "#AB47BC", emoji: "🚚" },
    { label: "MYSTERY", reward: "Mystery Coupon", color: "#FF7043", emoji: "🎉" },
    { label: "15% OFF", reward: "15% OFF Coupon", color: "#26A69A", emoji: "🏷️" },
    { label: "₹250", reward: "₹250 OFF Coupon", color: "#EF5350", emoji: "🍀" },
    { label: "TRY AGAIN", reward: "Better Luck Next Time", color: "#BDBDBD", emoji: "😅" },
  ];

  const handleSpin = () => {
    if (spinning) return;

    setSpinning(true);
    setReward("");

    // Random prize
    const slice = 360 / rewards.length;

    // Random angle where the wheel should finally stop
    const targetAngle = Math.floor(Math.random() * 360);

    // Extra spins
    const extraSpins = 360 * (6 + Math.floor(Math.random() * 3));

    const finalRotation = extraSpins + targetAngle;

    setRotation(finalRotation);
    setTimeout(() => {
  drawWheel();
}, 5100);

    setTimeout(() => {

      const normalized =
        ((360 - (finalRotation % 360)) + 360) % 360;

      const winner =
        Math.floor(normalized / slice);

      setReward(rewards[winner].reward);

      setShowConfetti(true);

      setSpinning(false);

      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

    }, 5000);
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Hero Banner */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#F6B61E 0%,#FFD54F 50%,#FFEAA7 100%)",
          borderRadius: 28,
          padding: "60px",
          color: "#222",
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          alignItems: "center",
          marginBottom: 40,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-block",
              background: "#fff",
              color: "#D99000",
              padding: "8px 18px",
              borderRadius: 30,
              fontWeight: 700,
              marginBottom: 18,
            }}
          >
            🔥 LIVE TODAY
          </div>

          <h1
            style={{
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 18,
            }}
          >
            Mega Savings Week
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#4d4d4d",
              maxWidth: 550,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            Save on Electronics, Fashion, Furniture, Grocery,
            Sports and hundreds of premium brands.
            Every coupon is verified and ready to redeem.
          </p>

          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            {[
              "⚡ Live Offers",
              "🎁 Verified Coupons",
              "💰 Extra Cashback",
              "🔥 Flash Deals",
            ].map((item) => (
              <div
                key={item}
                style={{
                  background: "#fff",
                  padding: "10px 18px",
                  borderRadius: 30,
                  fontWeight: 600,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
          }}
        >
          <img
            src="/images/image.png"
            alt="Offers"
            style={{
              width: "100%",
              maxWidth: 420,
            }}
          />
        </div>
      </div>

      {/* Today's Live Sale */}

      <section style={{ marginTop: 50, marginBottom: 60 }}>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 25,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 34,
                fontWeight: 800,
              }}
            >
              🔥 Today's Live Sale
            </h2>

            <p
              style={{
                color: "#777",
                marginTop: 8,
              }}
            >
              Grab today's hottest deals before they're gone.
            </p>
          </div>

          <div
            style={{
              background: "#FFF3D2",
              color: "#D89B17",
              padding: "10px 18px",
              borderRadius: 30,
              fontWeight: 700,
            }}
          >
            <div
              style={{
                background: "#FFF3D2",
                color: "#D89B17",
                padding: "14px 22px",
                borderRadius: 20,
                textAlign: "center",
                minWidth: 170,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                ⏰ ENDS TODAY
              </div>

              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  letterSpacing: 2,
                }}
              >
                {String(timeLeft.hours).padStart(2, "0")} :
                {String(timeLeft.minutes).padStart(2, "0")} :
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
            </div>

          </div>

        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 24,
          }}
        >

          {filtered.slice(0, 4).map((coupon) => (

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
                    height: 220,
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
                    padding: "8px 16px",
                    borderRadius: 30,
                    fontWeight: 700,
                  }}
                >
                  {coupon.discount}
                </div>

              </div>

              <div style={{ padding: 20 }}>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <strong>{coupon.company?.name}</strong>

                  <span
                    style={{
                      background: "#F6F4EF",
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                    }}
                  >
                    {coupon.category?.name}
                  </span>

                </div>

                <h3
                  style={{
                    fontSize: 20,
                    marginBottom: 10,
                  }}
                >
                  {coupon.title}
                </h3>

                <p
                  style={{
                    color: "#666",
                    height: 45,
                    overflow: "hidden",
                    fontSize: 14,
                  }}
                >
                  {coupon.description}
                </p>

                <button
                  style={{
                    width: "100%",
                    marginTop: 18,
                    background: "#E4A817",
                    color: "#fff",
                    border: "none",
                    padding: "13px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Save Coupon
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>
      {/* Weekly Deals */}

      <section style={{ marginBottom: 70 }}>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 34,
                fontWeight: 800,
              }}
            >
              🔥 Weekly Deals
            </h2>

            <p
              style={{
                color: "#777",
                marginTop: 8,
                fontSize: 16,
              }}
            >
              Handpicked offers available only this week.
            </p>
          </div>

          <span
            style={{
              color: "#E4A817",
              fontWeight: 700,
            }}
          >
            Valid Till Sunday
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 24,
          }}
        >

          {[
            {
              image: "/images/week-electronics.jpg",
              title: "Electronics Festival",
              subtitle: "Up to 70% OFF",
              brands: "Samsung • Apple • Boat • Dell",
              color: "#EEF5FF",
            },

            {
              image: "/images/week-fashion.jpg",
              title: "Fashion Fiesta",
              subtitle: "Buy 2 Get 1",
              brands: "Nike • Puma • Adidas • Myntra",
              color: "#FFF1F7",
            },

            {
              image: "/images/week-home.jpg",
              title: "Home Essentials",
              subtitle: "Extra 35% OFF",
              brands: "Prestige • IKEA • Philips",
              color: "#F3FFF2",
            },

            {
              image: "/images/week-grocery.jpg",
              title: "Fresh Grocery Week",
              subtitle: "Flat ₹300 OFF",
              brands: "BigBasket • Blinkit • Zepto",
              color: "#FFF9ED",
            },

          ].map((deal) => (

            <div
              key={deal.title}
              style={{
                background: deal.color,
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                padding: 20,
                boxShadow: "0 10px 30px rgba(0,0,0,.06)",
              }}
            >

              <img
                src={deal.image}
                alt={deal.title}
                style={{
                  width: 170,
                  height: 170,
                  objectFit: "cover",
                  borderRadius: 18,
                }}
              />

              <div
                style={{
                  marginLeft: 24,
                  flex: 1,
                }}
              >

                <div
                  style={{
                    background: "#fff",
                    display: "inline-block",
                    padding: "6px 14px",
                    borderRadius: 20,
                    color: "#E4A817",
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  Weekly Deal
                </div>

                <h3
                  style={{
                    fontSize: 26,
                    marginBottom: 10,
                  }}
                >
                  {deal.title}
                </h3>

                <div
                  style={{
                    color: "#E4A817",
                    fontSize: 20,
                    fontWeight: 800,
                    marginBottom: 12,
                  }}
                >
                  {deal.subtitle}
                </div>

                <p
                  style={{
                    color: "#666",
                    marginBottom: 18,
                  }}
                >
                  {deal.brands}
                </p>

                <button
                  style={{
                    background: "#E4A817",
                    color: "#fff",
                    border: "none",
                    padding: "12px 26px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Explore →
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>
      {/* Monthly Mega Offers */}

      <section style={{ marginBottom: 70 }}>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
          }}
        >

          <div>

            <h2
              style={{
                fontSize: 34,
                fontWeight: 800,
              }}
            >
              🌟 Monthly Mega Offers
            </h2>

            <p
              style={{
                color: "#777",
                marginTop: 8,
              }}
            >
              Biggest savings of the month from premium brands.
            </p>

          </div>

          <span
            style={{
              color: "#E4A817",
              fontWeight: 700,
            }}
          >
            Valid This Month
          </span>

        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 24,
          }}
        >

          {[
            {
              title: "Amazon Mega Electronics",
              offer: "UP TO 70% OFF",
              image: "/images/amazon-sale.jpg",
              bg: "#FFF8E8",
            },

            {
              title: "Flipkart Shopping Carnival",
              offer: "FLAT 50% OFF",
              image: "/images/flipkart-sale.jpg",
              bg: "#EEF6FF",
            },

            {
              title: "Nike Sports Collection",
              offer: "EXTRA 25% OFF",
              image: "/images/nike-sale.jpg",
              bg: "#F6F6F6",
            },

            {
              title: "IKEA Home Festival",
              offer: "SAVE ₹3000",
              image: "/images/ikea-sale.jpg",
              bg: "#F2FFF1",
            },

          ].map((item) => (

            <div
              key={item.title}
              style={{
                background: item.bg,
                borderRadius: 22,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                padding: 20,
                boxShadow: "0 10px 25px rgba(0,0,0,.06)",
              }}
            >

              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 18,
                  objectFit: "cover",
                }}
              />

              <div
                style={{
                  marginLeft: 24,
                  flex: 1,
                }}
              >

                <div
                  style={{
                    display: "inline-block",
                    background: "#fff",
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontWeight: 700,
                    color: "#E4A817",
                    marginBottom: 14,
                  }}
                >
                  Monthly Offer
                </div>

                <h3
                  style={{
                    fontSize: 24,
                    marginBottom: 10,
                  }}
                >
                  {item.title}
                </h3>

                <div
                  style={{
                    fontSize: 20,
                    color: "#E4A817",
                    fontWeight: 800,
                    marginBottom: 16,
                  }}
                >
                  {item.offer}
                </div>

                <button
                  style={{
                    background: "#E4A817",
                    color: "#fff",
                    border: "none",
                    padding: "12px 26px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Shop Now →
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>
      {/* Reward Zone */}

      <section style={{ marginBottom: 80 }}>

        <div
          style={{
            textAlign: "center",
            marginBottom: 35,
          }}
        >
          <h2
            style={{
              fontSize: 38,
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            🎁 Reward Zone
          </h2>

          <p
            style={{
              color: "#666",
              fontSize: 17,
            }}
          >
            Complete activities, unlock rewards and save even more.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 24,
          }}
        >

          {[
            {
              emoji: "🎡",
              title: "Spin & Win",
              desc: "Spin once every day and win coupons.",
              color: "#FFF7E2",
              btn: "🎡 Spin Now"
            },

            {
              emoji: "🎫",
              title: "Scratch Card",
              desc: "Scratch today's lucky card.",
              color: "#F4EEFF",
              btn: "Scratch",
            },

            {
              emoji: "📅",
              title: "Daily Check-In",
              desc: "Login daily and collect rewards.",
              color: "#EAFBF2",
              btn: "Claim",
            },

            {
              emoji: "👥",
              title: "Refer & Earn",
              desc: "Invite friends and earn 500 points.",
              color: "#EAF4FF",
              btn: "Invite",
            },

          ].map((card) => (

            <div
              key={card.title}
              style={{
                background: card.color,
                borderRadius: 24,
                padding: 30,
                textAlign: "center",
                boxShadow: "0 12px 28px rgba(0,0,0,.06)",
                transition: ".3s",
              }}
            >

              <div
                style={{
                  fontSize: 58,
                  marginBottom: 18,
                }}
              >
                {card.emoji}
              </div>

              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                {card.title}
              </h3>

              <p
                style={{
                  color: "#666",
                  lineHeight: 1.6,
                  minHeight: 55,
                  marginBottom: 22,
                }}
              >
                {card.desc}
              </p>

              <button
                onClick={() => {
                  if (card.title === "Spin & Win") {
                    setShowSpinModal(true);
                  }
                }}
                style={{
                  background: "#E4A817",
                  color: "#fff",
                  border: "none",
                  padding: "12px 26px",
                  borderRadius: 14,
                  cursor: "pointer",
                  fontWeight: 700,
                  width: "100%",
                }}
              >
                {card.btn}
              </button>

            </div>

          ))}

        </div>

      </section>
      {loading ? (
        <PageLoader />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No offers found"
          message="Try adjusting your search or filters."
        />
      ) : (
        <>
          <div
            style={{
              marginBottom: 30,
              textAlign: "center",
            }}
          >
            <h2>💛 Keep Saving with FlyNow</h2>
            <p>
              Discover more verified offers and unlock bigger savings every day.
            </p>

            <p
              style={{
                color: "#666",
                fontSize: 17,
              }}
            >
              Explore hundreds of verified coupons across all categories.
            </p>
          </div>

          <div className="grid grid-auto">
            {filtered.map((c) => (
              <CouponCard
                key={c.id}
                coupon={c}
                onView={() => navigate(`/coupons/${c.id}`)}
              />
            ))}
          </div>
        </>
      )}

      {showSpinModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: 520,
              background: "#fff",
              borderRadius: 30,
              padding: 40,
              textAlign: "center",
              position: "relative",
            }}
          >
            {showConfetti && (
              <Confetti
                recycle={false}
                numberOfPieces={350}
              />
            )}

            <button
              onClick={() => setShowSpinModal(false)}
              style={{
                position: "absolute",
                top: 18,
                right: 20,
                border: "none",
                background: "none",
                fontSize: 24,
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <h2 style={{ fontSize: 34, marginBottom: 20 }}>
              🎡 Spin & Win
            </h2>

            <div
              style={{
                position: "relative",
                width: 420,
                margin: "20px auto",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -15,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: 36,
                  zIndex: 10,
                }}
              >
                🔻
              </div>

              <canvas
                ref={wheelRef}
                width={420}
                height={420}
                style={{
                  width: "100%",
                  transition: "transform 5s ease-out",
                  transform: `rotate(${rotation}deg)`,
                }}
              />
            </div>

            <button
              onClick={handleSpin}
              disabled={spinning}
              style={{
                marginTop: 20,
                padding: "15px 34px",
                background: spinning ? "#999" : "#E4A817",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                cursor: spinning ? "not-allowed" : "pointer",
                fontWeight: 700,
                fontSize: 17,
              }}
            >
              {spinning ? "Spinning..." : "🎡 SPIN"}
            </button>

            {reward && (
              <div
                style={{
                  marginTop: 30,
                  padding: 20,
                  background: "#FFF7D8",
                  borderRadius: 18,
                  border: "2px solid #F4C542",
                }}
              >
                <h2
                  style={{
                    marginBottom: 10,
                    color: "#E4A817",
                  }}
                >
                  🎉 Congratulations!
                </h2>

                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    marginBottom: 20,
                  }}
                >
                  {reward}
                </div>

                <button
                  style={{
                    padding: "12px 30px",
                    background: "#E4A817",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Claim Reward
                </button>
              </div>
            )}
          </div>     
        </div>        
      )}   

    </div> 
  );
}