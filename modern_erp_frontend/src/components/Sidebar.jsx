// components/Sidebar.js
import React from 'react';

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { id: 'enroll', icon: 'fas fa-book-open', label: 'Enroll Courses' },
    { id: 'results', icon: 'fas fa-chart-line', label: 'View Results' },
    { id: 'profile', icon: 'fas fa-user-circle', label: 'My Profile' },
    { id: 'schedule', icon: 'fas fa-calendar-alt', label: 'Schedule' },
    { id: 'messages', icon: 'fas fa-comments', label: 'Messages' },
  ];

  const userRole = localStorage.getItem('userRole') || 'Student';
  const userName = localStorage.getItem('userName') || localStorage.getItem('username') || 'User';

  return (
    <div className="w-80 bg-gradient-to-b from-blue-900 to-purple-900 text-white h-screen fixed shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-blue-700/50">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl shadow-lg">
            <i className="fas fa-graduation-cap text-2xl text-white"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">EduPortal</h1>
            <p className="text-blue-200 text-sm">Student Management System</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-blue-700/50">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-blue-900"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{userName}</h3>
            <p className="text-blue-200 text-sm capitalize">{userRole.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center p-4 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                  activePage === item.id 
                    ? 'bg-white/20 backdrop-blur-sm shadow-lg border border-white/10' 
                    : 'hover:bg-white/10 hover:backdrop-blur-sm'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  activePage === item.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                    : 'bg-white/10 text-blue-200'
                }`}>
                  <i className={item.icon}></i>
                </div>
                <span className="ml-4 font-medium text-white">{item.label}</span>
                
                {activePage === item.id && (
                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Stats */}
      <div className="p-6 border-t border-blue-700/50 mt-auto">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <h4 className="text-blue-200 text-sm font-semibold mb-3">Quick Stats</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-blue-200 text-sm">Enrolled Courses</span>
              <span className="text-white font-semibold">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-200 text-sm">GPA</span>
              <span className="text-white font-semibold">3.8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-200 text-sm">Messages</span>
              <span className="text-white font-semibold">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-blue-700/50">
        <div className="text-center">
          <p className="text-blue-200 text-xs">© 2024 EduPortal</p>
          <p className="text-blue-300 text-xs mt-1">v2.1.0</p>
        </div>
      </div>

      {/* Add some custom styles for better appearance */}
      <style>
        {`
          .sidebar-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
          }
          .sidebar-scroll::-webkit-scrollbar {
            width: 4px;
          }
          .sidebar-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .sidebar-scroll::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
          }
          .sidebar-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}
      </style>
    </div>
  );
};

export default Sidebar;