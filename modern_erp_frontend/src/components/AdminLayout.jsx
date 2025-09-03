// components/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userName, setUserName] = useState('');
  const [username, setUsername] = useState('');

  const menuItems = [
    { path: "/admin/profile", icon: "fas fa-user", label: "My Profile" },
    { path: "/admin/admins", icon: "fas fa-users-cog", label: "Admins" },
    { path: "/admin/lecturers", icon: "fas fa-chalkboard-teacher", label: "Lecturers" },
    { path: "/admin/students", icon: "fas fa-user-graduate", label: "Students" },
    { path: "/admin/create-user", icon: "fas fa-user-plus", label: "Create User" },
    { path: "/admin/courses", icon: "fas fa-book", label: "Courses Management" },
    { path: "/admin/results", icon: "fas fa-chart-bar", label: "Results Management" },
  ];

  // Load user info on component mount
  useEffect(() => {
    const name = localStorage.getItem('userName') || '';
    const user = localStorage.getItem('username') || '';
    setUserName(name);
    setUsername(user);

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Handle window resize to detect mobile devices
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle logout - UPDATED to redirect to landing page
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('username');
    navigate('/'); // Changed from '/login' to '/' for landing page
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when a link is clicked (useful for mobile)
  const handleLinkClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6">
      {/* Mobile menu button */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-lg"
      >
        <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Sidebar Navigation */}
      <div 
        className={`fixed md:relative w-64 bg-white rounded-lg shadow p-4 z-40 h-full md:h-auto transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-4 flex items-center">
          <i className="fas fa-cogs text-2xl text-blue-600"></i>
          <span className="ml-3 text-xl font-bold">Admin Portal</span>
        </div>
        
        {/* User info and logout - UPDATED to match LecturerLayout */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col space-y-3">
            <div>
              <p className="font-medium text-gray-800">{userName || username || 'Administrator'}</p>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-full py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-gray-200"
            >
              <i className="fas fa-sign-out-alt text-lg mr-2"></i>
              <span className="text-sm font-medium">Log out</span>
            </button>
          </div>
        </div>
        
        <ul className="mt-6">
          {menuItems.map(item => (
            <li key={item.path} className="mb-2">
              <Link
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center p-3 rounded-lg ${location.pathname === item.path ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              >
                <i className={`${item.icon} w-5`}></i>
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-0 mt-12 md:mt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;