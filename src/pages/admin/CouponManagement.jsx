import "./CouponManagement.css";
import { useEffect, useState } from "react";
import { getCoupons } from "../../services/couponService";
const CouponManagement = () => {

  const [coupons, setCoupons] = useState([]);

  useEffect(() => {

    loadCoupons();

  }, []);

  const loadCoupons = async () => {

    const data = await getCoupons();

    console.log(data);

    setCoupons(data);

  };
  return (
    <div className="coupon-management">

      <div className="coupon-header">

        <div>

          <h2>Coupon Management</h2>

          <p>Manage all coupons available in FlyNow</p>

        </div>

        <button className="add-coupon-btn">
          + Add Coupon
        </button>

      </div>

      <div className="coupon-toolbar">

        <input
          type="text"
          placeholder="Search coupons..."
        />

        <select>

          <option>All Status</option>

          <option>Active</option>

          <option>Expired</option>

        </select>

      </div>

<div className="coupon-table">

  <div className="table-head">

    <span>Title</span>

    <span>Company</span>

    <span>Category</span>

    <span>Discount</span>

    <span>Status</span>

    <span>Actions</span>

  </div>

  {

    coupons.map((coupon) => (

      <div
        className="table-row"
        key={coupon.id}
      >

        <span>

          {coupon.title}

        </span>

        <span>

          {coupon.company}

        </span>

        <span>

          {coupon.category}

        </span>

        <span>

          {coupon.discount}

        </span>

        <span>

          <span
            className={
              coupon.status === "Active"
                ? "status active"
                : "status expired"
            }
          >

            {coupon.status}

          </span>

        </span>

        <span>

          <button className="edit-btn">

            Edit

          </button>

          <button className="delete-btn">

            Delete

          </button>

        </span>

      </div>

    ))

  }

</div>

    </div>
  );
};

export default CouponManagement;