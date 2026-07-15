import "./FlashSale.css";

import flashSales from "../../data/flashSales";

import FlashSaleCard from "./FlashSaleCard";

const FlashSaleGrid=()=>{

return(

<section className="flash-section">

<div className="section-heading">

<h2>

🔥 Flash Sales

</h2>

<p>

Limited time offers ending today.

</p>

</div>

<div className="flash-grid">

{

flashSales.map((sale)=>(

<FlashSaleCard

key={sale.id}

sale={sale}

/>

))

}

</div>

</section>

);

};

export default FlashSaleGrid;