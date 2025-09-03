import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalAdmins: 0,
    totalLecturers: 0,
    totalStudents: 0,
    recentUsers: [],
    recentCourses: []
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [usersRes, coursesRes] = await Promise.all([
        api.get("/api/user"),
        api.get("/api/course")
      ]);

      const users = usersRes.data;
      const courses = coursesRes.data;

      const admins = users.filter(u => u.role === "ADMIN");
      const lecturers = users.filter(u => u.role === "LECTURER");
      const students = users.filter(u => u.role === "USER");

      setStats({
        totalUsers: users.length,
        totalCourses: courses.length,
        totalAdmins: admins.length,
        totalLecturers: lecturers.length,
        totalStudents: students.length,
        recentUsers: users.slice(-5).reverse(), // Last 5 users
        recentCourses: courses.slice(-5).reverse() // Last 5 courses
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchStats(); 
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the administration portal. Manage users, courses, and results from here.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/admins" className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-blue-600">{stats.totalAdmins}</div>
          <div className="text-gray-600 mt-2">Administrators</div>
        </Link>

        <Link to="/admin/lecturers" className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-green-600">{stats.totalLecturers}</div>
          <div className="text-gray-600 mt-2">Lecturers</div>
        </Link>

        <Link to="/admin/students" className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-purple-600">{stats.totalStudents}</div>
          <div className="text-gray-600 mt-2">Students</div>
        </Link>

        <Link to="/admin/courses" className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-orange-600">{stats.totalCourses}</div>
          <div className="text-gray-600 mt-2">Courses</div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/admin/create-user" 
            className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
          >
            <div className="font-semibold">Create User</div>
            <div className="text-sm opacity-90">Add new user account</div>
          </Link>

          <Link 
            to="/admin/courses" 
            className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition-colors"
          >
            <div className="font-semibold">Manage Courses</div>
            <div className="text-sm opacity-90">Create & assign courses</div>
          </Link>

          <Link 
            to="/admin/results" 
            className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition-colors"
          >
            <div className="font-semibold">Update Results</div>
            <div className="text-sm opacity-90">Manage student grades</div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Users</h2>
            <Link to="/admin/create-user" className="text-blue-600 text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{user.username}</div>
                  <div className="text-sm text-gray-600 capitalize">{user.role.toLowerCase()}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                  user.role === 'LECTURER' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
            {stats.recentUsers.length === 0 && (
              <div className="text-center text-gray-500 py-4">No users found</div>
            )}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Courses</h2>
            <Link to="/admin/courses" className="text-blue-600 text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentCourses.map(course => (
              <div key={course.id} className="p-3 bg-gray-50 rounded">
                <div className="font-medium">{course.code} - {course.title}</div>
                <div className="text-sm text-gray-600">
                  Lecturer: {course.lecturer ? 
                    `${course.lecturer.firstName} ${course.lecturer.lastName}` : 
                    'Not assigned'
                  }
                </div>
              </div>
            ))}
            {stats.recentCourses.length === 0 && (
              <div className="text-center text-gray-500 py-4">No courses found</div>
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">✓</div>
            <div className="font-semibold">API Connected</div>
            <div className="text-sm text-gray-600">System operational</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="font-semibold">Total Users</div>
            <div className="text-sm text-gray-600">Active accounts</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.totalCourses}</div>
            <div className="font-semibold">Active Courses</div>
            <div className="text-sm text-gray-600">Current semester</div>
          </div>
        </div>
      </div>
    </div>
  );
}