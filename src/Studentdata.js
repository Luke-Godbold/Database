import { useState, useEffect } from 'react';
import './App.css';
import TeacherView from './TeacherView'

function StudentData(){
  const [users, setUsers] = useState([])
  const [info, setInfo] = useState({})
  const [sname, setSname] = useState("")

  async function fetchUsers() {
    const res = await fetch("http://localhost:5000/api/students");
    const data = await res.json();
    setUsers(data);
  }

  async function getUpdate() {
    const res = await fetch("http://localhost:5000/api/updateStudent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sname })
    });

    const newData = await res.json();
    const dictionary = {
      "sname":newData["sname"], 
      "s_id":newData["s_id"], 
      "email":newData["email"],
      "dob":newData["dob"]
    }
    setInfo(dictionary);
  }

  useEffect(() => {
    fetchUsers()
  },[])

  return (
  <>
  <TeacherView/>  
  <div className="App flex flex-col items-center justify-center" >
    
    

      
      <div class = "flex flex-col outline-1 m-10 gap-5 p-5 w-1/4 bg-neutral-800 place-content-center justify-center items-center rounded-3xl">
      <h1 class="text-5xl font-semibold">Find Student Data</h1>
      <form action={getUpdate} class = "flex flex-col items-center gap-5"> 
          <input
            type="text"
            name="sname"
            value={sname}
            onChange={(e) => setSname(e.target.value)}
            placeholder="Enter student name"
            class="outline-1 justify-center p-2"
          />

          <input type='submit' className="outline-1 p-2 rounded-lg cursor-pointer hover:bg-green-600"></input>
      </form>

      {Object.keys(info) == 0 ? (<p></p>) : 
      <>
      
        <h1 class = "text-4xl font-semibold">{info.sname}</h1>
        <p>Email: {info.email}</p>
        <p>Date Of Birth: {info.dob}</p>
        <p>Student Id: {info.s_id}</p>
      </>
      }
      </div>
      <div class = "flex flex-col outline-1 m-10 gap-5 p-5 w-1/7 bg-neutral-800 place-content-center justify-center items-center rounded-3xl">
      {/* <button onClick={fetchUsers} class="outline-1 rounded-xl p-2 cursor-pointer hover:bg-green-600">Get Students</button> */}
      <h1 class = "text-5xl font-semibold">Students</h1>
    
      {users.length === 0 ?
        (<p>No users</p>):
      	(<ul>
        {users.map (user => (
          		<li>{user.s_name}</li>
        	))}
        </ul>)}
      </div>
    </div>
  </>)
}

export default StudentData;