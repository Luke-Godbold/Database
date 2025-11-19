import { useState, useEffect } from 'react';
import './App.css';
import TeacherView from './TeacherView'

function AddMaterials(){

    const [courses, setCourses] = useState([])
    const [lessons, setLessons] = useState([])
    const [selectedCourse, setSelectedCourse] = useState()
    const [SelectedLesson, setSelectedLesson] = useState()
    const [status, setStatus] = useState()


    async function fetchCourses() {
        const res = await fetch("http://localhost:5000/api/courses");
        const data = await res.json();
        setCourses(data);
    }

    async function fetchLessons() {
        const res = await fetch("http://localhost:5000/api/lessons",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: 
                JSON.stringify({
                    "c_id":selectedCourse
                }
            )
            
        });
        let reg = await res.json()
        setLessons(reg.lessons)
        console.log(lessons)
        
        
    }

    async function Material() {

        let title = document.getElementById("title").value;
        let m_name = document.getElementById("m_name").value;
        let link = document.getElementById("link").value;

        const res = await fetch("http://localhost:5000/api/addMaterials",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: 
                JSON.stringify({
                    "title":title,
                    "m_name":m_name,
                    "link":link,
                    "c_id":selectedCourse,
                    "l_id":SelectedLesson
                }
            )
            
        });
        
        setStatus(await res.json())
        console.log(status)
        
        
        
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
        fetchLessons()
    },[selectedCourse])

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
            <select onChange={(e) => handleChangeLesson(e.target.value)} className="outline-1 rounded-xl p-2 cursor-pointer hover:bg-green-600">
        
                {lessons.length === 0 ?
                    <option>Select A Lesson</option>
                    :
                    (<ul>
                    {lessons.map (lesson => (
                            <option key={lesson[0]} value={lesson[0]} className="bg-neutral-900" >
                            {lesson[1]}
                            </option>
                        ))}
                    </ul>)}
            </select>

            <input type="Text" id="title" placeholder='Title' class="outline-1 rounded-xl p-2 cursor-text bg-neutral-800 hover:bg-green-600"></input>
            <input type="Text" id="m_name" placeholder='Material Name' class="outline-1 rounded-xl p-2 cursor-text bg-neutral-800 hover:bg-green-600"></input>
            <input type="Text" id="link" placeholder='Link' class="outline-1 rounded-xl p-2 cursor-text bg-neutral-800 hover:bg-green-600"></input>
            <button  className="outline-1 rounded-xl p-2 px-5 cursor-pointer hover:bg-green-600" onClick={() => Material()} >Add</button>
            {status?.res === 201 && <p class="text-green-500 font-semibold">Material added successfully</p>}
            {status?.res === 400 && <p class="text-red-500 font-semibold">Fill in all the fields</p>}
        </div>
    </div>
    
</>)
}

export default AddMaterials;