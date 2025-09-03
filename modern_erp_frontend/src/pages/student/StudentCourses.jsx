// pages/student/StudentCourses.jsx
import React, { useState, useEffect } from "react";
import CourseCard from "../../components/CourseCard";
import { api } from "../../api";

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    
    api.get("/api/student/dashboard").then(r => setCourses(r.data));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">My Enrolled Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default StudentCourses;