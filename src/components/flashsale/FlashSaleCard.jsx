import "./FlashSale.css";

const FlashSaleCard = ({ sale }) => {

return(

<div className="flash-card">

<div
className="flash-top"
style={{background:sale.color}}
>

<span>

{sale.brand}

</span>

<div className="timer">

⏰ {sale.timer}

</div>

</div>

<img
src={sale.image}
alt={sale.title}
/>

<div className="flash-body">

<h3>

{sale.title}

</h3>

<p>

{sale.discount}

</p>

<h2>

{sale.price}

</h2>

<button>

Shop Now

</button>

</div>

</div>

);

};

export default FlashSaleCard;