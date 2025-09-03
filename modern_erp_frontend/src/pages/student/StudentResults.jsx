// pages/student/StudentResults.jsx
import React, { useState, useEffect } from "react";
import { api } from "../../api";

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [groupedResults, setGroupedResults] = useState({});
  const [gpa, setGpa] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);

  useEffect(() => {
    api.get("/api/student/results").then(response => {
      const resultsData = response.data;
      setResults(resultsData);
      
      // Group results by semester
      const grouped = groupResultsBySemester(resultsData);
      setGroupedResults(grouped);
      
      // Calculate GPA and total credits
      const { calculatedGpa, calculatedTotalCredits } = calculateGpa(resultsData);
      setGpa(calculatedGpa);
      setTotalCredits(calculatedTotalCredits);
    });
  }, []);

  // Group results by semester
  const groupResultsBySemester = (results) => {
    const grouped = {};
    
    results.forEach(result => {
      const semester = result.course?.semester || 'Unknown';
      if (!grouped[semester]) {
        grouped[semester] = [];
      }
      grouped[semester].push(result);
    });
    
    // Sort semesters in order
    const semesterOrder = {
      'FIRST': 1, 'First': 1,
      'SECOND': 2, 'Second': 2,
      'THIRD': 3, 'Third': 3,
      'FOURTH': 4, 'Fourth': 4,
      'FIFTH': 5, 'Fifth': 5,
      'SIXTH': 6, 'Sixth': 6,
      'SEVENTH': 7, 'Seventh': 7,
      'EIGHTH': 8, 'Eighth': 8,
      'Unknown': 9
    };
    
    // Sort each semester's results by course code
    Object.keys(grouped).forEach(semester => {
      grouped[semester].sort((a, b) => 
        (a.course?.code || '').localeCompare(b.course?.code || '')
      );
    });
    
    // Sort semesters
    const sortedGrouped = {};
    Object.keys(grouped)
      .sort((a, b) => (semesterOrder[a] || 99) - (semesterOrder[b] || 99))
      .forEach(key => {
        sortedGrouped[key] = grouped[key];
      });
    
    return sortedGrouped;
  };

  // Calculate GPA based on grades and credits
  const calculateGpa = (results) => {
    let totalGradePoints = 0;
    let totalCredits = 0;
    
    const gradePoints = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'E': 0.5, 'F': 0.0
    };
    
    results.forEach(result => {
      if (result.grade && result.course?.credits) {
        const gradePoint = gradePoints[result.grade] || 0;
        totalGradePoints += gradePoint * result.course.credits;
        totalCredits += result.course.credits;
      }
    });
    
    const calculatedGpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
    return { calculatedGpa, calculatedTotalCredits: totalCredits };
  };

  // Format semester name for display
  const formatSemesterName = (semester) => {
    const semesterMap = {
      'FIRST': 'First Semester',
      'First': 'First Semester',
      'SECOND': 'Second Semester', 
      'Second': 'Second Semester',
      'THIRD': 'Third Semester',
      'Third': 'Third Semester',
      'FOURTH': 'Fourth Semester',
      'Fourth': 'Fourth Semester',
      'FIFTH': 'Fifth Semester',
      'Fifth': 'Fifth Semester',
      'SIXTH': 'Sixth Semester',
      'Sixth': 'Sixth Semester',
      'SEVENTH': 'Seventh Semester',
      'Seventh': 'Seventh Semester',
      'EIGHTH': 'Eighth Semester',
      'Eighth': 'Eighth Semester',
      'Unknown': 'Other Courses'
    };
    
    return semesterMap[semester] || semester;
  };

  // Get grade color based on grade
  const getGradeColor = (grade) => {
    if (!grade) return 'text-gray-600';
    
    if (['A+', 'A', 'A-'].includes(grade)) return 'text-green-600 font-medium';
    if (['B+', 'B', 'B-'].includes(grade)) return 'text-blue-600 font-medium';
    if (['C+', 'C', 'C-'].includes(grade)) return 'text-yellow-600 font-medium';
    if (['D+', 'D'].includes(grade)) return 'text-orange-600 font-medium';
    if (['E', 'F'].includes(grade)) return 'text-red-600 font-medium';
    
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Academic Results</h1>
      
      {/* Statistics Cards */}
      <div className="flex flex-wrap gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg min-w-[150px] flex-1">
          <h3 className="text-sm font-medium text-blue-800 mb-2">GPA</h3>
          <p className="text-2xl font-bold text-blue-600">{gpa}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg min-w-[150px] flex-1">
          <h3 className="text-sm font-medium text-green-800 mb-2">Total Credits</h3>
          <p className="text-2xl font-bold text-green-600">{totalCredits}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg min-w-[150px] flex-1">
          <h3 className="text-sm font-medium text-purple-800 mb-2">Completed Courses</h3>
          <p className="text-2xl font-bold text-purple-600">{results.length}</p>
        </div>
      </div>
      
      {/* Results by Semester */}
      {Object.keys(groupedResults).length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-graduation-cap text-4xl mb-4 text-gray-300"></i>
          <p>No results available yet.</p>
        </div>
      ) : (
        Object.entries(groupedResults).map(([semester, semesterResults]) => (
          <div key={semester} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 bg-gray-50 p-3 rounded-lg">
              {formatSemesterName(semester)}
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({semesterResults.length} course{semesterResults.length !== 1 ? 's' : ''})
              </span>
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600 mb-6">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-3">Course Code</th>
                    <th className="px-4 py-3">Course Title</th>
                    <th className="px-4 py-3">Credits</th>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3">Marks</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {semesterResults.map(result => (
                    <tr key={result.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {result.course?.code || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        {result.course?.title || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        {result.course?.credits || result.course?.credits || '0'}
                      </td>
                      <td className={`px-4 py-3 ${getGradeColor(result.grade)}`}>
                        {result.grade || '-'}
                      </td>
                      <td className="px-4 py-3">
                        {result.marks ? `${result.marks}` : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          result.grade ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {result.grade ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Semester Summary */}
                  {semesterResults.some(result => result.grade) && (
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan="2" className="px-4 py-3 text-right">
                        Semester GPA:
                      </td>
                      <td className="px-4 py-3">
                        {calculateGpa(semesterResults).calculatedGpa}
                      </td>
                      <td colSpan="3" className="px-4 py-3">
                        Total Credits: {calculateGpa(semesterResults).calculatedTotalCredits}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
      
      {/* Overall Summary */}
      {results.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Overall Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-blue-600">Total GPA: </span>
              <span className="font-semibold">{gpa}</span>
            </div>
            <div>
              <span className="text-sm text-blue-600">Total Credits: </span>
              <span className="font-semibold">{totalCredits}</span>
            </div>
            <div>
              <span className="text-sm text-blue-600">Completed Courses: </span>
              <span className="font-semibold">{results.filter(r => r.grade).length}</span>
            </div>
            <div>
              <span className="text-sm text-blue-600">In Progress: </span>
              <span className="font-semibold">{results.filter(r => !r.grade).length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentResults;