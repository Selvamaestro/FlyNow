import { useState, useEffect } from "react";
import "./FlashSale.css";

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

const FlashSaleCard = ({ sale }) => {
  const [timeLeft, setTimeLeft] = useState("");

  const loggedCompanyStr = localStorage.getItem("flynow_logged_in_company");
  const loggedCompany = loggedCompanyStr ? JSON.parse(loggedCompanyStr) : null;
  const isOwner = loggedCompany && (loggedCompany.name === sale.brand || loggedCompany.email === sale.companyEmail);

  useEffect(() => {
    let expiryTime = sale.expiresAt;
    
    if (!expiryTime) {
      const match = sale.timer ? sale.timer.match(/(\d+)h\s*:\s*(\d+)m\s*:\s*(\d+)s/) : null;
      if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = parseInt(match[3], 10);
        const durationMs = ((hours * 60 + minutes) * 60 + seconds) * 1000;
        
        expiryTime = Date.now() + durationMs;
      } else {
        expiryTime = Date.now() + 48 * 60 * 60 * 1000;
      }
    }

    const updateTimer = () => {
      const diff = expiryTime - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const totalSec = Math.floor(diff / 1000);
      const hrs = Math.floor(totalSec / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;

      const pad = (num) => String(num).padStart(2, "0");
      setTimeLeft(`${pad(hrs)}h : ${pad(mins)}m : ${pad(secs)}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [sale]);

  const handleDelete = (e) => {
    e.stopPropagation();
    const confirm = window.confirm(`Are you sure you want to delete "${sale.title}"?`);
    if (!confirm) return;

    const allSaved = localStorage.getItem("flynow_all_flash_sales");
    const allList = allSaved ? JSON.parse(allSaved) : [];
    const updatedAll = allList.filter((item) => item.id !== sale.id);
    localStorage.setItem("flynow_all_flash_sales", JSON.stringify(updatedAll));
    
    // Dispatch a manual storage event so the grid updates instantly
    window.dispatchEvent(new Event("storage"));
  };

  const priceInfo = getOfferPriceDetails(sale.actualPrice, sale.discount, sale.title);
  const displayPrice = priceInfo ? priceInfo.offer : (sale.price || "₹999");
  const originalPrice = priceInfo ? priceInfo.original : null;

  return (
    <div className="flash-card">
      <div
        className="flash-top"
        style={{ background: sale.color || "#B91C1C" }}
      >
        <span>{sale.brand}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="timer">
            ⏰ {timeLeft}
          </div>
          {isOwner && (
            <button
              onClick={handleDelete}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#FFF',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <img src={sale.image} alt={sale.title} style={{ height: "160px", objectFit: "cover" }} />

      <div className="flash-body">
        <h3>{sale.title}</h3>
        <p>{sale.discount}</p>
        <h2 style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          {displayPrice}
          {originalPrice && (
            <span style={{ textDecoration: "line-through", fontSize: "14px", color: "#888", fontWeight: "normal" }}>
              {originalPrice}
            </span>
          )}
        </h2>
        <button style={{ color: "#1C1917" }}>Shop Now</button>
      </div>
    </div>
  );
};

export default FlashSaleCard;