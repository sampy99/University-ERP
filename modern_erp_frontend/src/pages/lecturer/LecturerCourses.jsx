// pages/lecturer/LecturerCourses.jsx
import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { Link } from "react-router-dom";

const LecturerCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        
        const response = await api.get("/api/lecturer/dashboard");
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Teaching Courses</h1>
      
      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <i className="fas fa-book-open text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">No courses assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-transform duration-200 hover:translate-y-[-5px] hover:shadow-lg">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg mb-2">{course.code}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {course.enrolledStudents || 0} Students
                  </span>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">{course.title}</h4>
                <p className="text-sm text-gray-600 mb-3">Semester: {course.semester || 'N/A'}</p>
                <p className="text-sm text-gray-600 mb-4">
                  <i className="far fa-clock mr-2"></i>
                  {course.schedule || 'Schedule to be announced'}
                </p>
                
                <div className="flex justify-between mt-4">
                  <Link 
                    to={`/lecturer/courses/${course.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <i className="fas fa-eye mr-1"></i> View Details
                  </Link>
                  <Link 
                    to={`/lecturer/communications?courseId=${course.id}`}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    <i className="fas fa-envelope mr-1"></i> Email Students
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Remove the parentheses - export the function itself, not its result
export default LecturerCourses;