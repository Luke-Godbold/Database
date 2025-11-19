import { Link } from "react-router-dom"
import './App.css';
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom"
import { useCookies } from "react-cookie";
import { useEffect } from "react";

function Dashboard(){
    const [cookies, setCookie, removeCookie] = useCookies(["userData"]);
    const navigate = useNavigate();

    async function signOut() {
    removeCookie("userData", {path: "/"});
    navigate("/LogIn")
  }
  
  

    return(
    <>
        <ul className = "bg-neutral-900 text-white flex flex-row gap-10">
            <Link to="/Home" className="p-5 cursor-pointer hover:bg-green-600">Home</Link>
            <Link to="/ViewMaterials" className="p-5 cursor-pointer hover:bg-green-600">Materials</Link>
            <button className="p-5 cursor-pointer hover:bg-green-600 ml-auto" onClick={signOut}>Sign Out</button>
        </ul>
        
    </>
    )
}


export default Dashboard;