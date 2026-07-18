import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAsync } from '../../lib/use-async';
import { couponService } from '../../lib/services';
import EmptyState from '../../components/EmptyState';
import { PageLoader } from '../../components/Spinner';
import { useEffect, useMemo, useRef, useState } from "react";
import Confetti from "react-confetti";
import "./OffersPage.css";
import ScratchCard from "lesca-react-scratch-card";
import { supabase } from "../../lib/supabase";
import {
  Flame, Zap, ShieldCheck, Coins, Clock, Star, Gift,
  Ticket, Calendar, Users, Copy, Share2, Sparkles,
  CheckCircle
} from 'lucide-react';

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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
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
  const [showScratchModal, setShowScratchModal] = useState(false);
  const [scratchReward, setScratchReward] = useState("");
  const [scratchRevealed, setScratchRevealed] = useState(false);
  // Daily Check-In
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [claimedDays, setClaimedDays] = useState<number[]>([]);
  const [todayClaimed, setTodayClaimed] = useState(false);
  const [checkInReward, setCheckInReward] = useState("");
  // Refer & Earn
  const [showReferModal, setShowReferModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralCode = "FLYNOW2026";
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
  const dailyRewards = [
    "50 Reward Points",
    "10% OFF Coupon",
    "₹100 Cashback",
    "100 Reward Points",
    "Free Delivery",
    "Mystery Gift",
    "Premium Reward Box",
  ];
  const handleDailyCheckIn = async () => {
    if (todayClaimed) return;

    const reward = dailyRewards[currentDay - 1];

    const success = await saveReward(
      "Daily Check-In",
      reward,
      reward.includes("Reward Points")
        ? parseInt(reward.match(/\d+/)?.[0] || "0")
        : 0
    );

    if (!success) return;

    setCheckInReward(reward);

    setClaimedDays((prev) => [...prev, currentDay]);

    setTodayClaimed(true);

    if (currentDay < 7) {
      setCurrentDay((prev) => prev + 1);
    }

    alert("🎉 Daily reward claimed successfully!");
  };

  const copyReferralCode = async () => {
    await navigator.clipboard.writeText(referralCode);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const shareReferral = async () => {
    const message = `🎉 Join FlyNow and start saving with amazing coupons!

Use my referral code: ${referralCode}

You'll get ₹100 OFF on your first order and I'll earn 500 Reward Points!

https://flynow.com`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join FlyNow",
          text: message,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(message);

      alert("Sharing isn't supported on this browser.\nReferral message copied to clipboard!");
    }
  };
  const saveReward = async (
    rewardType: string,
    rewardName: string,
    rewardPoints: number = 0
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      return false;
    }

    const { error } = await supabase
      .from("user_rewards")
      .insert({
        user_id: user.id,
        reward_type: rewardType,
        reward_name: rewardName,
        reward_points: rewardPoints,
      });

    if (error) {
      console.error(error);
      return false;
    }

    console.log("Reward saved!");
    return true;
  };
  const claimScratchReward = async () => {
    const success = await saveReward(
      "Scratch Card",
      scratchReward,
      0
    );

    if (success) {
      alert("🎉 Reward claimed successfully!");
      setShowScratchModal(false);
    }
  };
  const claimSpinReward = async () => {
    const success = await saveReward(
      "Spin & Win",
      reward,
      0
    );

    if (success) {
      alert("🎉 Reward claimed successfully!");
      setShowSpinModal(false);
    }
  };


  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Hero Banner */}


      <div
        style={{
          background:
            `
radial-gradient(circle at top left,#FFEFA8 0%,transparent 28%),
radial-gradient(circle at bottom right,#FFD45E 0%,transparent 30%),
linear-gradient(135deg,#E4A817 0%,#F5C93C 55%,#FFE68B 100%)
`,
          borderRadius: 28,
          padding: "70px 70px",
          minHeight: 520,
          color: "#222",
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          alignItems: "center",
          marginBottom: 40,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 80,
            fontSize: 26,
            opacity: .6
          }}
        >
          ✨
        </div>

        <div
          style={{
            position: "absolute",
            top: 120,
            right: 100,
            fontSize: 22,
            opacity: .5
          }}
        >
          ⭐
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 280,
            fontSize: 30,
            opacity: .6
          }}
        >
          💰
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 90,
            right: 220,
            fontSize: 28,
            opacity: .5
          }}
        >
          🏷️
        </div>
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#fff",
              color: "#D99000",
              padding: "8px 18px",
              borderRadius: 30,
              fontWeight: 700,
              marginBottom: 18,
            }}
          >
            <Flame size={16} color="#D99000" fill="#D99000" /> LIVE TODAY
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
              gap: 16,
              marginTop: 28,
              marginBottom: 35
            }}
          >
            <button
              style={{
                background: "#222",
                color: "#fff",
                padding: "16px 34px",
                borderRadius: 14,
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🔥 Today's Deals
            </button>

            <button
              style={{
                background: "#fff",
                color: "#222",
                padding: "16px 34px",
                borderRadius: 14,
                border: "2px solid rgba(0,0,0,.08)",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🎁 Exclusive Coupons
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Live Offers", icon: Zap, color: "#E4A817" },
              { label: "Verified Coupons", icon: ShieldCheck, color: "#4CAF50" },
              { label: "Extra Cashback", icon: Coins, color: "#FF9800" },
              { label: "Flash Deals", icon: Flame, color: "#FF5722" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "#fff",
                  padding: "10px 18px",
                  borderRadius: 30,
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <item.icon size={16} color={item.color} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            height: 420,
          }}
        >

          {/* Main Gift */}

          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              fontSize: 220,
              animation: "floatGift 4s ease-in-out infinite",
              zIndex: 3,
            }}
          >
            🎁
          </div>

          {/* Coupon */}

          <div
            className="offerFloat"
            style={{
              top: 10,
              left: 10,
              background: "#fff",
            }}
          >
            🏷️ 70% OFF
          </div>

          {/* Cashback */}

          <div
            className="offerFloat"
            style={{
              top: 40,
              right: 0,
              background: "#fff",
            }}
          >
            💰 Cashback
          </div>

          {/* Gift */}

          <div
            className="offerFloat"
            style={{
              bottom: 30,
              left: 0,
              background: "#fff",
            }}
          >
            🎉 Rewards
          </div>

          {/* Coupon */}

          <div
            className="offerFloat"
            style={{
              bottom: 20,
              right: 20,
              background: "#fff",
            }}
          >
            🎫 Coupons
          </div>

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
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Flame size={32} color="#D89B17" fill="#D89B17" /> Today's Live Sale
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Clock size={12} color="#D89B17" /> ENDS TODAY
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
            className="premium-card"
              key={coupon.id}
              onMouseEnter={() => setHoveredCard(coupon.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(`/coupons/${coupon.id}`)}
              style={{
                background: "#fff",
                borderRadius: 22,
                overflow: "hidden",
                cursor: "pointer",

                transform:
                  hoveredCard === coupon.id
                    ? "translateY(-12px) scale(1.03)"
                    : "translateY(0) scale(1)",

                boxShadow:
                  hoveredCard === coupon.id
                    ? "0 28px 60px rgba(228,168,23,.25)"
                    : "0 12px 28px rgba(0,0,0,.08)",

                border:
                  hoveredCard === coupon.id
                    ? "2px solid #E4A817"
                    : "2px solid transparent",

                transition: "all .35s ease",
              }}
            >

              <div style={{ position: "relative" }}>

                <img
                  className="premium-image"
                  src={coupon.flyer_image_url}
                  alt={coupon.title}
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",

                    transform:
                      hoveredCard === coupon.id
                        ? "scale(1.08)"
                        : "scale(1)",

                    transition: ".4s",
                  }}
                />

                <div
                className="offer-badge"
                  style={{
                    position: "absolute",
                    top: 15,
                    left: 15,

                    background: "#F4B400",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: 30,
                    fontWeight: 700,

                    transform:
                      hoveredCard === coupon.id
                        ? "scale(1.1)"
                        : "scale(1)",

                    transition: ".3s",
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
                className="offer-title"
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
                className="offer-btn"
                  style={{
                    width: "100%",
                    marginTop: 18,

                    background:
                      hoveredCard === coupon.id
                        ? "#C98D00"
                        : "#E4A817",

                    color: "#fff",
                    border: "none",
                    padding: "13px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontWeight: 700,

                    transform:
                      hoveredCard === coupon.id
                        ? "translateY(-2px)"
                        : "translateY(0)",

                    transition: ".3s",
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
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Flame size={32} color="#D89B17" fill="#D89B17" /> Weekly Deals
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
              company: "Samsung",
              color: "#EEF5FF",
            },

            {
              image: "/images/week-fashion.jpg",
              title: "Fashion Fiesta",
              subtitle: "Buy 2 Get 1",
              brands: "Nike • Puma • Adidas • Myntra",
              company: "Myntra",
              color: "#FFF1F7",
            },

            {
              image: "/images/week-home.jpg",
              title: "Home Essentials",
              subtitle: "Extra 35% OFF",
              brands: "Prestige • IKEA • Philips",
              company: "IKEA",
              color: "#F3FFF2",
            },

            {
              image: "/images/week-grocery.jpg",
              title: "Fresh Grocery Week",
              subtitle: "Flat ₹300 OFF",
              brands: "BigBasket • Blinkit • Zepto",
              company: "BigBasket",
              color: "#FFF9ED",
            },
          ].map((deal) => {
            const coupon = coupons?.find(
              (c) => c.company?.name === deal.company
            );

            return (

              <div
              className="premium-card"
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
                className="premium-image"
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
                  className="offer-title"
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
                  className="offer-btn"
                    onClick={() => {
                      if (coupon) {
                        navigate(`/coupons/${coupon.id}`);
                      } else {
                        alert("Coupon not available.");
                      }
                    }}
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
            );
          })}

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
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Star size={32} color="#D89B17" fill="#D89B17" /> Monthly Mega Offers
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
            className="premium-card"
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
               className="premium-image"
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
                className="offer-title"
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
                className="offer-btn"
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <Gift size={36} color="#D89B17" fill="#D89B17" /> Reward Zone
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
              btn: "🎡 Spin Now",
              icon: null,
              iconColor: ""
            },

            {
              icon: Ticket,
              iconColor: "#9C27B0",
              title: "Scratch Card",
              desc: "Scratch today's lucky card.",
              color: "#F4EEFF",
              btn: "Scratch",
              emoji: ""
            },

            {
              icon: Calendar,
              iconColor: "#4CAF50",
              title: "Daily Check-In",
              desc: "Login daily and collect rewards.",
              color: "#EAFBF2",
              btn: "Claim",
              emoji: ""
            },

            {
              icon: Users,
              iconColor: "#2196F3",
              title: "Refer & Earn",
              desc: "Invite friends and earn 500 points.",
              color: "#EAF4FF",
              btn: "Invite",
              emoji: ""
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
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: card.icon ? "#fff" : "transparent",
                  boxShadow: card.icon ? "0 8px 20px rgba(0,0,0,0.05)" : "none",
                  marginBottom: 18,
                }}
              >
                {card.icon ? (
                  <card.icon size={36} color={card.iconColor} />
                ) : (
                  <span style={{ fontSize: 58 }}>{card.emoji}</span>
                )}
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

                  if (card.title === "Scratch Card") {
                    setScratchReward("");

                    setScratchRevealed(false);

                    const rewards = [
                      "₹100 OFF Coupon",
                      "₹250 Cashback",
                      "15% OFF Coupon",
                      "Free Delivery",
                      "Mystery Gift",
                      "Better Luck Next Time",
                    ];

                    const random =
                      rewards[Math.floor(Math.random() * rewards.length)];

                    setScratchReward(random);

                    setShowScratchModal(true);
                  }
                  if (card.title === "Daily Check-In") {
                    setShowCheckInModal(true);
                  }
                  if (card.title === "Refer & Earn") {
                    setShowReferModal(true);
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
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Star size={24} color="#D89B17" fill="#D89B17" /> Keep Saving with FlyNow
            </h2>
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Sparkles size={24} color="#E4A817" /> Congratulations!
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
                  onClick={claimSpinReward}
                  style={{
                    marginTop: 20,
                    background: "#E4A817",
                    color: "#fff",
                    border: "none",
                    padding: "12px 28px",
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
      {showScratchModal && (
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
              width: 500,
              background: "#fff",
              borderRadius: 30,
              padding: 35,
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowScratchModal(false)}
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

            <h2
              style={{
                fontSize: 34,
                marginBottom: 25,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Ticket size={30} color="#E4A817" /> Scratch Card
            </h2>

            <p
              style={{
                color: "#666",
                marginBottom: 25,
              }}
            >
              Scratch the silver area to reveal today's reward!
            </p>

            {/* Scratch Area */}
            <div
              style={{
                width: 320,
                height: 180,
                margin: "0 auto",
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <ScratchCard
                width={320}
                height={180}
                cover="/images/scratch-layer.png"
                percent={50}
                onComplete={() => setScratchRevealed(true)}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg,#FFF8D9,#FFE082)",
                    borderRadius: 20,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "#FFF4D6",
                      marginBottom: 10,
                    }}
                  >
                    <Sparkles size={32} color="#D89B17" />
                  </div>

                  <h2
                    style={{
                      color: "#D89B17",
                      fontSize: 28,
                      fontWeight: 800,
                    }}
                  >
                    {scratchReward}
                  </h2>

                  <p>Congratulations!</p>
                </div>
              </ScratchCard>
            </div>

            {scratchRevealed && (
              <div
                style={{
                  marginTop: 30,
                  padding: 20,
                  background: "#FFF8D9",
                  borderRadius: 18,
                }}
              >
                <h3
                  style={{
                    color: "#E4A817",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Sparkles size={20} color="#E4A817" /> Congratulations!
                </h3>

                <h2>{scratchReward}</h2>

                <button
                  onClick={claimScratchReward}
                  style={{
                    marginTop: 20,
                    background: "#E4A817",
                    color: "#fff",
                    border: "none",
                    padding: "12px 28px",
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
      {showCheckInModal && (
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
              width: 550,
              background: "#fff",
              borderRadius: 30,
              padding: 35,
              position: "relative",
              textAlign: "center",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowCheckInModal(false)}
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

            <h2
              style={{
                fontSize: 34,
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Calendar size={30} color="#E4A817" /> Daily Check-In
            </h2>

            <p
              style={{
                color: "#666",
                marginBottom: 30,
              }}
            >
              Check in every day and build your reward streak!
            </p>

            {/* 7-Day Calendar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7,1fr)",
                gap: 12,
                marginBottom: 30,
              }}
            >
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    background: i + 1 === currentDay ? "#FFF4D6" : "#F5F5F5",
                    border:
                      i + 1 === currentDay
                        ? "2px solid #E4A817"
                        : "2px solid transparent",
                    borderRadius: 16,
                    padding: "16px 10px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    Day {i + 1}
                  </div>

                  <div style={{ fontSize: 28, display: "flex", justifyContent: "center", marginTop: 4 }}>
                    {claimedDays.includes(i + 1) ? (
                      <CheckCircle size={24} color="#10B981" />
                    ) : (
                      <Gift size={24} color="#999" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Reward Box */}
            <div
              style={{
                background: "#FFF8D9",
                borderRadius: 18,
                padding: 20,
                marginBottom: 25,
              }}
            >
              <h3
                style={{
                  color: "#E4A817",
                  marginBottom: 10,
                }}
              >
                Today's Reward
              </h3>

              <h2 style={{ margin: 0 }}>
                {dailyRewards[currentDay - 1]}
              </h2>
            </div>

            {/* Claim Button */}
            <button
              onClick={handleDailyCheckIn}
              disabled={todayClaimed}
              style={{
                background: todayClaimed ? "#999" : "#E4A817",
                color: "#fff",
                border: "none",
                padding: "14px 34px",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 16,
                cursor: todayClaimed ? "not-allowed" : "pointer",
              }}
            >
              {todayClaimed ? "✅ Claimed Today" : "Claim Today's Reward"}
            </button>
            {todayClaimed && (
              <div
                style={{
                  marginTop: 25,
                  padding: 18,
                  background: "#FFF8D9",
                  borderRadius: 16,
                }}
              >
                <h3
                  style={{
                    color: "#E4A817",
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Sparkles size={20} color="#E4A817" /> Reward Collected!
                </h3>

                <h2>{checkInReward}</h2>
              </div>
            )}
          </div>
        </div>
      )}
      {showReferModal && (
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
              width: 560,
              background: "#fff",
              borderRadius: 30,
              padding: 35,
              position: "relative",
              textAlign: "center",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setShowReferModal(false)}
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

            <h2
              style={{
                fontSize: 34,
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <Users size={30} color="#E4A817" /> Refer & Earn
            </h2>

            <p
              style={{
                color: "#666",
                marginBottom: 30,
              }}
            >
              Invite your friends and both of you get exciting rewards!
            </p>

            {/* Rewards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginBottom: 30,
              }}
            >
              <div
                style={{
                  background: "#FFF8D9",
                  borderRadius: 18,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "#fff",
                    marginBottom: 10,
                  }}
                >
                  <Gift size={28} color="#E4A817" />
                </div>

                <h3 style={{ color: "#E4A817", margin: "4px 0" }}>You Earn</h3>

                <h2 style={{ margin: 0 }}>500 Points</h2>
              </div>

              <div
                style={{
                  background: "#EEF8FF",
                  borderRadius: 18,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "#fff",
                    marginBottom: 10,
                  }}
                >
                  <Coins size={28} color="#2196F3" />
                </div>

                <h3 style={{ color: "#2196F3", margin: "4px 0" }}>Friend Gets</h3>

                <h2 style={{ margin: 0 }}>₹100 OFF</h2>
              </div>
            </div>

            {/* Referral Code */}
            <div
              style={{
                background: "#F8F8F8",
                borderRadius: 18,
                padding: 25,
                marginBottom: 25,
              }}
            >
              <p
                style={{
                  marginBottom: 10,
                  color: "#777",
                }}
              >
                Your Referral Code
              </p>

              <h1
                style={{
                  letterSpacing: 4,
                  color: "#E4A817",
                  margin: 0,
                }}
              >
                {referralCode}
              </h1>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: 15,
                justifyContent: "center",
                marginBottom: 30,
              }}
            >
              <button
                onClick={copyReferralCode}
                style={{
                  background: "#E4A817",
                  color: "#fff",
                  border: "none",
                  padding: "14px 28px",
                  borderRadius: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {copied ? (
                    <>
                      <CheckCircle size={16} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Copy Code
                    </>
                  )}
                </span>
              </button>

              <button
                onClick={shareReferral}
                style={{
                  background: "#2196F3",
                  color: "#fff",
                  border: "none",
                  padding: "14px 28px",
                  borderRadius: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Share2 size={16} /> Share Now
                </span>
              </button>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <div
                style={{
                  background: "#FFF8D9",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <h2 style={{ color: "#E4A817", margin: 0 }}>12</h2>
                <p>Total Referrals</p>
              </div>

              <div
                style={{
                  background: "#EEF8FF",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <h2 style={{ color: "#2196F3", margin: 0 }}>6000</h2>
                <p>Reward Points</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}