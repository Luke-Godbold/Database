import { useState, useEffect } from 'react';
import './App.css';
import TeacherView from './TeacherView'

function Enrolment(){
    const [courses, setCourses] = useState([])
    const [students, setStudents] = useState([])
    const [selectedCourse, setSelectedCourse] = useState()
    const [selectedStudent, setSelectedStudent] = useState()
    const [status, setStatus] = useState()
    const [status2, setStatus2] = useState()

    async function fetchCourses() {
        const res = await fetch("http://localhost:5000/api/courses");
        const data = await res.json();
        setCourses(data);
    }
    async function fetchStudents() {
        const res = await fetch("http://localhost:5000/api/students");
        const data = await res.json();
        setStudents(data);
    }

    async function enrole() {
        const res = await fetch("http://localhost:5000/api/enrole",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: 
                JSON.stringify({
                    "course":selectedCourse,
                    "student":selectedStudent
                }
            )
        });
        setStatus(await res.json())
        console.log(status)
    }

    useEffect(() => {
        fetchCourses()
        fetchStudents()
    },[])

    
    useEffect(() => {
    if (courses.length > 0) {
        setSelectedCourse(courses[0].c_id);
    }
    }, [courses]);

      useEffect(() => {
    if (students.length > 0) {
      setSelectedStudent(students[0].s_id);
    }
    }, [students]);

    function handleChangeStudent(student){
        setSelectedStudent(student)
    }
    function handleChangeCourse(course){
        setSelectedCourse(course)
    }

    async function addStudent() {
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let dob = document.getElementById("dob").value;
        let password = document.getElementById("password").value;

        const res = await fetch("http://localhost:5000/api/addStudent",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: 
                JSON.stringify({
                    "name":name,
                    "email":email,
                    "dob":dob,
                    "password":password
                }
            )
        });
        setStatus2(await res.json())
        console.log(status2)

        fetchStudents()
        
        
    }

return(
    <>
    <TeacherView/> 
    <div className="App flex flex-col items-center justify-center" >
        <div class = "flex flex-col outline-1 m-20 gap-10 p-10 w-lg bg-neutral-800 place-content-center justify-center items-center rounded-3xl">
            <h1 class="text-3xl font-semibold">Add a Student</h1>
            <input type="Text" id="name" placeholder='Student Name' class="outline-1 rounded-xl p-2 cursor-text hover:bg-green-600"></input>
            <input type="Text" id="email" placeholder='Student Email' class="outline-1 rounded-xl p-2 cursor-text hover:bg-green-600"></input>
            <input type="Text" id="dob" placeholder='Date of Birth' class="outline-1 rounded-xl p-2 cursor-text hover:bg-green-600"></input>
            <input type="Text" id="password" placeholder='Password' class="outline-1 rounded-xl p-2 cursor-text hover:bg-green-600"></input>
            <button onClick={() => addStudent()} class="outline-1 rounded-xl p-2 cursor-pointer hover:bg-green-600">Enrole</button>
            {status2?.res === 201 && <p class="text-green-500 font-semibold">Student added successfully</p>}
            {status2?.res === 400 && <p class="text-red-500 font-semibold">Fill in all the boxes</p>}  
            {status2?.res === 409 && <p class="text-red-500 font-semibold">Student already in database</p>}  
        </div>
        <div class = "flex flex-col outline-1 m-20 gap-10 p-10 w-lg bg-neutral-800 place-content-center justify-center items-center rounded-3xl">
        <h1 class="text-3xl font-semibold">Student Enrolment</h1>
        <select onChange={(e) => handleChangeCourse(e.target.value)} className="outline-1 rounded-xl p-2 cursor-pointer hover:bg-green-600">
        
        {courses.length === 0 ?
            <option>Select A Course</option>
            :
            (<ul>
            {courses.map (course => (
                    <option key={course.id} value={course.c_id} className="bg-neutral-900" >
                    {course.c_name}
                    </option>
                ))}
            </ul>)}
        </select>
        
        
        <select onChange={(e) => handleChangeStudent(e.target.value)} className="outline-1 rounded-xl p-2 cursor-pointer hover:bg-green-600">
        
        {students.length === 0 ?
            <option>Select A Student</option>
            :
            (<ul>
            {students.map (student => (
                    <option key={student.id} value={student.s_id} className="bg-neutral-900" >
                    {student.s_name}
                    </option>
                ))}
            </ul>)}
        </select>
        <button onClick={() => enrole()} class="outline-1 rounded-xl p-2 cursor-pointer hover:bg-green-600">Enrol</button>
        {status?.res === 201 && <p class="text-green-500 font-semibold">Student enrolled successfully</p>}
        {status?.res === 409 && <p class="text-red-500 font-semibold">Student is already enrolled in this course</p>}
        {status?.res === 400 && <p class="text-red-500 font-semibold">Select a student and course</p>}
        </div>
    </div>
</>)
}
export default Enrolment;