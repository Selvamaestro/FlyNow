import "./NotificationPanel.css";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Building2,
  TicketPercent,
} from "lucide-react";

const NotificationPanel = () => {

  const notifications = [

    {
      id:1,
      title:"Amazon uploaded a new flyer",
      time:"2 minutes ago",
      icon:<Building2 size={18}/>,
      type:"blue"
    },

    {
      id:2,
      title:"Samsung flyer approved",
      time:"10 minutes ago",
      icon:<CheckCircle size={18}/>,
      type:"green"
    },

    {
      id:3,
      title:"3 coupons expire today",
      time:"Today",
      icon:<AlertTriangle size={18}/>,
      type:"orange"
    },

    {
      id:4,
      title:"Revenue increased by 18%",
      time:"This Week",
      icon:<TrendingUp size={18}/>,
      type:"purple"
    },

    {
      id:5,
      title:"120 new coupons added",
      time:"Yesterday",
      icon:<TicketPercent size={18}/>,
      type:"gold"
    }

  ];

  return (

<section className="notification-panel">

<div className="notification-header">

<div>

<h2>

Notifications

</h2>

<p>

Latest platform updates

</p>

</div>

<button>

View All

</button>

</div>

<div className="notification-list">

{

notifications.map((item)=>(

<div
className="notification-card"
key={item.id}
>

<div
className={`notification-icon ${item.type}`}
>

{item.icon}

</div>

<div className="notification-content">

<h4>

{item.title}

</h4>

<p>

{item.time}

</p>

</div>

<Bell
size={18}
className="notify-bell"
/>

</div>

))

}

</div>

</section>

  );

};

export default NotificationPanel;