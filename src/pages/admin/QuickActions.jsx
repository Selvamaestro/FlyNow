import "./QuickActions.css";

import {
  Building2,
  TicketPercent,
  FileCheck,
  BarChart3,
  Megaphone,
  Database,
} from "lucide-react";

const QuickActions = () => {

  const actions = [

    {
      title: "Add Company",
      icon: <Building2 size={26} />,
      color: "#3B82F6",
    },

    {
      title: "Create Coupon",
      icon: <TicketPercent size={26} />,
      color: "#F4B000",
    },

    {
      title: "Approve Flyers",
      icon: <FileCheck size={26} />,
      color: "#10B981",
    },

    {
      title: "Export Report",
      icon: <BarChart3 size={26} />,
      color: "#8B5CF6",
    },

    {
      title: "Announcement",
      icon: <Megaphone size={26} />,
      color: "#EF4444",
    },

    {
      title: "Backup DB",
      icon: <Database size={26} />,
      color: "#06B6D4",
    }

  ];

  return (

<section className="quick-actions">

<div className="quick-header">

<div>

<h2>

Quick Actions

</h2>

<p>

Frequently used administrator actions

</p>

</div>

</div>

<div className="quick-grid">

{

actions.map((action,index)=>(

<button
key={index}
className="quick-card"
>

<div
className="quick-icon"
style={{
background:action.color
}}
>

{action.icon}

</div>

<h4>

{action.title}

</h4>

</button>

))

}

</div>

</section>

  );

};

export default QuickActions;