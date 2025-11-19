import { useState, useEffect } from 'react';
import './App.css';
import TeacherView from './TeacherView'

function Attendance(){
    const [courses, setCourses] = useState([])
    const [names, setNames] = useState([])
    const [lessons, setLessons] = useState([])
    const [selectedCourse, setSelectedCourse] = useState()
    const [SelectedLesson, setSelectedLesson] = useState()
    const [status, setStatus] = useState()


    async function fetchCourses() {
        const res = await fetch("http://localhost:5000/api/courses");
        const data = await res.json();
        setCourses(data);
    }

    async function getStudents() {
        const res = await fetch("http://localhost:5000/api/getRegister",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: 
                JSON.stringify({
                    "course":selectedCourse
                }
            )
            
        });
        let reg = await res.json()
        setNames(reg.names)
        setLessons(reg.lessons)
        console.log(names)
        console.log(lessons)
        
        
    }

    function handleChangeCourse(course){
        setSelectedCourse(course)
    }

    function handleChangeLesson(lesson){
        setSelectedLesson(lesson)
    }

    useEffect(() => {
        fetchCourses()
    },[])

    useEffect(() => {
    if (courses.length > 0) {
        setSelectedCourse(courses[0].c_id);
    }
    }, [courses]);

    useEffect(() => {
    if (lessons.length > 0) {
        setSelectedLesson(lessons[0]);
    }
    }, [lessons]);

async function handleSubmitReg(){
    let x = document.querySelector('.registerKeys')
    let formedList = []
    for (const row of x.children) {
        let indiv_student = []
        indiv_student.push(row.getAttribute("name"))
        indiv_student.push(row.children[1].value)
        formedList.push(indiv_student)
    }
    console.log(formedList)
    const res = await fetch("http://localhost:5000/api/submitRegister",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: 
                JSON.stringify({
                    "lesson":SelectedLesson,
                    "register":formedList
                }
            )
            
        });
        setStatus(await res.json())
}


return(<>
<TeacherView/> 
    <div className="App flex flex-col items-center justify-center">
        <div class = "flex flex-col outline-1 m-20 gap-10 p-10 w-lg bg-neutral-800 place-content-center justify-center items-center rounded-3xl">
            <h1 class="text-3xl font-semibold">Attendance</h1>
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
            <button onClick={() => getStudents()} class="outline-1 rounded-xl p-2 px-5 cursor-pointer hover:bg-green-600">Get Register</button>
        </div>
        {names.length === 0 ?
            <p>select a course</p>:
            <div class = "flex flex-col outline-1 m-20 gap-10 p-10 w-lg bg-neutral-800 place-content-center justify-center items-center rounded-3xl">
                {status?.res === 201 && <p class="text-green-500 font-semibold">Register Taken successfully</p>}

                <select onChange={(e) => handleChangeLesson(e.target.value)} className="outline-1 rounded-xl p-2 cursor-pointer hover:bg-green-600">
        
                {lessons.length === 0 ?
                    <option>Select A lesson</option>
                    :
                    (<ul>
                    {lessons.map (lesson => (
                            <option key={lesson[1]} value={lesson[1]} className="bg-neutral-900" >
                            {lesson[0]}
                            </option>
                        ))}
                    </ul>)}
                </select>


                <table className = "table-auto outline-1">
                    <thead className="outline-1">
                        <tr>
                            <th>Name</th>
                            <th>Attended</th>
                        </tr>
                    </thead>
                    <tbody className='registerKeys'>
                    {names.map((name, index) => (
                        <tr name={name[1]}>
                            <td key={name[1]}>{name[0]}</td>
                            <select>
                                <option key={`t-${name[1]}`} className="bg-neutral-900">True</option>
                                <option key={`f-${name[1]}`} className="bg-neutral-900">False</option>
                            </select>
                        </tr> 
                    ))}
                    </tbody>
                </table>
                <button  className="outline-1 rounded-xl p-2 px-5 cursor-pointer hover:bg-green-600" onClick={() => handleSubmitReg()}>Submit</button>
            </div>}
    </div>
</>)
}

export default Attendance;