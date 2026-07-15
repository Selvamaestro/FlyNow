import { useState, useEffect } from "react";
import "./FlashSale.css";
import flashSalesData from "../../data/flashSales";
import FlashSaleCard from "./FlashSaleCard";

const FlashSaleGrid = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const loadFlashSales = () => {
      let allSaved = localStorage.getItem("flynow_all_flash_sales");
      if (!allSaved) {
        // Seed default flash sales with a 48 hour duration
        const seededList = flashSalesData.map((item) => ({
          ...item,
          expiresAt: Date.now() + 48 * 60 * 60 * 1000,
          companyEmail: "demo@flynow.com"
        }));
        localStorage.setItem("flynow_all_flash_sales", JSON.stringify(seededList));
        allSaved = JSON.stringify(seededList);
      }

      let list = JSON.parse(allSaved);
      const activeSales = list.filter((s) => s.expiresAt > Date.now());
      if (activeSales.length !== list.length) {
        localStorage.setItem("flynow_all_flash_sales", JSON.stringify(activeSales));
      }
      
      setSales(activeSales);
    };

    loadFlashSales();

    const handleStorageChange = (e) => {
      if (!e.key || e.key === "flynow_all_flash_sales") {
        loadFlashSales();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(loadFlashSales, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="flash-section">
      <div className="section-heading">
        <h2>🔥 Flash Sales</h2>
        <p>Limited time offers ending today.</p>
      </div>

      <div className="flash-grid">
        {sales.map((sale) => (
          <FlashSaleCard key={sale.id} sale={sale} />
        ))}
      </div>
    </section>
  );
};

export default FlashSaleGrid;