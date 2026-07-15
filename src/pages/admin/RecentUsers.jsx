import "./RecentUsers.css";

const RecentUsers = () => {

  const users = [

    {
      id:1,
      name:"Rahul Sharma",
      email:"rahul@gmail.com",
      status:"Active",
      image:"https://i.pravatar.cc/100?img=12"
    },

    {
      id:2,
      name:"Priya Nair",
      email:"priya@gmail.com",
      status:"Inactive",
      image:"https://i.pravatar.cc/100?img=30"
    },

    {
      id:3,
      name:"Arun Kumar",
      email:"arun@gmail.com",
      status:"Active",
      image:"https://i.pravatar.cc/100?img=18"
    },

    {
      id:4,
      name:"Sneha Reddy",
      email:"sneha@gmail.com",
      status:"Active",
      image:"https://i.pravatar.cc/100?img=25"
    }

  ];

  return (

<section className="recent-users">

<div className="recent-header">

<div>

<h2>

Recent Users

</h2>

<p>

Newest users joined FlyNow

</p>

</div>

<button>

View All

</button>

</div>

<table>

<thead>

<tr>

<th>User</th>

<th>Email</th>

<th>Status</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{

users.map((user)=>(

<tr
key={user.id}
>

<td>

<div className="user-profile">

<img
src={user.image}
alt=""
/>

<span>

{user.name}

</span>

</div>

</td>

<td>

{user.email}

</td>

<td>

<span
className={
user.status==="Active"
? "status active"
: "status inactive"
}
>

{user.status}

</span>

</td>

<td>

<button
className="view-user-btn"
>

View

</button>

</td>

</tr>

))

}

</tbody>

</table>

</section>

  );

};

export default RecentUsers;