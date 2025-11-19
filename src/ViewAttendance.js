import { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './StudentDashboard';
import { useCookies } from "react-cookie";

function ViewAttendance(){
    const [cookies, setCookie, removeCookie] = useCookies(["userData"]);
    const [overall, setOverall] = useState(null)
    const [attendance, setAttendance] = useState([])

    async function fetchAttendance() {
        const u_id = cookies.userData.details[0]

        const res = await fetch("http://localhost:5000/api/fetchAttendance",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: 
                JSON.stringify({
                    "s_id":u_id
                }
            )
        });

        const data = await res.json();
        setOverall(data["Overall"]);
        setAttendance(data["Attendance"])
        console.log(overall);
        console.log(attendance)
        
    }

    useEffect(() => {
        fetchAttendance()
    },[])

    return(
    <>
    <Dashboard/>
    <div className='App flex flex-col items-center justify-center gap-10'>
        

        {overall === null ?
        (<p>Loading</p>):
      	(<>
        <p className='p-2'>Total Attendance</p>
            <div className="bg-red-500 w-1/6 ">
              <div className="bg-green-500 " style={{width: `${overall}%`}}>
                {overall} %
              </div>
            </div>
        </>
        )}

        {attendance.length === 0 ? 
        (<p></p>):<>
        <p>Broken down Attendance:</p>
        <table className = "table-auto outline-1">
                    <thead className="outline-1">
                        <tr className="outline-1">
                            <th className="outline-1 p-2">Lesson</th>
                            <th className="outline-1 p-2">Attended</th>
                        </tr>
                    </thead>
                    <tbody className='outline-1'>
                    {attendance.map((attend) => (
                        <tr className='outline-1'>
                            <td className='outline-1 p-2'>{attend[0]}</td>
                            <td className='outline-1 p-2'>{attend[1]}</td>
                        </tr> 
                    ))}
                    </tbody>
                </table></>}
        
    
    
    
    </div></>
    )
}

export default ViewAttendance;