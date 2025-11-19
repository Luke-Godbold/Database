import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';

function Login(){
    const [userType, setUserType] = useState("students")
    const [status, setStatus] = useState()
    const [cookies, setCookie] = useCookies(["userData"]);
    const navigate = useNavigate();

    async function SignIn(userType) {
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        const res = await fetch("http://localhost:5000/api/logIn",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: 
                JSON.stringify({
                    "email":email,
                    "password":password,
                    "type":userType
                }
            )
        });
        const data = await res.json()
        setStatus(data)
        if (data.res === 200){
            setCookie("userData", {details: data.details, userType: userType},
                {path:"/", maxAge:60*60}
            )
            if( userType === "students"){
                navigate("/Dashboard")
            }
            else if( userType === "teachers"){
                navigate("/TeacherView")
            }
            else{
                navigate("/login")
            }
        }

        
        
    }

    function handleChangeUser(Type){
        console.log("Selected:", Type);
        setUserType(Type)
    }
    return(
        <div className="App flex flex-col items-center justify-center">
            <div class = "flex flex-col outline-1 m-20 gap-10 p-10 w-lg bg-neutral-800 place-content-center justify-center items-center rounded-3xl">
                <h1>Log In</h1>
                <div className='flex'>
                    <button className={`p-2 px-5 cursor-pointer outline-1 ${userType === "students" ? "bg-green-600 text-white" : "bg-neutral-900 hover:bg-green-600"}`} onClick={() => handleChangeUser("students")}>Student</button>
                    <button className={`p-2 px-5 cursor-pointer outline-1 ${userType === "teachers" ? "bg-green-600 text-white" : "bg-neutral-900 hover:bg-green-600"}`} onClick={() => handleChangeUser("teachers")}>Teacher</button>
                    <button className={`p-2 px-5 cursor-pointer outline-1 ${userType === "parents" ? "bg-green-600 text-white" : "bg-neutral-900 hover:bg-green-600"}`} onClick={() => handleChangeUser("parents")}>Parent</button>
                </div>
                <input type="Text" id="email" placeholder='Email' class="outline-1 rounded-xl p-2 cursor-text bg-neutral-800 hover:bg-green-600"></input>
                <input type="Text" id="password" placeholder='Password' class="outline-1 rounded-xl p-2 cursor-text bg-neutral-800 hover:bg-green-600"></input>
                <button  className="outline-1 rounded-xl p-2 px-5 cursor-pointer hover:bg-green-600" onClick={() => SignIn(userType)} >Log In</button>
                {status?.res === 200 && <p class="text-green-500 font-semibold">Student Logged in</p>}
                {status?.res === 401 && <p class="text-red-500 font-semibold">Email or Password is incorrect</p>}
                {status?.res === 400 && <p class="text-red-500 font-semibold">Fill in all fields</p>}
            </div>
        </div>
    )
}


export default Login;