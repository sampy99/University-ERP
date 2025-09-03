// pages/admin/CourseManagement.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../../api';

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [unassignedCourses, setUnassignedCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [form, setForm] = useState({ 
    code: "", 
    title: "", 
    description: "",
    credits: "",
    semester: "",
    lecturerId: "" 
  });
  const [assign, setAssign] = useState({ courseId: "", lecturerId: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Pagination states for lecturers dropdown
  const [lecturerPage, setLecturerPage] = useState(0);
  const [lecturerTotalPages, setLecturerTotalPages] = useState(0);
  const [lecturerSearch, setLecturerSearch] = useState('');

  // Pagination states for courses dropdown
  const [coursePage, setCoursePage] = useState(0);
  const [courseTotalPages, setCourseTotalPages] = useState(0);
  const [courseSearch, setCourseSearch] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    refresh();
    fetchUnassignedCourses();
  }, []);

  const refresh = async () => {
    try {
      setLoading(true);
      const [c, l] = await Promise.all([
        api.get("/api/course"),
        fetchLecturersList(0, '') // Initial fetch for create course dropdown
      ]);
      setCourses(c.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedCourses = async (page = 0, searchText = '') => {
    try {
      const params = {
        page,
        size: itemsPerPage,
        ...(searchText && { searchText })
      };
      const response = await api.get("/api/course/unassigned", { params });
      if (response.data) {
        setUnassignedCourses(response.data.content || []);
        setCourseTotalPages(response.data.totalPages || 0);
      } else {
        setUnassignedCourses([]);
        setCourseTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching unassigned courses:', error);
      setUnassignedCourses([]);
    }
  };

  const fetchLecturersList = async (page = 0, searchText = '') => {
    try {
      const params = {
        page,
        size: itemsPerPage,
        ...(searchText && { searchText })
      };
      const response = await api.get("/api/lecturer/getAll", { params });
      if (response.data) {
        setLecturers(response.data.content || []);
        setLecturerTotalPages(response.data.totalPages || 0);
      } else {
        setLecturers([]);
        setLecturerTotalPages(0);
      }
      return response.data?.content || [];
    } catch (error) {
      console.error('Error fetching lecturers:', error);
      setLecturers([]);
      setLecturerTotalPages(0);
      return [];
    }
  };

  const handleLecturerSearch = async (searchText) => {
    setLecturerSearch(searchText);
    setLecturerPage(0);
    await fetchLecturersList(0, searchText);
  };

  const handleCourseSearch = async (searchText) => {
    setCourseSearch(searchText);
    setCoursePage(0);
    await fetchUnassignedCourses(0, searchText);
  };

  const loadMoreLecturers = async () => {
    if (lecturerPage < lecturerTotalPages - 1) {
      const nextPage = lecturerPage + 1;
      setLecturerPage(nextPage);
      const newLecturers = await fetchLecturersList(nextPage, lecturerSearch);
      setLecturers(prev => [...prev, ...newLecturers]);
    }
  };

  const loadMoreCourses = async () => {
    if (coursePage < courseTotalPages - 1) {
      const nextPage = coursePage + 1;
      setCoursePage(nextPage);
      await fetchUnassignedCourses(nextPage, courseSearch);
    }
  };

  const createCourse = async () => {
    if (!form.code || !form.title || !form.credits || !form.semester) {
      setMessage('Please fill in all required fields');
      return;
    }

    if (form.description && form.description.length > 250) {
      setMessage('Description must be 250 characters or less');
      return;
    }

    try {
      await api.post("/api/admin/course", { 
        ...form, 
        credits: parseInt(form.credits),
        lecturerId: form.lecturerId || null 
      });
      setForm({ 
        code: "", 
        title: "", 
        description: "",
        credits: "",
        semester: "",
        lecturerId: "" 
      });
      setMessage('Course created successfully!');
      refresh();
      fetchUnassignedCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      setMessage('Error creating course: ' + (error.response?.data?.message || error.message));
    }
  };

  const assignLecturer = async () => {
    if (!assign.courseId || !assign.lecturerId) {
      setMessage('Please select both course and lecturer');
      return;
    }

    try {
      await api.post("/api/admin/course/assign", { 
        courseId: Number(assign.courseId), 
        lecturerId: Number(assign.lecturerId) 
      });
      setAssign({ courseId: "", lecturerId: "" });
      setMessage('Lecturer assigned successfully!');
      refresh();
      fetchUnassignedCourses();
      fetchLecturersList(); // Refresh lecturers list
    } catch (error) {
      console.error('Error assigning lecturer:', error);
      setMessage('Error assigning lecturer: ' + (error.response?.data?.message || error.message));
    }
  };

  const semesterOptions = [
    { value: 'FIRST', label: 'First Semester' },
    { value: 'SECOND', label: 'Second Semester' },
    { value: 'THIRD', label: 'Third Semester' },
    { value: 'FOURTH', label: 'Fourth Semester' },
    { value: 'FIFTH', label: 'Fifth Semester' },
    { value: 'SIXTH', label: 'Sixth Semester' },
    { value: 'SEVENTH', label: 'Seventh Semester' },
    { value: 'EIGHTH', label: 'Eighth Semester' }
  ];

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
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Course Management</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Course Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-blue-800">Create Course Unit</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Code *</label>
                <input 
                  className="border border-gray-300 rounded-lg p-2.5 w-full" 
                  placeholder="e.g., CS101" 
                  value={form.code} 
                  onChange={e => setForm({...form, code: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                <input 
                  className="border border-gray-300 rounded-lg p-2.5 w-full" 
                  placeholder="e.g., Introduction to Programming" 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  className="border border-gray-300 rounded-lg p-2.5 w-full" 
                  placeholder="Course description (max 250 characters)"
                  rows={3}
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})}
                  maxLength={250}
                />
                <div className="text-xs text-gray-500 text-right mt-1">
                  {form.description.length}/250 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credits *</label>
                <input 
                  type="number"
                  className="border border-gray-300 rounded-lg p-2.5 w-full" 
                  placeholder="e.g., 3"
                  min="1"
                  value={form.credits} 
                  onChange={e => setForm({...form, credits: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
                <select 
                  className="border border-gray-300 rounded-lg p-2.5 w-full" 
                  value={form.semester} 
                  onChange={e => setForm({...form, semester: e.target.value})}
                >
                  <option value="">Select Semester</option>
                  {semesterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Lecturer (Optional)</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Search lecturers..."
                    className="border border-gray-300 rounded-lg p-2.5 w-full"
                    onChange={(e) => handleLecturerSearch(e.target.value)}
                  />
                  <select 
                    className="border border-gray-300 rounded-lg p-2.5 w-full" 
                    value={form.lecturerId} 
                    onChange={e => setForm({...form, lecturerId: e.target.value})}
                  >
                    <option value="">Select Lecturer (Optional)</option>
                    {lecturers.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.firstName} {u.lastName} ({u.staffNumber})
                      </option>
                    ))}
                  </select>
                  {lecturerPage < lecturerTotalPages - 1 && (
                    <button
                      type="button"
                      onClick={loadMoreLecturers}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Load more lecturers...
                    </button>
                  )}
                </div>
              </div>
              
              <button 
                onClick={createCourse} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-2.5 w-full"
              >
                <i className="fas fa-plus mr-2"></i>Create Course
              </button>
            </div>
          </div>

          {/* Assign Lecturer Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-blue-800">Assign Lecturer to Course</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Course *</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Search unassigned courses..."
                    className="border border-gray-300 rounded-lg p-2.5 w-full"
                    onChange={(e) => handleCourseSearch(e.target.value)}
                  />
                  <select 
                    className="border border-gray-300 rounded-lg p-2.5 w-full" 
                    value={assign.courseId} 
                    onChange={e => setAssign({...assign, courseId: e.target.value})}
                  >
                    <option value="">Select Course</option>
                    {unassignedCourses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.title}
                      </option>
                    ))}
                  </select>
                  {coursePage < courseTotalPages - 1 && (
                    <button
                      type="button"
                      onClick={loadMoreCourses}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Load more courses...
                    </button>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Lecturer *</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Search lecturers..."
                    className="border border-gray-300 rounded-lg p-2.5 w-full"
                    onChange={(e) => handleLecturerSearch(e.target.value)}
                  />
                  <select 
                    className="border border-gray-300 rounded-lg p-2.5 w-full" 
                    value={assign.lecturerId} 
                    onChange={e => setAssign({...assign, lecturerId: e.target.value})}
                  >
                    <option value="">Select Lecturer</option>
                    {lecturers.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.firstName} {u.lastName} ({u.staffNumber})
                      </option>
                    ))}
                  </select>
                  {lecturerPage < lecturerTotalPages - 1 && (
                    <button
                      type="button"
                      onClick={loadMoreLecturers}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Load more lecturers...
                    </button>
                  )}
                </div>
              </div>
              
              <button 
                onClick={assignLecturer} 
                className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-6 py-2.5 w-full"
              >
                <i className="fas fa-link mr-2"></i>Assign Lecturer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course List Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Course List</h2>
        
        {courses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No courses available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-700">Code</th>
                  <th className="text-left p-3 font-medium text-gray-700">Title</th>
                  <th className="text-left p-3 font-medium text-gray-700">Credits</th>
                  <th className="text-left p-3 font-medium text-gray-700">Semester</th>
                  <th className="text-left p-3 font-medium text-gray-700">Lecturer</th>
                  <th className="text-left p-3 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{course.code}</td>
                    <td className="p-3">{course.title}</td>
                    <td className="p-3">{course.credits}</td>
                    <td className="p-3">{course.semester}</td>
                    <td className="p-3">
                      {course.lecturer ? 
                        `${course.lecturer.firstName} ${course.lecturer.lastName}` : 
                        <span className="text-gray-400">Not assigned</span>
                      }
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        course.lecturer ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.lecturer ? 'Assigned' : 'Unassigned'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}