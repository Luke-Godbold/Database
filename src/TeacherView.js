import { Link } from "react-router-dom"
import './App.css';
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom"
import { useCookies } from "react-cookie";


function TeacherView() {
  const [cookies, setCookie, removeCookie] = useCookies(["userData"]);
  const navigate = useNavigate();
  async function signOut() {
    removeCookie("userData", {path: "/"});
    navigate("/LogIn")
  }
  return(
    
  
    <ul class = "bg-neutral-900 text-white flex flex-row gap-10">
      <Link to="/StudentData" className="p-5 cursor-pointer hover:bg-green-600">Student Data</Link>
      <Link to="/Enrolment" className="p-5 cursor-pointer hover:bg-green-600">Enrolment</Link>
      <Link to="/Attendance" className="p-5 cursor-pointer hover:bg-green-600">Register</Link>
      <Link to="/AddMaterials" className="p-5 cursor-pointer hover:bg-green-600">Add Materials</Link>
      <button className="p-5 cursor-pointer hover:bg-green-600 ml-auto" onClick={signOut}>Sign Out</button>
    </ul>
  
  
  
)

  
}




export default TeacherView;
