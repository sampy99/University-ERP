// components/CourseCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link

const CourseCard = ({ course, showEnrollButton = false, onEnrollSuccess, onEnrollError }) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollStatus, setEnrollStatus] = useState(null);

  const handleEnroll = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    
    setIsEnrolling(true);
    setEnrollStatus(null);
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

    const response = await api.post('/api/student/enroll', {
  courseId: course.id
});

      const data = await response.json();

      if (response.ok) {
        setEnrollStatus({ type: 'success', message: 'Enrollment successful!' });
        if (onEnrollSuccess) onEnrollSuccess(course);
      } else {
        throw new Error(data.message || `Enrollment failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      setEnrollStatus({ 
        type: 'error', 
        message: error.message || 'Failed to enroll. Please try again.' 
      });
      if (onEnrollError) onEnrollError(course, error);
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <Link to={`/student/courses/${course.id}`} className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-transform duration-200 hover:translate-y-[-5px] hover:shadow-lg cursor-pointer">
        <div className="p-5">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg mb-2">{course.code}</h3>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
              course.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {course.completed ? 'Completed' : 'Ongoing'}
            </span>
          </div>
          <h4 className="font-medium text-gray-800 mb-2">{course.title}</h4>
          <p className="text-sm text-gray-600 mb-3">Instructor: {course.lecturer?.firstName+" " +course.lecturer?.lastName || 'TBA'}</p>
          <p className="text-sm text-gray-600 mb-4">
            <i className="far fa-clock mr-2"></i>
            {course.schedule || 'Schedule to be announced'}
          </p>
          
          {/* Status message */}
          {enrollStatus && (
            <div className={`mb-4 p-3 rounded text-sm ${
              enrollStatus.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {enrollStatus.message}
            </div>
          )}
          
          {showEnrollButton && (
            <div className="flex justify-end">
              <button 
                onClick={handleEnroll}
                disabled={isEnrolling}
                className={`px-4 py-2 rounded-lg text-sm text-white ${
                  isEnrolling 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isEnrolling ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Enrolling...
                  </>
                ) : (
                  <>
                    <i className="fas fa-book mr-2"></i>
                    Enroll
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
