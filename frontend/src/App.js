import { Link } from "react-router-dom"
import './App.css';
import {BrowserRouter, Routes, Route, useNavigate, useLocation} from "react-router-dom"
import TeacherView from './TeacherView.js';
import Dashboard from "./StudentDashboardNav.js";
import StudentData from './Studentdata.js';
import Enrolment from './Enrolment.js';
import Attendance from './Attendance.js';
import ViewAttendance from "./StudentDashboard.js";
import AddMaterials from "./Materials.js";
import ViewMaterials from "./ViewMaterials.js";
import { useCookies } from "react-cookie";
import Login from "./LogIn.js";
import { useEffect } from "react";

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(["userData"]);

  useEffect(() => {
    if (!cookies.userData && location.pathname === "/") {
      navigate("/LogIn");
    }
  }, [location, navigate, cookies]);

//   useEffect(() => {
//   console.log("Cookies:", cookies);
// }, [cookies]);

    return(
  <div className="text-white ">
  {/* <ul className = "bg-neutral-900 text-white p-5 flex flex-row gap-10">
  <li><Link to="/TeacherView">Teacher View</Link></li>
  <li><Link to="/Dashboard">Student Dashboard</Link></li>
  <li><Link to="/LogIn">Log In</Link></li>
  </ul> */}
    <Routes>
      <Route path="/TeacherView" element={<TeacherView/>}></Route>
      <Route path="/Dashboard" element={<ViewAttendance/>}></Route>
      <Route path="/StudentData" element={<StudentData/>}></Route>
      <Route path="/Enrolment" element={<Enrolment/>}></Route>
      <Route path="/Attendance" element={<Attendance/>}></Route>
      <Route path="/Home" element={<ViewAttendance/>}></Route>
      <Route path="/LogIn" element={<Login/>}></Route>
      <Route path="/AddMaterials" element={<AddMaterials/>}></Route>
      <Route path="/ViewMaterials" element={<ViewMaterials/>}></Route>
    </Routes>
  
  </div>)

}

export default AppWrapper;