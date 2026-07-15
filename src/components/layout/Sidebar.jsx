import "./Sidebar.css";

import {
Home,
LayoutGrid,
Tag,
Zap,
Wallet,
Gift,
User,
HelpCircle
} from "lucide-react";

const Sidebar = () => {

const menu=[

{icon:<Home size={20}/>,title:"Home"},

{icon:<LayoutGrid size={20}/>,title:"Categories"},

{icon:<Tag size={20}/>,title:"Today's Offers"},

{icon:<Zap size={20}/>,title:"Flash Sales"},

{icon:<Wallet size={20}/>,title:"Coupon Wallet"},

{icon:<Gift size={20}/>,title:"Rewards"},

{icon:<User size={20}/>,title:"Profile"},

{icon:<HelpCircle size={20}/>,title:"Support"}

];

return(

<div className="sidebar">

<div className="logo">

<div className="logo-circle">

🎁

</div>

<h2>

FlyNow

</h2>

</div>

<div className="menu">

{

menu.map((item,index)=>(

<div
className={`menu-item ${index===0?"active":""}`}
key={index}
>

{item.icon}

<span>

{item.title}

</span>

</div>

))

}

</div>

<div className="coupon-card">

<h3>

🎉 Daily Rewards

</h3>

<p>

Spin today and win exciting coupons.

</p>

<button>

Spin Now

</button>

</div>

</div>

);

};

export default Sidebar;