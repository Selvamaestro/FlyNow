import "./PlatformActivity.css";

const PlatformActivity = () => {

  const activities = [

    {
      title:"New Company Registered",
      time:"5 mins ago",
      color:"#10B981"
    },

    {
      title:"Amazon Coupon Added",
      time:"15 mins ago",
      color:"#3B82F6"
    },

    {
      title:"Flyer Approved",
      time:"35 mins ago",
      color:"#F59E0B"
    },

    {
      title:"New User Joined",
      time:"1 hour ago",
      color:"#8B5CF6"
    }

  ];

  return (

<section className="platform-activity">

<h2>Platform Activity</h2>

<div className="activity-list">

{

activities.map((item,index)=>(

<div
className="activity-card"
key={index}
>

<div
className="activity-dot"
style={{
background:item.color
}}
></div>

<div>

<h4>{item.title}</h4>

<p>{item.time}</p>

</div>

</div>

))

}

</div>

</section>

  );

};

export default PlatformActivity;