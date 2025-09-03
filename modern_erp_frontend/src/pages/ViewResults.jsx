// pages/ViewResults.js
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const ViewResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    api.get("/api/student/results").then(r => setResults(r.data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Academic Results</h1>
      
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg min-w-[150px]">
            <h3 className="text-sm font-medium text-blue-800">GPA</h3>
            <p className="text-2xl font-bold text-blue-600">3.8</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg min-w-[150px]">
            <h3 className="text-sm font-medium text-green-800">Completed Courses</h3>
            <p className="text-2xl font-bold text-green-600">{results.length}</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3">Course Code</th>
                <th className="px-4 py-3">Course Title</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Marks</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result.id} className="bg-white border-b">
                  <td className="px-4 py-3 font-medium text-gray-900">{result.course?.code}</td>
                  <td className="px-4 py-3">{result.course?.title}</td>
                  <td className="px-4 py-3 font-medium text-green-600">{result.grade}</td>
                  <td className="px-4 py-3">{result.marks ?? '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      result.grade ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {result.grade ? 'Completed' : 'In Progress'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewResults;