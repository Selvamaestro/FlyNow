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
        const defaultFlyers = [
          {
            id: 1,
            name: "Early Bird Coffee 20%",
            companyName: "Coffee House",
            category: "Food",
            promoCode: "COFFEE20",
            expiryDate: "2026-08-31",
            image: "/coffee_flyer.png",
            companyEmail: "demo@flynow.com"
          },
          {
            id: 2,
            name: "Luxury Accessories Flash",
            companyName: "Gold & Co",
            category: "Fashion",
            promoCode: "LUXURY15",
            expiryDate: "2026-07-10",
            image: "/accessories_flyer.png",
            companyEmail: "demo@flynow.com"
          },
          {
            id: 3,
            name: "Weekend Market Specials",
            companyName: "Supermarket Inc",
            category: "Grocery",
            promoCode: "MARKETWEEK",
            expiryDate: "2026-07-20",
            image: "/market_flyer.png",
            companyEmail: "demo@flynow.com"
          }
        ];
        localStorage.setItem("flynow_all_flyers", JSON.stringify(defaultFlyers));
        setFlyers(defaultFlyers);
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