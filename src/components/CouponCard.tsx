import { type Coupon } from "../lib/types";
import {
  Bookmark,
  Calendar,
  Eye,
  Tag,
  Building2,
  BadgeCheck,
  ChevronRight,
  Flame,
} from "lucide-react";
import {
  formatDate,
  daysUntil,
  isExpired,
} from "../lib/utils";

interface CouponCardProps {
  coupon: Coupon;
  saved?: boolean;
  onToggleSave?: () => void;
  onView?: () => void;
  showStatus?: boolean;
}

export default function CouponCard({
  coupon,
  saved = false,
  onToggleSave,
  onView,
  showStatus,
}: CouponCardProps) {



  const expired = isExpired(coupon.expiry_date);
  const days = daysUntil(coupon.expiry_date);

  const retailPrice =
    coupon.retail_price != null
      ? Number(coupon.retail_price)
      : null;

  const discountPrice =
    coupon.discount_price != null
      ? Number(coupon.discount_price)
      : null;

  const savings =
    retailPrice != null &&
    discountPrice != null
      ? retailPrice - discountPrice
      : 0;

  const percentage =
    retailPrice != null &&
    discountPrice != null
      ? Math.round(
          ((retailPrice - discountPrice) /
            retailPrice) *
            100
        )
      : null;

  const statusBadge =
    coupon.status === "approved" ? (
      <span className="badge badge-success">
        Approved
      </span>
    ) : coupon.status === "pending" ? (
      <span className="badge badge-warning">
        Pending
      </span>
    ) : (
      <span className="badge badge-danger">
        Rejected
      </span>
    );

  return (

<div
className="card card-hover"
style={{
borderRadius:22,
overflow:"hidden",
display:"flex",
flexDirection:"column",
background:"#fff",
boxShadow:
"0 12px 32px rgba(0,0,0,.08)",
transition:"all .35s ease",
height:"100%"
}}
>

{/* ================= IMAGE ================= */}

<div
onClick={onView}
style={{
position:"relative",
cursor:"pointer",
overflow:"hidden"
}}
>

<img
src={coupon.flyer_image_url}
alt={coupon.title}
style={{
width:"100%",
height:220,
objectFit:"cover",
transition:"transform .45s ease"
}}
/>

<div
style={{
position:"absolute",
inset:0,
background:
"linear-gradient(to top,rgba(0,0,0,.60),rgba(0,0,0,.08))"
}}
/>

{/* Discount Badge */}

<div
style={{
position:"absolute",
top:14,
left:14,
background:"var(--primary)",
color:"#fff",
padding:"7px 14px",
borderRadius:999,
fontSize:12,
fontWeight:700,
boxShadow:"0 4px 10px rgba(0,0,0,.18)"
}}
>
{coupon.discount || "SPECIAL OFFER"}
</div>

{/* Flash Sale */}

{coupon.is_flash && (

<div
style={{
position:"absolute",
top:58,
left:14,
background:"#EF4444",
color:"#fff",
padding:"6px 13px",
borderRadius:999,
display:"flex",
alignItems:"center",
gap:6,
fontSize:11,
fontWeight:700
}}
>

<Flame size={13}/>
Flash Sale

</div>

)}

{/* Wishlist */}

{onToggleSave && (

<button
onClick={(e)=>{
e.stopPropagation();
onToggleSave();
}}
style={{
position:"absolute",
top:14,
right:14,
width:42,
height:42,
borderRadius:"50%",
border:"none",
background:"rgba(255,255,255,.94)",
cursor:"pointer",
display:"flex",
alignItems:"center",
justifyContent:"center",
boxShadow:
"0 5px 14px rgba(0,0,0,.18)"
}}
>

<Bookmark
size={18}
fill={saved ? "currentColor" : "none"}
/>

</button>

)}

{/* Status */}

{showStatus && (

<div
style={{
position:"absolute",
bottom:14,
right:14
}}
>
{statusBadge}
</div>

)}

{/* Expired */}

{expired && (

<div
style={{
position:"absolute",
inset:0,
background:"rgba(0,0,0,.55)",
display:"flex",
alignItems:"center",
justifyContent:"center"
}}
>

<div
style={{
padding:"12px 26px",
background:"#DC2626",
color:"#fff",
fontWeight:700,
borderRadius:999
}}
>

Expired

</div>

</div>

)}

</div>

{/* ================= BODY ================= */}

<div
className="card-body"
style={{
display:"flex",
flexDirection:"column",
gap:18,
padding:22,
flex:1
}}
>

{/* Company */}

<div
style={{
display:"flex",
alignItems:"center",
gap:12
}}
>

{(coupon.company?.logo_url || coupon.logo_url) ? (

<img
src={coupon.company?.logo_url || coupon.logo_url || undefined}
alt=""
style={{
width:46,
height:46,
borderRadius:12,
objectFit:"cover",
border:"1px solid #eee"
}}
/>

) : (

<div
style={{
width:46,
height:46,
borderRadius:12,
background:"#FFF4D6",
display:"flex",
alignItems:"center",
justifyContent:"center"
}}
>

<Building2
size={22}
color="#F59E0B"
/>

</div>

)}

<div
style={{
flex:1
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:6
}}
>

<span
style={{
fontWeight:700,
fontSize:16
}}
>
{coupon.company?.name}
</span>

<BadgeCheck
size={15}
color="#10B981"
/>

</div>

<div
style={{
fontSize:12,
color:"#777"
}}
>

Trusted Brand

</div>

</div>

{coupon.category && (

<div
style={{
padding:"6px 12px",
background:"#FFF8E8",
borderRadius:999,
fontSize:11,
fontWeight:700,
color:"#C08400"
}}
>

{coupon.category.name}

</div>

)}

</div>

{/* Title */}

<h3
onClick={onView}
style={{
fontSize:20,
fontWeight:800,
lineHeight:1.4,
cursor:"pointer",
minHeight:58,
margin:0
}}
>

{coupon.title}

</h3>

{/* Description */}

<p
style={{
fontSize:14,
lineHeight:1.7,
color:"#666",
display:"-webkit-box",
WebkitLineClamp:2,
WebkitBoxOrient:"vertical",
overflow:"hidden",
margin:0
}}
>

{coupon.description}

</p>
{/* ================= PRICE SECTION ================= */}

<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  }}
>
  <div>
    {discountPrice !== null ? (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "var(--primary)",
            }}
          >
            ${discountPrice.toFixed(2)}
          </span>

          {retailPrice !== null && (
            <span
              style={{
                textDecoration: "line-through",
                color: "#888",
                fontSize: 15,
              }}
            >
              ${retailPrice.toFixed(2)}
            </span>
          )}
        </div>

        {savings > 0 && (
          <div
            style={{
              fontSize: 13,
              color: "#16A34A",
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            Save ${savings.toFixed(2)}
          </div>
        )}
      </>
    ) : (
      retailPrice !== null && (
        <span
          style={{
            fontSize: 28,
            fontWeight: 800,
          }}
        >
          ${retailPrice.toFixed(2)}
        </span>
      )
    )}
  </div>

  {percentage && percentage > 0 && (
    <div
      style={{
        width: 62,
        height: 62,
        borderRadius: "50%",
        background: "var(--primary)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,.15)",
      }}
    >
      <span
        style={{
          fontSize: 18,
          fontWeight: 800,
          lineHeight: 1,
        }}
      >
        {percentage}%
      </span>

      <span
        style={{
          fontSize: 10,
        }}
      >
        OFF
      </span>
    </div>
  )}
</div>

<div
  style={{
    marginTop: 10,
    padding: "12px 16px",
    borderRadius: 12,
    background: "#FFF8E8",
    border: "1px solid #F5D48A",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }}
>
  <div>
    <div
      style={{
        fontWeight: 700,
        color: "#B7791F",
      }}
    >
      Coupon available
    </div>

    <div
      style={{
        fontSize: 12,
        color: "#777",
      }}
    >
      View details to reveal the coupon code
    </div>
  </div>

  <Tag
    size={22}
    color="#D97706"
  />
</div>

{/* Footer */}

<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    fontSize: 13,
    color: "#666",
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 5,
    }}
  >
    <Calendar size={14} />
    {formatDate(coupon.expiry_date)}
  </div>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 5,
    }}
  >
    <Eye size={14} />
    {coupon.views}
  </div>
</div>

{!expired && days >= 0 && days <= 7 && (
  <div
    style={{
      marginTop: 6,
      alignSelf: "flex-start",
      padding: "6px 12px",
      background: "#FEF3C7",
      color: "#B45309",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
    }}
  >
    Ends in {days} day{days !== 1 ? "s" : ""}
  </div>
)}

{/* Buttons */}

<div
  style={{
    display: "flex",
    gap: 10,
    marginTop: "auto",
    paddingTop: 8,
  }}
>
  {onToggleSave && (
    <button
      onClick={onToggleSave}
      className={`btn ${
        saved ? "btn-primary" : "btn-secondary"
      }`}
      style={{
        minWidth: 56,
      }}
    >
      <Bookmark
        size={18}
        fill={saved ? "currentColor" : "none"}
      />
    </button>
  )}

  <button
    className="btn btn-primary"
    onClick={onView}
    style={{
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      fontWeight: 700,
      fontSize: 15,
      borderRadius: 12,
    }}
  >
    View Details

    <ChevronRight size={18} />
  </button>
</div>

</div>

</div>

);
}