from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3


app = Flask(__name__)
CORS(app)

@app.route("/api/students")
def users():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    res = cur.execute("SELECT * FROM students").fetchall()
    conn.close()
    return jsonify([dict(row) for row in res]), 200

@app.route("/api/studentinfo")
def s_info():
    id = request.get_data("id")
    sname = request.get_data("sname")
    s_id = request.form.get("u_id")
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    res = cur.execute(f"SELECT * FROM students WHERE s_id == {s_id}").fetchall()
    conn.close()
    return jsonify([dict(row) for row in res]), 200


@app.route("/api/updateStudent", methods=["POST"])
def update():
    x = request.get_json()["sname"]
    print(x)
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()
    res = cur.execute(f"SELECT * FROM students WHERE s_name = ?",(x,)).fetchall()

    return jsonify({"sname": x, "s_id":res[0][0], "email":res[0][2], "dob":res[0][3]})

@app.route("/api/courses")
def courses():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    res = cur.execute("SELECT * FROM courses").fetchall()
    conn.close()
    return jsonify([dict(row) for row in res]), 200

@app.route("/api/lessons", methods=["POST"])
def lessons():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()

    data = request.get_json()
    c_id = data.get("c_id", "")
    # print(c_id)

    res = cur.execute("SELECT * FROM lessons WHERE c_id = ?",(c_id,)).fetchall()
    # print(res)
    conn.close()
    return jsonify({"lessons":res}), 200

@app.route("/api/enrole", methods=["POST"])
def enrole():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()
    data = request.get_json()
    print(data)
    s_id = data.get("student", "")
    c_id = data.get("course", "")
    print(s_id, c_id)

    if s_id and c_id:
        res = cur.execute(f"SELECT * FROM enrolment WHERE s_id = ? AND c_id = ?",(s_id,c_id)).fetchall()
        if len(res) > 0:
            print("student already enroled")
            conn.close()
            return jsonify({"res": 409})
        else:
            cur.execute("INSERT INTO enrolment (s_id, c_id ) VALUES (?, ?)",(s_id, c_id))
            conn.commit()
            conn.close()
            return jsonify({"res": 201})
    conn.close()
    return jsonify({"res": 400})
    
@app.route("/api/getRegister", methods=["POST"])
def getRegister():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()
    data = request.get_json()
    #Gets the selected course
    c_id = data.get("course", "")
    
    #Retrieves all the student ids of students enrolled in the course
    res = cur.execute("SELECT s_id FROM enrolment WHERE c_id = ? ",(c_id,)).fetchall()
    
    s_names = []
    #Selects each students name and puts into a list called s_names
    for i in res:
        name = cur.execute("SELECT s_name, s_id FROM students WHERE s_id = ? ",(i[0],)).fetchall()
        s_names.append(name[0])

    #select the lessons that are in the chosen course
    res = cur.execute("SELECT l_name, l_id FROM lessons WHERE c_id = ? ",(c_id,)).fetchall()
    
    #Gets rid of un necesary brackets and commas
    l_names = []
    for i in res:
        l_names.append(i)
    print(l_names)
    conn.close()
    

    print(jsonify({"names": s_names}))
    print(jsonify({"lessons": l_names}))
    return jsonify({"names": s_names, "lessons":l_names})

@app.route("/api/submitRegister", methods=["POST"])
def submitRegister():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()
    #Gets Data from the front end
    data = request.get_json()
    lesson = data.get("lesson", "")
    register = data.get("register", "")
    #loops through each student adding to the database if they were there or not
    for i in register:
        cur.execute("INSERT INTO attendence (s_id, l_id, Attend ) VALUES (?, ?, ?)",(i[0], lesson, i[1]))
    conn.commit()
    conn.close()
    return jsonify({"res": 201})

@app.route("/api/addStudent", methods=["POST"])
def addStudent():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()

    data = request.get_json()
    name = data.get("name", "")
    email = data.get("email", "")
    dob = data.get("dob", "")
    password = data.get("password", "")
    required = [name, email, dob, password]

    if any(not field for field in required):
        conn.close()
        return jsonify({"res": 400})
    else:
        res = cur.execute("SELECT * FROM students WHERE s_name = ?",(name,)).fetchall()
        if len(res) == 0:
            cur.execute("INSERT INTO students (s_name, email, dob, pass) VALUES (?, ?, ?, ?)",(name, email, dob, password))
            conn.commit()
            conn.close()
            return jsonify({"res": 201})
        else:
            conn.close()
            return jsonify({"res": 409})

@app.route("/api/logIn", methods=["POST"])
def logIn():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()

    data = request.get_json()
    email = data.get("email", "")
    password = data.get("password", "")
    type = data.get("type", "")

    required = [email, password, type]

    if any(not field for field in required):
        conn.close()
        return jsonify({"res": 400})
    else:
        if type == "students":
            res = cur.execute("SELECT * FROM students WHERE email = ?",(email,)).fetchall()
            if res[0][4] == password:
                conn.close()
                return jsonify({"res": 200, "details":res[0]})
            else:
                conn.close()
                return jsonify({"res":401})
        elif type == "teachers":
            res = cur.execute("SELECT * FROM teachers WHERE email = ?",(email,)).fetchall()
            if res[0][3] == password:
                conn.close()
                return jsonify({"res": 200, "details":res[0]})
            else:
                conn.close()
                return jsonify({"res":401})
        elif type == "parents":
            res = cur.execute("SELECT * FROM parents WHERE email = ?",(email,)).fetchall()
            if res[0][3] == password:
                conn.close()
                return jsonify({"res": 200, "details":res[0]})
            else:
                conn.close()
                return jsonify({"res":401})
        else:
            conn.close()
            return jsonify({"res": 400})

@app.route("/api/fetchAttendance", methods=["POST"])
def fetchAttendance():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()

    data = request.get_json()
    s_id = data.get("s_id", "")

    res = cur.execute("SELECT l_id, Attend FROM attendence WHERE s_id = ?",(s_id,)).fetchall()
    attendance = []
    attended = 0
    for i in res:
        if i[1] == 'True':
            attended = attended + 1

        lesson_name = cur.execute("SELECT l_name FROM lessons WHERE l_id = ?",(i[0],)).fetchall()
        attendance.append((lesson_name[0][0], i[1]))

    overall_attendance =  (attended / len(res)) * 100
    print(overall_attendance)
    print (attendance)


    return jsonify({"res": 200, "Overall":overall_attendance, "Attendance":attendance})

@app.route("/api/addMaterials", methods=["POST"])
def addMaterials():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()

    data = request.get_json()
    m_name = data.get("m_name", "")
    title = data.get("title", "")
    l_id = data.get("l_id", "")
    l_id = l_id[0]
    c_id = data.get("c_id", "")
    link = data.get("link", "")
    required = [m_name, title, l_id, c_id, link]
    print(required)
    

    if any(not field for field in required):
        conn.close()
        return jsonify({"res": 400})
    else:
        cur.execute("INSERT INTO materials (m_name, title, l_id, c_id, link) VALUES (?, ?, ?, ?, ?)",(m_name, title, l_id, c_id, link))
        conn.commit()
        conn.close()
        return jsonify({"res": 201})
        
@app.route("/api/fetchMaterials", methods=["POST"])
def fetchMaterials():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    data = request.get_json()
    s_id = data.get("s_id", "")  

    c_id_row = cur.execute("SELECT c_id FROM enrolment WHERE s_id = ?",(s_id,)).fetchall() 
    c_id = c_id_row[0][0]

    materials = cur.execute("SELECT * FROM materials WHERE c_id = ? ",(c_id,)).fetchall() 
    print(materials)

    grouped = {}
    for row in materials:
        title = row["title"]
        grouped.setdefault(title, []).append(dict(row))
    conn.close()

    print(grouped)

    return({"materials": grouped})

if __name__ == ("__main__"):
    app.run()