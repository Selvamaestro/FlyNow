import "./PendingApprovals.css";

const PendingApprovals = () => {

  const flyers = [

    {
      id: 1,
      company: "Amazon",
      title: "Monsoon Mega Sale",
      offer: "Up to 70% OFF on Electronics",
      date: "15 Jul - 30 Jul",
      status: "Pending",
      image:
        "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600",
    },

    {
      id: 2,
      company: "Samsung",
      title: "Galaxy Fest",
      offer: "Flat ₹5000 OFF on Galaxy Series",
      date: "20 Jul - 28 Jul",
      status: "Pending",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    },

    {
      id: 3,
      company: "Nike",
      title: "Sports Bonanza",
      offer: "Extra 30% OFF on Shoes",
      date: "18 Jul - 25 Jul",
      status: "Pending",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    },

  ];

  return (

    <section className="pending-section">

      <div className="section-header">

        <div>

          <h2>Pending Flyer Approvals</h2>

          <p>Review flyers uploaded by companies.</p>

        </div>

        <button className="view-btn">

          View All

        </button>

      </div>

      <div className="pending-grid">

        {

          flyers.map((flyer) => (

            <div
              className="pending-card"
              key={flyer.id}
            >

              <img
                src={flyer.image}
                alt={flyer.title}
              />

              <div className="pending-content">

                <span className="company-tag">

                  {flyer.company}

                </span>

                <h3>

                  {flyer.title}

                </h3>

                <p>

                  {flyer.offer}

                </p>

                <div className="pending-info">

                  <span>

                    📅 {flyer.date}

                  </span>

                  <span className="status pending">

                    {flyer.status}

                  </span>

                </div>

                <div className="pending-buttons">

                  <button className="approve-btn">

                    Approve

                  </button>

                  <button className="reject-btn">

                    Reject

                  </button>

                </div>

              </div>

            </div>

          ))

        }

      </div>

    </section>

  );

};

export default PendingApprovals;