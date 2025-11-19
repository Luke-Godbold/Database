CREATE TABLE students(
    s_id INTEGER PRIMARY KEY AUTOINCREMENT,
    s_name TEXT NOT NULL,
    email TEXT NOT NULL,
    dob DATE NOT NULL,
    pass TEXT NOT NULL
);

CREATE TABLE teachers(
    t_id INTEGER PRIMARY KEY AUTOINCREMENT,
    t_name TEXT NOT NULL,
    email TEXT NOT NULL,
    pass TEXT NOT NULL
);

CREATE TABLE parents(
    p_id INTEGER PRIMARY KEY AUTOINCREMENT,
    p_name TEXT NOT NULL,
    email TEXT NOT NULL,
    pass TEXT NOT NULL
);

CREATE TABLE courses(
    c_id INTEGER PRIMARY KEY AUTOINCREMENT,
    c_name TEXT NOT NULL
);

CREATE TABLE ct(
    ct_id INTEGER PRIMARY KEY AUTOINCREMENT,
    t_id INTEGER NOT NULL,
    C_id INTEGER NOT NULL,
    FOREIGN KEY (t_id) REFERENCES teachers(t_id),
    FOREIGN KEY (c_id) REFERENCES courses(c_id)
);

CREATE TABLE enrolment(
    e_id INTEGER PRIMARY KEY AUTOINCREMENT,
    s_id INTEGER NOT NULL,
    c_id INTEGER NOT NULL,
    FOREIGN KEY (s_id) REFERENCES students(s_id),
    FOREIGN KEY (c_id) REFERENCES courses(c_id)
);

CREATE TABLE sp(
    e_id INTEGER PRIMARY KEY AUTOINCREMENT,
    s_id INTEGER NOT NULL,
    p_id INTEGER NOT NULL,
    FOREIGN KEY (s_id) REFERENCES students(s_id),
    FOREIGN KEY (p_id) REFERENCES parents(p_id)
);

CREATE TABLE lessons(
    l_id INTEGER PRIMARY KEY AUTOINCREMENT,
    l_name TEXT NOT NULL,
    c_id INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    FOREIGN KEY (c_id) REFERENCES courses(c_id)
);


CREATE TABLE attendence(
    a_id INTEGER PRIMARY KEY AUTOINCREMENT,
    s_id INTEGER NOT NULL,
    l_id INTEGER NOT NULL,
    Attend BOOLEAN NOT NULL,
    FOREIGN KEY (s_id) REFERENCES students(s_id),
    FOREIGN KEY (l_id) REFERENCES lessons(l_id)
);

CREATE TABLE materials(
    m_id INTEGER PRIMARY KEY AUTOINCREMENT,
    m_name TEXT NOT NULL,
    title TEXT NOT NULL,
    l_id INTEGER NOT NULL,
    c_id INTEGER NOT NULL,  
    link TEXT NOT NULL,
    FOREIGN KEY (l_id) REFERENCES lessons(l_id)
    FOREIGN KEY (c_id) REFERENCES courses(c_id)
);

INSERT INTO students (s_name, email, dob, pass) VALUES ('Thomas Stokes', 'Thomas@email', '09/12/2005', '1234');
INSERT INTO students (s_name, email, dob, pass) VALUES ('Luke Godbold', 'Luke@email', '17/12/2007', '4321');
INSERT INTO students (s_name, email, dob, pass) VALUES ('Tuoyo Bes', 'Tuoyo@email', '09/05/2006', '1234');
INSERT INTO students (s_name, email, dob, pass) VALUES ('Darrel Naw', 'Darrel@email', '06/2/2008', '1234');

INSERT INTO courses (c_name) VALUES ('Software Development');
INSERT INTO courses (c_name) VALUES ('Games Y1');

INSERT INTO enrolment (s_id, c_id) VALUES (1, 1);

INSERT INTO teachers (t_name, email, pass) VALUES ('Owen', 'Owen@email', '1234');

INSERT INTO lessons (l_name, c_id, duration) VALUES ('Frameworks', 1, 2);
INSERT INTO lessons (l_name, c_id, duration) VALUES ('Back-end Dev', 1, 1);

INSERT INTO lessons (l_name, c_id, duration) VALUES ('Games Art', 2, 2);
INSERT INTO lessons (l_name, c_id, duration) VALUES ('Unity', 2, 1);

DELETE FROM students WHERE s_id = 7