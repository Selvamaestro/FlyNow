import "./SystemStatus.css";

import {
  Server,
  Database,
  HardDrive,
  Bell,
  ShieldCheck,
} from "lucide-react";

const SystemStatus = () => {

  const status = [

    {
      title:"Server Status",
      value:"Online",
      percent:100,
      color:"#10B981",
      icon:<Server size={22}/>
    },

    {
      title:"Database Health",
      value:"Healthy",
      percent:96,
      color:"#3B82F6",
      icon:<Database size={22}/>
    },

    {
      title:"Storage Usage",
      value:"68%",
      percent:68,
      color:"#F59E0B",
      icon:<HardDrive size={22}/>
    },

    {
      title:"Notification Service",
      value:"Running",
      percent:92,
      color:"#8B5CF6",
      icon:<Bell size={22}/>
    },

    {
      title:"Security",
      value:"Protected",
      percent:100,
      color:"#06B6D4",
      icon:<ShieldCheck size={22}/>
    }

  ];

  return (

<section className="system-status">

<div className="system-header">

<div>

<h2>

System Status

</h2>

<p>

Current health of the FlyNow platform

</p>

</div>

</div>

<div className="system-list">

{

status.map((item,index)=>(

<div
className="system-card"
key={index}
>

<div className="system-top">

<div
className="system-icon"
style={{
background:item.color
}}
>

{item.icon}

</div>

<div className="system-info">

<h4>

{item.title}

</h4>

<p>

{item.value}

</p>

</div>

</div>

<div className="status-progress">

<div
className="status-fill"
style={{
width:`${item.percent}%`,
background:item.color
}}
></div>

</div>

</div>

))

}

</div>

</section>

  );

};

export default SystemStatus;