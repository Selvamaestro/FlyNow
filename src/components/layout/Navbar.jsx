import "./Navbar.css";

import{

Search,

Bell,

MapPin,

ChevronDown

}from"lucide-react";

const Navbar=()=>{

return(

<div className="navbar">

<div className="search-box">

<Search size={18}/>

<input

type="text"

placeholder="Search brands, coupons, offers..."

 />

</div>

<div className="nav-right">

<div className="location">

<MapPin size={18}/>

<span>

Chennai

</span>

<ChevronDown size={16}/>

</div>

<div className="notification">

<Bell size={20}/>

<div className="dot"></div>

</div>

<div className="profile">

<img

src="https://i.pravatar.cc/100"

alt="profile"

/>

<div>

<h4>

Hi, Priya

</h4>

<p>

Premium Member

</p>

</div>

</div>

</div>

</div>

);

};

export default Navbar;