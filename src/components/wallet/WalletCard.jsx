import "./Wallet.css";
import wallet from "../../data/wallet";

const WalletCard = () => {

return(

<section className="wallet-section">

<div className="section-heading">

<h2>

💳 Coupon Wallet

</h2>

<p>

All your saved coupons in one place.

</p>

</div>

<div className="wallet-summary">

<div className="summary-card">

<h4>Total Savings</h4>

<h2>₹18,250</h2>

<p>This Month</p>

</div>

<div className="summary-card">

<h4>Available</h4>

<h2>12</h2>

<p>Coupons</p>

</div>

<div className="summary-card">

<h4>Redeemed</h4>

<h2>7</h2>

<p>Coupons</p>

</div>

<div className="summary-card">

<h4>Expired</h4>

<h2>2</h2>

<p>Coupons</p>

</div>

</div>

<table className="wallet-table">

<thead>

<tr>

<th>Brand</th>

<th>Offer</th>

<th>Coupon Code</th>

<th>Status</th>

<th>Expiry</th>

<th></th>

</tr>

</thead>

<tbody>

{

wallet.map((item)=>(

<tr key={item.id}>

<td>{item.brand}</td>

<td>{item.offer}</td>

<td>{item.code}</td>

<td>

<span className={`status ${item.status.toLowerCase()}`}>

{item.status}

</span>

</td>

<td>{item.expiry}</td>

<td>

<button>

View QR

</button>

</td>

</tr>

))

}

</tbody>

</table>

</section>

);

};

export default WalletCard;