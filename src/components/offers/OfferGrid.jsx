import { useState, useEffect } from "react";
import "./Offers.css";
import OfferCard from "./OfferCard";

const OfferGrid = () => {
  const [flyers, setFlyers] = useState([]);

  useEffect(() => {
    const loadFlyers = () => {
      const allSaved = localStorage.getItem("flynow_all_flyers");
      if (allSaved) {
        setFlyers(JSON.parse(allSaved));
      } else {
        localStorage.setItem("flynow_all_flyers", JSON.stringify([]));
        setFlyers([]);
      }
    };

    loadFlyers();

    const handleStorageChange = (e) => {
      if (e.key === "flynow_all_flyers") {
        loadFlyers();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Fallback polling interval to guarantee instant updates in single page app
    const interval = setInterval(loadFlyers, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="offers-section">
      <div className="section-heading">
        <div>
          <h2>🔥 Today's Best Deals</h2>
          <p>Verified offers updated every day.</p>
        </div>
        <button>View All</button>
      </div>

      <div className="offers-grid">
        {flyers.map((flyer) => (
          <OfferCard key={flyer.id} offer={flyer} />
        ))}
      </div>
    </section>
  );
};

export default OfferGrid;