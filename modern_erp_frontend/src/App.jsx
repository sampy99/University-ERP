import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Import the new student pages
import StudentCourses from "./pages/student/StudentCourses";
import StudentEnroll from "./pages/student/StudentEnroll";
import StudentResults from "./pages/student/StudentResults";
import StudentProfile from "./pages/student/StudentProfile";
import StudentCourseDetail from "./pages/student/StudentCourseDetail";

// Import the new lecturer pages
import LecturerCourses from "./pages/lecturer/LecturerCourses";
import CourseDetail from "./pages/lecturer/CourseDetails";
import Communications from "./pages/lecturer/Communications";
import LecturerProfile from "./pages/lecturer/LecturerProfile";

// Import the new admin pages
import AdminProfile from "./pages/admin/AdminProfile";
import AdminList from "./pages/admin/AdminList";
import LecturerList from "./pages/admin/LecturerList";
import StudentList from "./pages/admin/StudentList";
import CreateUser from "./pages/admin/CreateUser";
import CourseManagement from "./pages/admin/CourseManagement";
import ResultManagement from "./pages/admin/ResultManagement";

// Import layouts
import StudentLayout from "./components/StudentLayout";
import LecturerLayout from "./components/LecturerLayout";
import AdminLayout from "./components/AdminLayout";
import Landing from "./pages/Landing";

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    
    if (token && role) {
      setUserRole(role);
      
      // Redirect to appropriate dashboard if accessing root
      if (window.location.pathname === '/') {
        switch (role) {
          case 'STUDENT':
            navigate('/student/courses');
            break;
          case 'LECTURER':
            navigate('/lecturer/dashboard');
            break;
          case 'ADMIN':
            navigate('/admin/profile');
            break;
          default:
            // Stay on landing page for unknown roles
        }
      }
    }
  }, [navigate]);

  // Add protected route wrapper component
  const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    
    if (!token) {
      return <Navigate to="/login" />;
    }
    
    if (requiredRole && role !== requiredRole) {
      // If user doesn't have the required role, redirect to their dashboard
      switch (role) {
        case 'STUDENT':
          return <Navigate to="/student/courses" />;
        case 'LECTURER':
          return <Navigate to="/lecturer/dashboard" />;
        case 'ADMIN':
          return <Navigate to="/admin/profile" />;
        default:
          return <Navigate to="/" />;
      }
    }
    
    return children;
  };

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Landing page route - no NavBar */}
        <Route path="/" element={
          <div className="min-h-screen">
            <NavBar />
            <Landing />
          </div>
        } />
        
        {/* Login and Signup routes - no container */}
        <Route path="/login" element={
          <div className="min-h-screen">
            <NavBar />
            <Login />
          </div>
        } />
        
        <Route path="/signup" element={
          <div className="min-h-screen">
            <NavBar />
            <Signup />
          </div>
        } />
        
        {/* All other routes - with container */}
        <Route path="*" element={
          <div className="min-h-screen">
            <NavBar />
            <div className="max-w-7xl mx-auto p-4">
              <Routes>
                {/* Student routes with protection */}
                <Route path="/student/*" element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <StudentLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="courses" />} />
                  <Route path="courses" element={<StudentCourses />} />
                  <Route path="courses/:courseId" element={<StudentCourseDetail />} />
                  <Route path="enroll" element={<StudentEnroll />} />
                  <Route path="results" element={<StudentResults />} />
                  <Route path="profile" element={<StudentProfile />} />
                </Route>
                
                {/* Lecturer routes with protection */}
                <Route path="/lecturer/*" element={
                  <ProtectedRoute requiredRole="LECTURER">
                    <LecturerLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="dashboard" />} />
                  <Route path="dashboard" element={<LecturerDashboard />} />
                  <Route path="courses" element={<LecturerCourses />} />
                  <Route path="courses/:courseId" element={<CourseDetail />} />
                  <Route path="communications" element={<Communications />} />
                  <Route path="profile" element={<LecturerProfile />} />
                </Route>
                
                {/* Admin routes with protection */}
                <Route path="/admin/*" element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="profile" />} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="admins" element={<AdminList />} />
                  <Route path="lecturers" element={<LecturerList />} />
                  <Route path="students" element={<StudentList />} />
                  <Route path="create-user" element={<CreateUser />} />
                  <Route path="courses" element={<CourseManagement />} />
                  <Route path="results" element={<ResultManagement />} />
                </Route>
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}