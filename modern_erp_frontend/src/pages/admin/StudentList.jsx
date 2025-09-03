// pages/admin/StudentList.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import UserTable from '../../components/UserTable';

const StudentList = () => {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  // Fetch students when page changes
  useEffect(() => {
    fetchStudents();
  }, [currentPage]);

  // Fetch students with search term after user stops typing
  useEffect(() => {
    if (searchTerm !== undefined) {
      const timeoutId = setTimeout(() => {
        setCurrentPage(0);
        fetchStudents();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        size: itemsPerPage,
        ...(searchTerm && { searchText: searchTerm })
      };

      const response = await api.get('/api/student/getAll', { params });
      
      // Handle empty or null response
      if (!response.data) {
        setStudents([]);
        setTotalPages(0);
        setTotalElements(0);
        return;
      }

      // Handle both Page response and array response
      const content = response.data.content || response.data;
      const totalPages = response.data.totalPages || 1;
      const totalElements = response.data.totalElements || (Array.isArray(content) ? content.length : 0);

      setStudents(Array.isArray(content) ? content : []);
      setTotalPages(totalPages);
      setTotalElements(totalElements);

    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students. Please try again.');
      setStudents([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Students</h1>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search students by name, email, or student number..."
              value={searchTerm}
              onChange={handleSearch}
              className="border border-gray-300 rounded-lg p-2.5 w-full"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* No Data Found Message */}
      {!loading && !error && students.length === 0 && (
        <div className="mb-6 p-6 text-center bg-gray-50 rounded-lg">
          <div className="text-gray-500 text-lg mb-2">
            <i className="fas fa-user-graduate text-3xl mb-3"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {searchTerm ? 'No matching students found' : 'No students found'}
          </h3>
        </div>
      )}

      {/* User Table (only show if there are students) */}
      {students.length > 0 && (
        <UserTable 
          users={students} 
          userType="student"
          onUpdate={fetchStudents}
          onDelete={fetchStudents}
        />
      )}

      {/* Pagination (only show if there are multiple pages) */}
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
    </div>
  );
}

export default StudentList;
