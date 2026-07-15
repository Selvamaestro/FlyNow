import "./Offers.css";

const getOfferPriceDetails = (actualPrice, discountText, titleText) => {
  if (!actualPrice) return null;
  
  const priceNum = parseFloat(String(actualPrice).replace(/[^0-9.]/g, ""));
  if (isNaN(priceNum)) return null;

  let pct = 0;
  const pctMatch = (discountText + " " + titleText).match(/(\d+)\s*%/);
  if (pctMatch) {
    pct = parseFloat(pctMatch[1]);
  } else {
    const flatMatch = (discountText + " " + titleText).match(/(?:₹|rs\.?|inr)?\s*(\d+)\s*(?:off|discount)/i);
    if (flatMatch) {
      const flatAmt = parseFloat(flatMatch[1]);
      const offerAmt = Math.max(0, Math.round(priceNum - flatAmt));
      return {
        original: `₹${Math.round(priceNum).toLocaleString()}`,
        offer: `₹${offerAmt.toLocaleString()}`
      };
    }
  }

  const discountAmt = (priceNum * pct) / 100;
  const offerAmt = Math.round(priceNum - discountAmt);

  return {
    original: `₹${Math.round(priceNum).toLocaleString()}`,
    offer: `₹${offerAmt.toLocaleString()}`
  };
};

const OfferCard = ({ offer }) => {
  const hasImage = !!offer.image;

  const getDiscountLabel = (nameStr) => {
    if (!nameStr) return "OFFER";
    const match = nameStr.match(/(\d+%\s*OFF|\d+%\s*Discount|\d+%\s*|₹\d+\s*OFF)/i);
    if (match) {
      return match[0].trim();
    }
    const numMatch = nameStr.match(/(\d+)\s*(percent|rs|inr)/i);
    if (numMatch) return numMatch[0].trim();
    return "DEAL";
  };

  const discountVal = offer.discount || getDiscountLabel(offer.name || offer.title);
  const brandName = offer.companyName || offer.brand || "FlyNow Partner";
  const cardTitle = offer.name || offer.title || "Special Deal";
  const cardDesc = offer.category ? `Category: ${offer.category}` : (offer.description || "Grab this limited time promotion today!");
  const couponCode = offer.promoCode || offer.coupon || "FLYNOW";
  
  // Format datetime-local strings nicely if present
  const formatExpiryDateStr = (dateStr) => {
    if (!dateStr) return "Today Only";
    if (dateStr.includes("T")) {
      const d = new Date(dateStr);
      if (!isNaN(d)) {
        return "Expires: " + d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " at " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
    return `Expires: ${dateStr}`;
  };

  const validityText = offer.expiryDate ? formatExpiryDateStr(offer.expiryDate) : (offer.validity || "Today Only");

  const priceInfo = getOfferPriceDetails(offer.actualPrice, discountVal, cardTitle);
  const displayPrice = priceInfo ? priceInfo.offer : null;
  const originalPrice = priceInfo ? priceInfo.original : null;

  return (
    <div className="offer-card">
      {hasImage ? (
        <div className="offer-top-image-container">
          <img src={offer.image} alt={brandName} className="offer-top-image" />
          <div className="offer-image-overlay">
            <span className="brand">{brandName}</span>
            <span className="discount">{discountVal}</span>
          </div>
        </div>
      ) : (
        <div
          className="offer-top"
          style={{
            background: `linear-gradient(135deg, ${
              offer.gradient?.[0] || "#F4B000"
            }, ${offer.gradient?.[1] || "#FFC72C"})`
          }}
        >
          <span className="brand">{brandName}</span>
          <span className="discount">{discountVal}</span>
        </div>
      )}

      <div className="offer-body">
        <h3>{cardTitle}</h3>
        <p>{cardDesc}</p>

        <div className="coupon-code">
          {couponCode}
        </div>

        <div className="offer-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <small>{validityText}</small>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {priceInfo && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: '1.2' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#1C1917' }}>{displayPrice}</span>
                <span style={{ fontSize: '12px', textDecoration: 'line-through', color: '#78716C' }}>{originalPrice}</span>
              </div>
            )}
            <button style={{ color: "#1C1917", cursor: "pointer" }}>
              {offer.button || "Save Coupon"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;