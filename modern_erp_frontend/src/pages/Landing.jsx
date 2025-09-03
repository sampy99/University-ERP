// pages/Landing.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Hero Section - Full screen with light blue background */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center w-full max-w-7xl">
          {/* Animated Welcome Text */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-fade-in">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                University ERP
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
              Streamline your academic journey with our comprehensive Education Resource Platform. 
              Manage courses, track progress, and connect with your educational community.
            </p>
          </div>

          {/* Stats Cards - With less opacity to show more of the blue background */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/30">
              <div className="text-3xl font-bold text-blue-600 mb-2">5000+</div>
              <div className="text-gray-700">Active Students</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/30">
              <div className="text-3xl font-bold text-green-600 mb-2">200+</div>
              <div className="text-gray-700">Expert Lecturers</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/30">
              <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-gray-700">Courses Available</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Get Started Now
            </Link>
          </div>

          {/* Features Grid - With less opacity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-book text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Course Management</h3>
              <p className="text-gray-700">Access and manage all your courses in one place with intuitive tools.</p>
            </div>
            
            <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Progress Tracking</h3>
              <p className="text-gray-700">Monitor your academic progress and results with detailed analytics.</p>
            </div>
            
            <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Community</h3>
              <p className="text-gray-700">Connect with lecturers and fellow students for collaborative learning.</p>
            </div>
          </div>

          {/* Testimonial - With less opacity */}
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/30 max-w-3xl mx-auto">
            <div className="text-center">
              <i className="fas fa-quote-left text-3xl text-gray-400 mb-4"></i>
              <p className="text-lg text-gray-700 italic mb-4">
                "This platform has transformed how I manage my studies. Everything I need is in one place, 
                from course materials to results tracking. Highly recommended!"
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  JS
                </div>
                <div className="ml-4 text-left">
                  <div className="font-semibold text-gray-800">John Smith</div>
                  <div className="text-sm text-gray-600">Computer Science Student</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - With less opacity */}
      <footer className="bg-white/70 backdrop-blur-sm border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <i className="fas fa-graduation-cap text-white text-xl"></i>
              </div>
              <span className="ml-3 text-lg font-semibold text-gray-800">University ERP System</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                <i className="fab fa-facebook text-lg"></i>
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-400 transition-colors">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-700 transition-colors">
                <i className="fab fa-linkedin text-lg"></i>
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-300 text-center md:text-left">
            <p className="text-sm text-gray-700">
              © 2024 University ERP System. All rights reserved. 
              <span className="block md:inline md:ml-2">Designed for academic excellence.</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Link
          to="/login"
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
        >
          <i className="fas fa-sign-in-alt text-xl"></i>
        </Link>
      </div>

      {/* Add some custom animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 1s ease-out;
          }
        `}
      </style>
    </div>
  );
}