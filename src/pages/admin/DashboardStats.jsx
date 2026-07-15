import "./DashboardStats.css";
import { Users, Building2, TicketPercent, IndianRupee, FileCheck, Activity } from "lucide-react";

const DashboardStats = ({ stats }) => {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users size={30} />,
      color: "#3B82F6",
    },
    {
      title: "Companies",
      value: stats.totalCompanies,
      icon: <Building2 size={30} />,
      color: "#10B981",
    },
    {
      title: "Coupons",
      value: stats.totalCoupons,
      icon: <TicketPercent size={30} />,
      color: "#F59E0B",
    },
    {
      title: "Revenue",
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: <IndianRupee size={30} />,
      color: "#EF4444",
    },
    {
      title: "Flyers",
      value: stats.activeFlyers,
      icon: <FileCheck size={30} />,
      color: "#8B5CF6",
    },
    {
      title: "Platform Health",
      value: `${stats.platformHealth}%`,
      icon: <Activity size={30} />,
      color: "#06B6D4",
    },
  ];

  return (
    <section className="dashboard-stats">
      {cards.map((card, index) => (
        <div className="stat-card" key={index}>
          <div
            className="stat-icon"
            style={{ background: card.color }}
          >
            {card.icon}
          </div>

          <div>
            <h3>{card.value}</h3>
            <p>{card.title}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default DashboardStats;