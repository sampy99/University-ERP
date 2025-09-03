// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import { api } from '../api';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Fetch enrolled courses
    api.get("/api/student/dashboard").then(r => setCourses(r.data));
    
    // Fetch results
    api.get("/api/student/results").then(r => setResults(r.data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
      
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">My Enrolled Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Upcoming Assignments</h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-3">
              <div className="flex justify-between">
                <h3 className="font-medium">Programming Assignment 3</h3>
                <span className="text-sm text-gray-500">Due: Tomorrow</span>
              </div>
              <p className="text-sm text-gray-600">CS101 - Introduction to Programming</p>
            </li>
            <li className="py-3">
              <div className="flex justify-between">
                <h3 className="font-medium">Web Project Proposal</h3>
                <span className="text-sm text-gray-500">Due: 5 days</span>
              </div>
              <p className="text-sm text-gray-600">CS301 - Web Development</p>
            </li>
          </ul>
        </section>
        
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Course</th>
                  <th className="px-4 py-2">Grade</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 3).map(result => (
                  <tr key={result.id} className="bg-white border-b">
                    <td className="px-4 py-2 font-medium text-gray-900">{result.course?.code}</td>
                    <td className="px-4 py-2">{result.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;