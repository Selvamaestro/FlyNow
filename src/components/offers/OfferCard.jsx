import "./Offers.css";
const OfferCard = ({ offer }) => {
  return (
    <div className="offer-card">

    <div
        className="offer-top"
        style={{
            background:`linear-gradient(135deg,
            ${offer.gradient[0]},
            ${offer.gradient[1]})`
        }}
    >

        <span className="brand">

            {offer.brand}

        </span>

        <span className="discount">

            {offer.discount}

        </span>

    </div>

    <div className="offer-body">

        <h3>

            {offer.title}

        </h3>

        <p>

            {offer.description}

        </p>

        <div className="coupon-code">

            {offer.coupon}

        </div>

        <div className="offer-footer">

            <small>

                {offer.validity}

            </small>

            <button>

                {offer.button}

            </button>

        </div>

    </div>

</div>
  );
};

export default OfferCard;