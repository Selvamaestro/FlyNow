import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Wallet, TrendingUp, Clock } from "lucide-react";
import QRCode from "react-qr-code";
import { useAuth } from "../../lib/auth-context";
import { savedCouponService } from "../../lib/services";
import type { SavedCoupon } from "../../lib/types";
import { supabase } from "../../lib/supabase";
export default function WalletPage() {
    const { profile } = useAuth();

    const [savedCoupons, setSavedCoupons] = useState<SavedCoupon[]>([]);
    type UserReward = {
        id: string;
        reward_type: string;
        reward_name: string;
        reward_points: number;
        created_at: string;
    };

    const [rewards, setRewards] = useState<UserReward[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedCoupon, setSelectedCoupon] = useState<SavedCoupon | null>(null);
    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [sortBy, setSortBy] = useState("Newest");
    useEffect(() => {
        if (!profile) return;

        async function loadWallet() {
            try {
                setLoading(true);

                const data = await savedCouponService.list(profile.id);

                setSavedCoupons(data);
                const { data: rewardData } = await supabase
                    .from("user_rewards")
                    .select("*")
                    .eq("user_id", profile.id)
                    .order("created_at", { ascending: false });

                setRewards(rewardData || []);
            } finally {
                setLoading(false);
            }
        }

        loadWallet();
    }, [profile]);

    // Categories

    const categories = useMemo(() => {
        const set = new Set<string>();

        savedCoupons.forEach((item) => {
            if (item.coupon?.category?.name) {
                set.add(item.coupon.category.name);
            }
        });

        return ["All", ...Array.from(set)];
    }, [savedCoupons]);

    // Filter Wallet

    const filteredCoupons = useMemo(() => {
        return savedCoupons.filter((item) => {
            const coupon = item.coupon;

            if (!coupon) return false;

            const matchesSearch =
                coupon.title.toLowerCase().includes(search.toLowerCase()) ||
                coupon.company?.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesCategory =
                selectedCategory === "All" ||
                coupon.category?.name === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [savedCoupons, search, selectedCategory]);

    // Total Savings

    const totalSavings = useMemo(() => {
        return filteredCoupons.reduce((total, item) => {
            const coupon = item.coupon;

            if (!coupon) return total;

            return (
                total +
                ((coupon.retail_price ?? 0) -
                    (coupon.discount_price ?? 0))
            );
        }, 0);
    }, [filteredCoupons]);

    // Expiring Soon

    const expiringSoon = useMemo(() => {
        const today = new Date();

        return filteredCoupons.filter((item) => {
            if (!item.coupon?.expiry_date) return false;

            const expiry = new Date(item.coupon.expiry_date);

            const diff =
                (expiry.getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24);

            return diff >= 0 && diff <= 7;
        }).length;
    }, [filteredCoupons]);

    if (loading) {
        return (
            <div
                className="container"
                style={{
                    padding: "80px",
                    textAlign: "center",
                }}
            >
                <h2>Loading Wallet...</h2>
            </div>
        );
    }
    const sortedCoupons = [...filteredCoupons];

    if (sortBy === "Highest Savings") {
        sortedCoupons.sort((a, b) => {
            const saveA =
                (a.coupon.retail_price ?? 0) -
                (a.coupon.discount_price ?? 0);

            const saveB =
                (b.coupon.retail_price ?? 0) -
                (b.coupon.discount_price ?? 0);

            return saveB - saveA;
        });
    }

    if (sortBy === "Expiring Soon") {
        sortedCoupons.sort(
            (a, b) =>
                new Date(a.coupon.expiry_date).getTime() -
                new Date(b.coupon.expiry_date).getTime()
        );
    }
    const activeCoupons = sortedCoupons.filter(
        (item) => !item.redeemed
    );

    const redeemedCoupons = sortedCoupons.filter(
        (item) => item.redeemed
    );
    const brandThemes: Record<
        string,
        {
            primary: string;
            secondary: string;
            text: string;
        }
    > = {
        Amazon: {
            primary: "#FF9900",
            secondary: "#FFC266",
            text: "#ffffff",
        },

        Flipkart: {
            primary: "#2874F0",
            secondary: "#6FA8FF",
            text: "#ffffff",
        },

        Myntra: {
            primary: "#FF3F6C",
            secondary: "#FF6B8D",
            text: "#ffffff",
        },

        Samsung: {
            primary: "#1428A0",
            secondary: "#4E73DF",
            text: "#ffffff",
        },

        Nike: {
            primary: "#111111",
            secondary: "#444444",
            text: "#ffffff",
        },

        Zomato: {
            primary: "#E23744",
            secondary: "#FF6B81",
            text: "#ffffff",
        },

        Swiggy: {
            primary: "#FC8019",
            secondary: "#FDBA74",
            text: "#ffffff",
        },

        default: {
            primary: "#F59E0B",
            secondary: "#FBBF24",
            text: "#ffffff",
        },
    };
    const theme =
        brandThemes[selectedCoupon?.coupon.company?.name ?? ""] ??
        brandThemes.default;
    const handleShareCoupon = async (coupon: SavedCoupon["coupon"]) => {
        if (!coupon) return;

        const shareText = `
🎉 ${coupon.title}

🏢 ${coupon.company?.name}

💸 ${coupon.discount}

🏷 Coupon Code: ${coupon.coupon_code}

⏳ Valid Until:
${new Date(coupon.expiry_date).toLocaleDateString()}

Check it out on FlyNow!
`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: coupon.title,
                    text: shareText,
                });
            } else {
                await navigator.clipboard.writeText(shareText);
                alert("Coupon details copied to clipboard!");
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div
            className="container"
            style={{
                maxWidth: 1400,
                padding: "40px 24px",
            }}
        >
            {/* Header */}

            <div
                style={{
                    marginBottom: 45,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 18,
                    }}
                >
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: 20,
                            background:
                                "linear-gradient(135deg,#F59E0B,#FBBF24)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: 34,
                            boxShadow: "0 15px 35px rgba(245,158,11,.25)",
                        }}
                    >
                        💳
                    </div>

                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: 46,
                                fontWeight: 900,
                            }}
                        >
                            My Wallet
                        </h1>

                        <p
                            style={{
                                marginTop: 6,
                                color: "#6B7280",
                                fontSize: 17,
                            }}
                        >
                            Save, manage and redeem all your coupons from one place.
                        </p>
                    </div>
                </div>
            </div>

            {/* Wallet Stats */}

            <div
                className="grid"
                style={{
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 24,
                    marginBottom: 35,
                }}
            >
                <div
                    className="card"
                    style={{
                        padding: 24,
                        borderRadius: 24,
                        background:
                            "linear-gradient(135deg,#FFF8E8,#FFFDF7)",
                        border: "1px solid #FFE3A3",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                width: 62,
                                height: 62,
                                borderRadius: 18,
                                background: "#FFF4D6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 30,
                            }}
                        >
                            💳
                        </div>

                        <span
                            style={{
                                color: "#F59E0B",
                                fontSize: 24,
                            }}
                        >
                            🔖
                        </span>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div style={{ color: "#666" }}>
                            Saved Coupons
                        </div>

                        <h2
                            style={{
                                margin: "8px 0 4px",
                                fontSize: 42,
                            }}
                        >
                            {activeCoupons.length}
                        </h2>

                        <div style={{ color: "#999" }}>
                            Active coupons saved
                        </div>
                    </div>
                </div>
                <div
                    className="card"
                    style={{
                        padding: 24,
                        borderRadius: 24,
                        background:
                            "linear-gradient(135deg,#ECFDF5,#F8FFF9)",
                        border: "1px solid #BBF7D0",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                width: 62,
                                height: 62,
                                borderRadius: 18,
                                background: "#DCFCE7",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 30,
                            }}
                        >
                            📈
                        </div>

                        <span
                            style={{
                                color: "#22C55E",
                                fontSize: 30,
                            }}
                        >
                            ₹
                        </span>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div
                            style={{
                                color: "#666",
                                fontSize: 16,
                            }}
                        >
                            Estimated Savings
                        </div>

                        <h2
                            style={{
                                margin: "8px 0 4px",
                                fontSize: 42,
                                fontWeight: 800,
                            }}
                        >
                            ₹{totalSavings}
                        </h2>

                        <div
                            style={{
                                color: "#999",
                            }}
                        >
                            Total savings with active coupons
                        </div>
                    </div>
                </div>
                <div
                    className="card"
                    style={{
                        padding: 24,
                        borderRadius: 24,
                        background:
                            "linear-gradient(135deg,#F4F1FF,#FCFBFF)",
                        border: "1px solid #DDD6FE",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                width: 70,
                                height: 70,
                                borderRadius: 20,
                                background: "linear-gradient(135deg,#FBBF24,#F59E0B)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 34,
                            }}
                        >
                            🎁
                        </div>

                        <span
                            style={{
                                color: "#8B5CF6",
                                fontSize: 30,
                            }}
                        >
                            ⭐
                        </span>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div
                            style={{
                                color: "#666",
                                fontSize: 16,
                            }}
                        >
                            Rewards Earned
                        </div>

                        <h2
                            style={{
                                margin: "8px 0 4px",
                                fontSize: 42,
                                fontWeight: 800,
                            }}
                        >
                            {rewards.length}
                        </h2>

                        <div
                            style={{
                                color: "#999",
                            }}
                        >
                            From games & activities
                        </div>
                    </div>
                </div>
            </div>

            {/* Search + Filters */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr",
                    gap: 20,
                    marginBottom: 40,
                }}
            >
                {/* Search */}

                <div
                    style={{
                        position: "relative",
                    }}
                >
                    <Search
                        size={20}
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: 18,
                            transform: "translateY(-50%)",
                            color: "#9CA3AF",
                        }}
                    />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search coupons in your wallet..."
                        style={{
                            width: "100%",
                            height: 58,
                            paddingLeft: 50,
                            borderRadius: 18,
                            border: "1px solid #E5E7EB",
                            background: "#fff",
                            fontSize: 15,
                        }}
                    />
                </div>

                {/* Category */}

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                        height: 58,
                        borderRadius: 18,
                        border: "1px solid #E5E7EB",
                        padding: "0 18px",
                        fontSize: 15,
                        background: "#fff",
                    }}
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                {/* Sort */}

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                        height: 58,
                        borderRadius: 18,
                        border: "1px solid #E5E7EB",
                        padding: "0 18px",
                        fontSize: 15,
                        background: "#fff",
                    }}
                >
                    <option>Newest</option>
                    <option>Expiring Soon</option>
                    <option>Highest Savings</option>
                </select>
            </div>

            {/* Empty Wallet */}

            {filteredCoupons.length === 0 && (
                <div
                    className="card"
                    style={{
                        padding: 80,
                        textAlign: "center",
                        borderRadius: 24,
                    }}
                >
                    <div style={{ fontSize: 70 }}>
                        💳
                    </div>

                    <h2>Your Wallet is Empty</h2>

                    <p
                        style={{
                            color: "#777",
                            marginTop: 12,
                        }}
                    >
                        Save coupons from the Offers page.
                    </p>

                    <Link
                        to="/offers"
                        className="btn btn-primary"
                        style={{
                            marginTop: 24,
                            display: "inline-block",
                        }}
                    >
                        Browse Offers
                    </Link>
                </div>
            )}

            {filteredCoupons.length > 0 && (
                <div
                    className="grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: 24,
                        marginBottom: 40,
                    }}
                >
                    {activeCoupons.map((item) => {
                        const coupon = item.coupon;

                        if (!coupon) return null;

                        const savings =
                            (coupon.retail_price ?? 0) -
                            (coupon.discount_price ?? 0);

                        const expiry = new Date(coupon.expiry_date);

                        return (
                            <div
                                key={item.id}
                                className="card"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "100%",
                                    overflow: "hidden",
                                    borderRadius: 24,
                                    border: "1px solid #ECECEC",
                                    background: "#fff",
                                    transition: ".25s",
                                }}
                            >
                                {/* Flyer */}

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
                                        padding: 24,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 14,
                                    }}
                                >
                                    {/* Company */}

                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                        }}
                                    >
                                        <img
                                            src={coupon.company?.logo_url}
                                            alt=""
                                            style={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: "50%",
                                            }}
                                        />

                                        <div>
                                            <div
                                                style={{
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {coupon.company?.name}
                                            </div>

                                            <div
                                                style={{
                                                    color: "#888",
                                                    fontSize: 13,
                                                }}
                                            >
                                                {coupon.category?.name}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Title */}

                                    <h3
                                        style={{
                                            marginTop: 18,
                                            marginBottom: 14,
                                            fontWeight: 800,
                                        }}
                                    >
                                        {coupon.title}
                                    </h3>

                                    {/* Price */}

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 10,
                                            alignItems: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontWeight: 800,
                                                color: "var(--primary)",
                                                fontSize: 20,
                                            }}
                                        >
                                            ₹{coupon.discount_price}
                                        </span>

                                        <span
                                            style={{
                                                textDecoration: "line-through",
                                                color: "#888",
                                            }}
                                        >
                                            ₹{coupon.retail_price}
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            marginTop: 8,
                                            color: "#16A34A",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Save ₹{savings}
                                    </div>

                                    {/* Expiry */}

                                    <div
                                        style={{
                                            marginTop: 18,
                                            fontSize: 14,
                                            color: "#666",
                                        }}
                                    >
                                        Expires:
                                        {" "}
                                        {expiry.toLocaleDateString()}
                                    </div>

                                    {/* Status */}

                                    <div
                                        style={{
                                            marginTop: 12,
                                        }}
                                    >
                                        {(() => {
                                            const today = new Date();
                                            const expiry = new Date(coupon.expiry_date);

                                            const daysLeft = Math.ceil(
                                                (expiry.getTime() - today.getTime()) /
                                                (1000 * 60 * 60 * 24)
                                            );

                                            let bg = "#DCFCE7";
                                            let color = "#166534";
                                            let text = "🟢 Active";

                                            if (item.redeemed) {
                                                bg = "#DBEAFE";
                                                color = "#1D4ED8";
                                                text = "✅ Redeemed";
                                            } else if (daysLeft < 0) {
                                                bg = "#FEE2E2";
                                                color = "#991B1B";
                                                text = "🔴 Expired";
                                            } else if (daysLeft <= 7) {
                                                bg = "#FEF3C7";
                                                color = "#92400E";
                                                text = "🟡 Expiring Soon";
                                            }

                                            return (
                                                <span
                                                    style={{
                                                        background: bg,
                                                        color,
                                                        padding: "6px 12px",
                                                        borderRadius: 999,
                                                        fontWeight: 700,
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    {text}
                                                </span>
                                            );
                                        })()}
                                    </div>

                                    {/* Buttons */}

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 10,
                                            marginTop: 24,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                flexWrap: "wrap",
                                                gap: 12,
                                                marginTop: 25,
                                            }}
                                        >
                                            <button
                                                className="btn btn-primary"
                                                disabled={item.redeemed}
                                                onClick={() => {
                                                    if (item.redeemed) return;

                                                    setSelectedCoupon(item);
                                                    setShowRedeemModal(true);
                                                }}
                                            >
                                                {item.redeemed ? "Redeemed" : "Redeem"}
                                            </button>
                                            <button
                                                className="btn btn-secondary"
                                                style={{ flex: 1 }}
                                                onClick={() => handleShareCoupon(coupon)}
                                            >
                                                Share
                                            </button>

                                            <button
                                                className="btn btn-secondary"
                                                onClick={() =>
                                                    navigator.clipboard.writeText(
                                                        coupon.coupon_code
                                                    )
                                                }
                                            >
                                                Copy
                                            </button>

                                            <button
                                                className="btn btn-secondary"
                                                style={{
                                                    color: "#DC2626",
                                                }}
                                                onClick={async () => {
                                                    if (!profile) return;

                                                    await savedCouponService.toggle(
                                                        profile.id,
                                                        coupon.id
                                                    );

                                                    setSavedCoupons((prev) =>
                                                        prev.filter((x) => x.id !== item.id)
                                                    );
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}
            {rewards.length > 0 && (
                <>
                    <div
                        style={{
                            marginTop: 70,
                            marginBottom: 30,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: 32,
                                    fontWeight: 800,
                                }}
                            >
                                🎁 Reward Wallet
                            </h2>

                            <p
                                style={{
                                    marginTop: 8,
                                    color: "#6B7280",
                                }}
                            >
                                Rewards you've collected from games and activities.
                            </p>
                        </div>

                        <div
                            style={{
                                background: "#FEF3C7",
                                color: "#92400E",
                                padding: "10px 18px",
                                borderRadius: 999,
                                fontWeight: 700,
                            }}
                        >
                            {rewards.length} Rewards
                        </div>
                    </div>

                    <div
                        className="grid"
                        style={{
                            gridTemplateColumns:
                                "repeat(auto-fill,minmax(340px,1fr))",
                            gap: 24,
                            marginBottom: 50,
                        }}
                    >
                        {rewards.map((reward) => {
                            const isPoints = reward.reward_points > 0;

                            let icon = "🎁";

                            if (
                                reward.reward_type
                                    .toLowerCase()
                                    .includes("daily")
                            )
                                icon = "📅";

                            if (
                                reward.reward_type
                                    .toLowerCase()
                                    .includes("scratch")
                            )
                                icon = "🎫";

                            if (
                                reward.reward_type
                                    .toLowerCase()
                                    .includes("spin")
                            )
                                icon = "🎡";

                            return (
                                <div
                                    key={reward.id}
                                    className="card"
                                    style={{
                                        padding: 26,
                                        borderRadius: 24,
                                        background: "#fff",
                                        border: "1px solid #ECECEC",
                                        boxShadow:
                                            "0 8px 20px rgba(0,0,0,.05)",
                                        transition: ".3s",
                                    }}
                                >
                                    {/* Top */}

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 68,
                                                height: 68,
                                                borderRadius: 20,
                                                background:
                                                    "linear-gradient(135deg,#FBBF24,#F59E0B)",
                                                display: "flex",
                                                justifyContent:
                                                    "center",
                                                alignItems: "center",
                                                fontSize: 32,
                                            }}
                                        >
                                            {icon}
                                        </div>

                                        <span
                                            style={{
                                                background: "#DCFCE7",
                                                color: "#166534",
                                                padding:
                                                    "6px 14px",
                                                borderRadius: 999,
                                                fontWeight: 700,
                                                fontSize: 13,
                                            }}
                                        >
                                            ✓ Claimed
                                        </span>
                                    </div>

                                    {/* Title */}

                                    <h3
                                        style={{
                                            marginTop: 22,
                                            marginBottom: 8,
                                            fontSize: 24,
                                            fontWeight: 800,
                                        }}
                                    >
                                        {reward.reward_type}
                                    </h3>

                                    <p
                                        style={{
                                            color: "#6B7280",
                                            minHeight: 45,
                                        }}
                                    >
                                        {reward.reward_name}
                                    </p>

                                    {/* Reward */}

                                    {isPoints ? (
                                        <div
                                            style={{
                                                marginTop: 20,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    color: "#F59E0B",
                                                    fontSize: 36,
                                                    fontWeight: 800,
                                                }}
                                            >
                                                +{reward.reward_points}
                                            </div>

                                            <div
                                                style={{
                                                    color: "#888",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Reward Points
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                marginTop: 20,
                                                padding: 16,
                                                borderRadius: 16,
                                                background: "#ECFDF5",
                                                color: "#166534",
                                                fontWeight: 700,
                                                fontSize: 17,
                                            }}
                                        >
                                            🎁 Coupon Reward
                                        </div>
                                    )}

                                    {/* Footer */}

                                    <div
                                        style={{
                                            marginTop: 26,
                                            paddingTop: 18,
                                            borderTop:
                                                "1px solid #F3F4F6",
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: "#9CA3AF",
                                                fontSize: 14,
                                            }}
                                        >
                                            {new Date(
                                                reward.created_at
                                            ).toLocaleDateString()}
                                        </span>

                                        <span
                                            style={{
                                                color: "#10B981",
                                                fontWeight: 700,
                                                fontSize: 14,
                                            }}
                                        >
                                            Collected
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
            {redeemedCoupons.length > 0 && (
                <>
                    <div
                        style={{
                            marginTop: 60,
                            marginBottom: 25,
                        }}
                    >
                        <h2
                            style={{
                                fontSize: 30,
                                fontWeight: 800,
                            }}
                        >
                            ✅ Redeemed Coupons
                        </h2>

                        <p
                            style={{
                                color: "#777",
                            }}
                        >
                            Coupons you've already redeemed.
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 18,
                        }}
                    >
                        {redeemedCoupons.map((item) => {
                            const coupon = item.coupon;

                            if (!coupon) return null;

                            return (
                                <div
                                    key={item.id}
                                    className="card"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "22px 28px",
                                        borderRadius: 22,
                                        background: "#F9FAFB",
                                        border: "1px solid #E5E7EB",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 18,
                                            flex: 1,
                                        }}
                                    >
                                        <img
                                            src={coupon.company?.logo_url}
                                            alt={coupon.company?.name}
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 16,
                                                objectFit: "cover",
                                                border: "1px solid #E5E7EB",
                                            }}
                                        />

                                        <div>
                                            <h3
                                                style={{
                                                    margin: 0,
                                                    fontSize: 20,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {coupon.title}
                                            </h3>

                                            <div
                                                style={{
                                                    color: "#6B7280",
                                                    marginTop: 6,
                                                }}
                                            >
                                                {coupon.company?.name}
                                            </div>

                                            <div
                                                style={{
                                                    marginTop: 8,
                                                    fontSize: 14,
                                                    color: "#9CA3AF",
                                                }}
                                            >
                                                Redeemed on{" "}
                                                {item.redeemed_at
                                                    ? new Date(item.redeemed_at).toLocaleDateString()
                                                    : "-"}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            textAlign: "right",
                                        }}
                                    >
                                        <div
                                            style={{
                                                color: "#16A34A",
                                                fontWeight: 800,
                                                fontSize: 22,
                                            }}
                                        >
                                            ₹
                                            {(coupon.retail_price ?? 0) -
                                                (coupon.discount_price ?? 0)}
                                        </div>

                                        <div
                                            style={{
                                                marginTop: 8,
                                                display: "inline-block",
                                                background: "#DCFCE7",
                                                color: "#166534",
                                                padding: "6px 14px",
                                                borderRadius: 999,
                                                fontWeight: 700,
                                                fontSize: 13,
                                            }}
                                        >
                                            ✓ Redeemed
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
            {showRedeemModal && selectedCoupon && (
                <>
                    {/* Background */}

                    <div
                        onClick={() => setShowRedeemModal(false)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,.55)",
                            backdropFilter: "blur(4px)",
                            animation: "fadeIn .25s ease",
                            zIndex: 1000,
                        }}
                    />

                    {/* Modal */}

                    <div
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%,-50%) scale(1)",
                            width: 430,
                            maxWidth: "95%",
                            background: "#fff",
                            borderRadius: 24,
                            padding: 30,
                            zIndex: 1001,
                            boxShadow: "0 25px 70px rgba(0,0,0,.30)",
                            overflow: "hidden",
                            animation: "couponPop .35s ease",
                        }}
                    >
                        {/* Left Ticket Cut */}
                        <div
                            style={{
                                position: "absolute",
                                width: 28,
                                height: 28,
                                background: "#F3F4F6",
                                borderRadius: "50%",
                                left: -14,
                                top: "50%",
                                transform: "translateY(-50%)",
                            }}
                        />

                        {/* Right Ticket Cut */}
                        <div
                            style={{
                                position: "absolute",
                                width: 28,
                                height: 28,
                                background: "#F3F4F6",
                                borderRadius: "50%",
                                right: -14,
                                top: "50%",
                                transform: "translateY(-50%)",
                            }}
                        />
                        {/* FlyNow Header */}

                        <div
                            style={{
                                background: `linear-gradient(135deg,${theme.primary},${theme.secondary})`,
                                color: theme.text,
                                borderRadius: 18,
                                padding: "20px",
                                marginBottom: 24,
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 14,
                                    letterSpacing: 3,
                                    fontWeight: 700,
                                    opacity: 0.9,
                                }}
                            >
                                FLYNOW
                            </div>

                            <h2
                                style={{
                                    margin: "10px 0 6px",
                                    fontSize: 28,
                                    fontWeight: 800,
                                }}
                            >
                                🎉 {selectedCoupon.coupon.discount}
                            </h2>

                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 15,
                                    opacity: 0.95,
                                }}
                            >
                                Exclusive Coupon
                            </p>
                        </div>

                        {/* Company */}

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                                marginBottom: 26,
                            }}
                        >
                            <img
                                src={selectedCoupon.coupon.company?.logo_url}
                                alt=""
                                style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: 16,
                                    objectFit: "cover",
                                    border: "1px solid #eee",
                                }}
                            />

                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        fontSize: 22,
                                        fontWeight: 800,
                                    }}
                                >
                                    {selectedCoupon.coupon.company?.name}
                                </div>

                                <div
                                    style={{
                                        color: "#777",
                                        marginTop: 4,
                                    }}
                                >
                                    {selectedCoupon.coupon.title}
                                </div>

                                <div
                                    style={{
                                        marginTop: 10,
                                        display: "inline-block",
                                        background: "#DCFCE7",
                                        color: "#166534",
                                        padding: "5px 12px",
                                        borderRadius: 999,
                                        fontWeight: 700,
                                        fontSize: 13,
                                    }}
                                >
                                    ✓ Verified Offer
                                </div>
                            </div>
                        </div>

                        {/* QR */}

                        <div
                            style={{
                                background: "#fff",
                                padding: 18,
                                display: "flex",
                                justifyContent: "center",
                                border: "1px solid #eee",
                                borderRadius: 18,
                            }}
                        >
                            <QRCode
                                value={selectedCoupon.coupon.coupon_code}
                                size={180}
                            />
                        </div>
                        <div
                            style={{
                                borderTop: "2px dashed #E5E7EB",
                                margin: "28px 0",
                            }}
                        />

                        {/* Coupon Code */}

                        <div
                            style={{
                                marginTop: 24,
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    color: "#777",
                                    fontSize: 14,
                                }}
                            >
                                Coupon Code
                            </div>

                            <div
                                style={{
                                    fontSize: 28,
                                    fontWeight: 800,
                                    letterSpacing: 2,
                                    marginTop: 8,
                                }}
                            >
                                {selectedCoupon.coupon.coupon_code}
                            </div>
                        </div>

                        {/* Expiry */}

                        <div
                            style={{
                                marginTop: 22,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "14px 18px",
                                borderRadius: 14,
                                background: "#F9FAFB",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontSize: 13,
                                        color: "#888",
                                    }}
                                >
                                    Savings
                                </div>

                                <div
                                    style={{
                                        fontWeight: 800,
                                        color: "#16A34A",
                                        fontSize: 20,
                                    }}
                                >
                                    ₹
                                    {(selectedCoupon.coupon.retail_price ?? 0) -
                                        (selectedCoupon.coupon.discount_price ?? 0)}
                                </div>
                            </div>

                            <div style={{ textAlign: "right" }}>
                                <div
                                    style={{
                                        fontSize: 13,
                                        color: "#888",
                                    }}
                                >
                                    Valid Until
                                </div>

                                <div
                                    style={{
                                        fontWeight: 700,
                                        color: "#EF4444",
                                    }}
                                >
                                    {new Date(
                                        selectedCoupon.coupon.expiry_date
                                    ).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}

                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                                marginTop: 30,
                            }}
                        >
                            <button
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                                onClick={() => {

                                    navigator.clipboard.writeText(
                                        selectedCoupon.coupon.coupon_code
                                    );

                                    alert("Coupon copied successfully!");
                                }}
                            >
                                Copy Code
                            </button>

                            <button
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                onClick={async () => {
                                    if (!selectedCoupon) return;

                                    try {
                                        await savedCouponService.redeem(selectedCoupon.id);

                                        setSavedCoupons((prev) =>
                                            prev.map((item) =>
                                                item.id === selectedCoupon.id
                                                    ? {
                                                        ...item,
                                                        redeemed: true,
                                                        redeemed_at: new Date().toISOString(),
                                                    }
                                                    : item
                                            )
                                        );

                                        setShowRedeemModal(false);
                                        setSelectedCoupon(null);

                                        alert("Coupon redeemed successfully!");
                                    } catch (error) {
                                        console.error(error);
                                        alert("Failed to redeem coupon.");
                                    }
                                }}
                            >
                                Done
                            </button>
                        </div>
                        <style>
                            {`
    @keyframes couponPop {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
      }

      60% {
        transform: translate(-50%, -50%) scale(1.03);
      }

      100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
      @keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
  `}
                        </style>
                    </div>
                </>
            )}
        </div>
    );
}
