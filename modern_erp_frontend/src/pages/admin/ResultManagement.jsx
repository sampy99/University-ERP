// pages/admin/ResultManagement.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import ResultForm from '../../components/ResultForm';

export default function ResultManagement() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // Changed to 0-based
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/api/course');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledStudents = async (courseId, page = 0, size = 10) => {
    try {
      setLoading(true);
      const params = {
        page,
        size
      };
      
      const response = await api.get(`/api/course/enrolled-students/${courseId}`, { params });
      
      // Handle Page response structure - check if response.data exists
      if (response.data) {
        setEnrolledStudents(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalElements(response.data.totalElements || 0);
      } else {
        // Handle no content response
        setEnrolledStudents([]);
        setTotalPages(0);
        setTotalElements(0);
      }
      setSelectedCourse(courseId);
      setCurrentPage(page);
      
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
      setEnrolledStudents([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchEnrolledStudents(selectedCourse, newPage, itemsPerPage);
  };

  if (loading && !selectedCourse) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Result Management</h1>
        
        {/* Course Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-blue-800">Select Course</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div
                key={course.id}
                className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedCourse === course.id ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
                }`}
                onClick={() => fetchEnrolledStudents(course.id, 0, itemsPerPage)}
              >
                <h4 className="font-semibold text-gray-800">{course.code}</h4>
                <p className="text-sm text-gray-600 mt-1">{course.title}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Lecturer: {course.lecturer ? 
                    `${course.lecturer.firstName} ${course.lecturer.lastName}` : 
                    'Not assigned'
                  }
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Enrolled Students Table */}
        {selectedCourse && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-blue-800">
              Enrolled Students - {courses.find(c => c.id === selectedCourse)?.code}
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : enrolledStudents.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <i className="fas fa-users text-3xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">No students enrolled in this course.</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <span className="text-sm text-gray-600">
                    Showing {enrolledStudents.length} of {totalElements} students
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-medium text-gray-700">Student Number</th>
                        <th className="text-left p-3 font-medium text-gray-700">Name</th>
                        <th className="text-left p-3 font-medium text-gray-700">E-mail</th>
                        <th className="text-left p-3 font-medium text-gray-700">Grade</th>
                        <th className="text-left p-3 font-medium text-gray-700">Marks</th>
                        <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrolledStudents.map(student => (
                        <tr key={student.id} className="border-t hover:bg-gray-50">
                          <td className="p-3">{student.studentNumber}</td>
                          <td className="p-3 font-medium">{student.firstName} {student.lastName}</td>
                          <td className="p-3">{student.email}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              student.result?.grade ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {student.result?.grade || 'Not graded'}
                            </span>
                          </td>
                          <td className="p-3">{student.result?.marks || '-'}</td>
                          <td className="p-3">
                            <ResultForm 
                              student={student} 
                              courseId={selectedCourse}
                              onSuccess={() => fetchEnrolledStudents(selectedCourse, currentPage, itemsPerPage)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination - Server-side */}
                {totalPages > 1 && (
                  <div className="mt-6 flex justify-between items-center">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
                    >
                      <i className="fas fa-chevron-left mr-2"></i>Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                      className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
                    >
                      Next<i className="fas fa-chevron-right ml-2"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}