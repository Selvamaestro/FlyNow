import "./Offers.css";

const OfferCard = ({ offer }) => {
  const hasImage = !!offer.image;

  // Extract discount percentage or text from flyer name, or default to a standard label
  const getDiscountLabel = (nameStr) => {
    if (!nameStr) return "OFFER";
    const match = nameStr.match(/(\d+%\s*OFF|\d+%\s*Discount|\d+%\s*|₹\d+\s*OFF)/i);
    if (match) {
      return match[0].trim();
    }
    // Fallback if name has numbers but no % or ₹ symbols
    const numMatch = nameStr.match(/(\d+)\s*(percent|rs|inr)/i);
    if (numMatch) return numMatch[0].trim();
    return "DEAL";
  };

  const discountVal = offer.discount || getDiscountLabel(offer.name || offer.title);
  const brandName = offer.companyName || offer.brand || "FlyNow Partner";
  const cardTitle = offer.name || offer.title || "Special Deal";
  const cardDesc = offer.category ? `Category: ${offer.category}` : (offer.description || "Grab this limited time promotion today!");
  const couponCode = offer.promoCode || offer.coupon || "FLYNOW";
  const validityText = offer.expiryDate ? `Expires: ${offer.expiryDate}` : (offer.validity || "Today Only");

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

        <div className="offer-footer">
          <small>{validityText}</small>
          <button style={{ color: "#1C1917", cursor: "pointer" }}>
            {offer.button || "Save Coupon"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;