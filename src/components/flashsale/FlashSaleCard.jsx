import { useState, useEffect } from "react";
import "./FlashSale.css";

const FlashSaleCard = ({ sale }) => {
  const [timeLeft, setTimeLeft] = useState("");

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

  return (
    <div className="flash-card">
      <div
        className="flash-top"
        style={{ background: sale.color || "#B91C1C" }}
      >
        <span>{sale.brand}</span>
        <div className="timer">
          ⏰ {timeLeft}
        </div>
      </div>

      <img src={sale.image} alt={sale.title} style={{ height: "160px", objectFit: "cover" }} />

      <div className="flash-body">
        <h3>{sale.title}</h3>
        <p>{sale.discount}</p>
        <h2>{sale.price || "₹999"}</h2>
        <button style={{ color: "#1C1917" }}>Shop Now</button>
      </div>
    </div>
  );
};

export default FlashSaleCard;