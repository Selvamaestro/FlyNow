import "./RevenueOverview.css";

const RevenueOverview = () => {
  return (
    <section className="revenue-overview">

      <div className="revenue-header">

        <h2>Revenue Overview</h2>

        <select>

          <option>This Month</option>

          <option>Last Month</option>

          <option>This Year</option>

        </select>

      </div>

      <div className="chart-placeholder">

        <h1>₹ 4,820,000</h1>

        <p>Total Revenue Generated</p>

        <div className="chart-bars">

          <span></span>

          <span></span>

          <span></span>

          <span></span>

          <span></span>

          <span></span>

          <span></span>

        </div>

      </div>

    </section>
  );
};

export default RevenueOverview;