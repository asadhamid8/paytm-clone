import { useEffect, useState } from "react"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import axios from "axios";

export const Dashboard = () =>{
const [balance,setbalance] = useState(0);
const [username,setusername] = useState(0);
useEffect(() => {
axios.get("http://localhost:3000/api/v1/accounts/balance" ,{
headers: {
Authorization: "Bearer " + localStorage.getItem("token")
}})
.then(response => {
setbalance(response.data.balance)
setusername(response.data.username)
})
}, [])
return <div>
<Appbar value={username}/>
<div className="m-8">
<Balance value={balance}></Balance>
<Users></Users>
</div>
</div>
}