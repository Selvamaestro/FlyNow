import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Building2, FileText, Bookmark, ArrowLeft, Copy, Check, Eye } from 'lucide-react';
import { couponService, savedCouponService } from '../../lib/services';
import { useAuth } from '../../lib/auth-context';
import { useToast } from '../../lib/toast-context';
import type { Coupon } from '../../lib/types';
import { formatDate, isExpired } from '../../lib/utils';
import { PageLoader } from '../../components/Spinner';

export default function CouponDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { show } = useToast();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    couponService.get(id).then((c) => {
      setCoupon(c);
      setLoading(false);
      if (c) couponService.incrementViews(id);
    });
    if (profile) savedCouponService.isSaved(profile.id, id!).then(setSaved);
  }, [id, profile]);

  const toggleSave = async () => {
    if (!profile) { navigate('/login'); return; }
    const now = await savedCouponService.toggle(profile.id, id!);
    setSaved(now);
    show(now ? 'Coupon saved!' : 'Removed from saved', 'success');
  };

  const copyCode = () => {
    if (!coupon?.coupon_code) return;
    navigator.clipboard.writeText(coupon.coupon_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    show('Code copied!', 'success');
  };

  if (loading) return <PageLoader />;
  if (!coupon) return <div className="container" style={{ padding: 40 }}><div className="empty-state"><h2>Coupon not found</h2><Link to="/offers" className="btn btn-primary mt-16">Browse offers</Link></div></div>;

  const expired = isExpired(coupon.expiry_date);

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 960 }}>
      <Link to="/offers" className="flex items-center gap-8 text-muted mb-16 text-sm"><ArrowLeft size={16} /> Back to offers</Link>
      <div className="grid grid-2" style={{ gap: 32 }}>
        <div
          className="card"
          style={{
            overflow: "hidden",
            borderRadius: 20,
            position: "relative"
          }}
        >

          <div
            style={{
              position: "relative"
            }}
          >

            <img
              src={coupon.flyer_image_url}
              alt={coupon.title}
              style={{
                width: "100%",
                height: 500,
                objectFit: "cover"
              }}
            />

            {/* Gradient */}

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,.45), transparent)"
              }}
            />

            {/* Discount */}

            <div
              style={{
                position: "absolute",
                top: 18,
                left: 18,
                background: "var(--primary)",
                color: "#fff",
                padding: "8px 18px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 14
              }}
            >
              {coupon.discount}
            </div>

            {/* Flash Sale */}

            {coupon.is_flash && (

              <div
                style={{
                  position: "absolute",
                  top: 64,
                  left: 18,
                  background: "#EF4444",
                  color: "#fff",
                  padding: "6px 14px",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 12
                }}
              >
                🔥 Flash Sale
              </div>

            )}

          </div>

          <div
            className="card-body"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >

            <div
              className="flex items-center gap-8"
            >
              <Eye size={18} />

              <span>
                {coupon.views} Views
              </span>
            </div>

            {expired && (
              <span className="badge badge-danger">
                Expired
              </span>
            )}

          </div>

        </div>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 24
            }}
          >

            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center"
              }}
            >

              {(coupon.company?.logo_url || coupon.logo_url) ? (

                <img
                  src={coupon.company?.logo_url || coupon.logo_url || undefined}
                  alt=""
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 14,
                    objectFit: "cover",
                    border: "1px solid #eee"
                  }}
                />

              ) : (

                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 14,
                    background: "#FFF8E8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Building2
                    size={28}
                    color="#D97706"
                  />
                </div>

              )}

              <div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}
                >

                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 22
                    }}
                  >
                    {coupon.company?.name}
                  </span>

                  <span
                    style={{
                      color: "#16A34A",
                      fontSize: 14
                    }}
                  >
                    ✔
                  </span>

                </div>

                <div
                  style={{
                    color: "#777",
                    marginTop: 4,
                    fontSize: 14
                  }}
                >
                  Trusted Brand
                </div>

              </div>

            </div>

            {coupon.category && (

              <div
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: "#FFF5DB",
                  color: "#C77D00",
                  fontWeight: 700,
                  fontSize: 13
                }}
              >
                {coupon.category.name}
              </div>

            )}

          </div>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 18
            }}
          >
            {coupon.title}
          </h1>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              borderRadius: 999,
              background: "#FFF5DB",
              color: "#D97706",
              fontWeight: 700,
              marginBottom: 18
            }}
          >
            🏷 {coupon.discount}

            <span
              style={{
                color: "#888",
                fontWeight: 500
              }}
            >
              Exclusive Coupon
            </span>
          </div>
          {coupon.retail_price !== undefined && coupon.retail_price !== null && (
            <div className="flex items-center gap-12 mt-16" style={{ fontSize: 20 }}>
              {coupon.discount_price !== undefined && coupon.discount_price !== null ? (
                <>
                  <span style={{ color: 'var(--primary-dark)', fontSize: 42, fontWeight: 800 }}>
                    ${Number(coupon.discount_price).toFixed(2)}
                  </span>
                  <span style={{
                    textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: 22,
                    marginTop: 10
                  }}>
                    ${Number(coupon.retail_price).toFixed(2)}
                  </span>
                  {Number(coupon.retail_price) > Number(coupon.discount_price) && (
                    <span className="badge badge-success" style={{
                      padding: "8px 18px",
                      borderRadius: 999,
                      background: "#E7F8EA",
                      color: "#1B8E3F",
                      fontWeight: 700
                    }}>
                      Save ${(Number(coupon.retail_price) - Number(coupon.discount_price)).toFixed(2)}
                    </span>
                  )}
                </>
              ) : (
                <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: 24 }}>
                  ${Number(coupon.retail_price).toFixed(2)}
                </span>
              )}
            </div>
          )}
          <p
            style={{
              marginTop: 18,
              color: "#666",
              lineHeight: 1.9,
              fontSize: 17
            }}
          >
            {coupon.description}
          </p>
          <div
            className="card"
            style={{
              marginTop: 24,
              padding: 24,
              borderRadius: 20,
              border: "2px dashed var(--primary)",
              background: "#FFFBEF"
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >

              <div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#B7791F",
                    fontWeight: 700
                  }}
                >
                  🎫 Verified Coupon
                </div>

                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    letterSpacing: 3,
                    marginTop: 12,
                    color: "var(--primary-dark)",
                    fontFamily: "monospace"
                  }}
                >
                  {coupon.coupon_code || "AUTO"}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    color: "#777",
                    fontSize: 13
                  }}
                >
                  Verified by FlyNow
                </div>

              </div>

              <button
                onClick={copyCode}
                className="btn btn-primary"
                style={{
                  minWidth: 170,
                  height: 48
                }}
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy Code
                  </>
                )}
              </button>

            </div>

          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 22
            }}
          >

            <div
              className="card"
              style={{
                flex: 1,
                padding: 18,
                borderRadius: 16
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12
                }}
              >

                <Calendar
                  size={22}
                  color="#D97706"
                />

                <div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "#777"
                    }}
                  >
                    Offer expires
                  </div>

                  <div
                    style={{
                      fontWeight: 700,
                      marginTop: 2
                    }}
                  >
                    {formatDate(coupon.expiry_date)}
                  </div>

                </div>

              </div>

            </div>

            <button
              onClick={toggleSave}
              className={`btn ${saved
                  ? "btn-primary"
                  : "btn-secondary"
                }`}
              style={{
                minWidth: 190,
                borderRadius: 16
              }}
            >

              <Bookmark
                size={18}
                fill={
                  saved
                    ? "currentColor"
                    : "none"
                }
              />

              {saved
                ? "Saved to Wallet"
                : "Save to Wallet"}

            </button>

          </div>

          {coupon.terms && (

            <div
              className="card"
              style={{
                marginTop: 28,
                padding: 24,
                borderRadius: 20
              }}
            >

              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 20,
                  fontSize: 22
                }}
              >

                <FileText size={22} />

                Terms & Conditions

              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14
                }}
              >

                {coupon.terms
                  .split("\n")
                  .filter(term => term.trim() !== "")
                  .map((term, index) => (

                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start"
                      }}
                    >

                      <div
                        style={{
                          color: "#16A34A",
                          fontWeight: 700,
                          marginTop: 2
                        }}
                      >

                        ✔

                      </div>

                      <div
                        style={{
                          lineHeight: 1.8,
                          color: "#555"
                        }}
                      >

                        {term}

                      </div>

                    </div>

                  ))}

              </div>

            </div>

          )}
          <div
            className="card"
            style={{
              marginTop: 24,
              padding: 24,
              borderRadius: 20,
              background: "#FFFBF2"
            }}
          >

            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
                fontSize: 22
              }}
            >

              🎯

              How to Redeem

            </h3>
            

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18
              }}
            >

              <div>1️⃣ Copy the coupon code.</div>

              <div>2️⃣ Visit the company's website or store.</div>

              <div>3️⃣ Apply the coupon during checkout.</div>

              <div>4️⃣ Complete your purchase and enjoy your savings 🎉.</div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
