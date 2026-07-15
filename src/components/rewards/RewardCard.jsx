import "./Rewards.css";

const RewardCard = () => {
  return (
    <section className="reward-section">

      <div className="reward-header">

        <h2>🏆 Rewards Center</h2>

        <p>Earn reward points every time you save with FlyNow.</p>

      </div>

      <div className="reward-grid">

        <div className="reward-box">
          <h4>Total Savings</h4>
          <h2>₹18,250</h2>
          <span>This Month</span>
        </div>

        <div className="reward-box">
          <h4>Reward Points</h4>
          <h2>2450</h2>
          <span>Gold Member</span>
        </div>

        <div className="reward-box">
          <h4>Coupons Used</h4>
          <h2>27</h2>
          <span>Successfully Redeemed</span>
        </div>

        <div className="reward-box">
          <h4>Current Level</h4>
          <h2>Gold</h2>
          <span>Level 3</span>
        </div>

      </div>

    </section>
  );
};

export default RewardCard;