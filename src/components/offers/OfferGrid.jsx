import "./Offers.css";

import offers from "../../data/offers";

import OfferCard from "./OfferCard";

const OfferGrid = () => {

  return (

    <section className="offers-section">

<div className="section-heading">

<div>

<h2>

🔥 Today's Best Deals

</h2>

<p>

Verified offers updated every day.

</p>

</div>

<button>

View All

</button>

</div>

      <div className="offers-grid">

        {

          offers.map((offer)=>(

            <OfferCard

              key={offer.id}

              offer={offer}

            />

          ))

        }

      </div>

    </section>

  );

};

export default OfferGrid;