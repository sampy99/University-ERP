// components/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName') || localStorage.getItem('username');
  
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <i className="fas fa-graduation-cap text-white text-xl"></i>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-800">University ERP</span>
            </div>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Sign In
            </Link>
            
          </div>
        </div>
      </header>
      </div>
    </nav>
  );
}