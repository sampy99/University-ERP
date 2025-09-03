// pages/student/StudentCourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../../api";

const StudentCourseDetail = () => {
    const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [activeTab, setActiveTab] = useState("materials");
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submissionDescription, setSubmissionDescription] = useState("");
  const [ownWorkConfirmed, setOwnWorkConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchingSubmissions, setFetchingSubmissions] = useState(false);
   const [showSubmissionDetails, setShowSubmissionDetails] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseResponse = await api.get(`/api/course/${courseId}`);
      setCourse(courseResponse.data);
      
      // Fetch course materials
      const materialsResponse = await api.get(`/api/lectures/materials/course/${courseId}`);
      setMaterials(materialsResponse.data);
      
      // Fetch assignments
      const assignmentsResponse = await api.get(`/api/assignments/course/${courseId}`);
      const assignmentsData = assignmentsResponse.data;
      setAssignments(assignmentsData);
      
      // Fetch submission details for each assignment
      setFetchingSubmissions(true);
      const submissionsMap = {};
      
      // Use Promise.all to fetch all submissions in parallel
      await Promise.all(
        assignmentsData.map(async (assignment) => {
          try {
            const submissionResponse = await api.get(`/api/assignments-upload/get/${assignment.id}`);
            // Check if the response has data (submission exists)
            if (submissionResponse.data && submissionResponse.data.id) {
              submissionsMap[assignment.id] = submissionResponse.data;
            } else {
              submissionsMap[assignment.id] = null; // No submission exists
            }
          } catch (subError) {
            console.warn(`Could not fetch submission for assignment ${assignment.id}:`, subError);
            // If it's a 404 error, it means no submission exists yet
            if (subError.response?.status === 404) {
              submissionsMap[assignment.id] = null;
            } else {
              // For other errors, you might want to handle them differently
              submissionsMap[assignment.id] = null;
            }
          }
        })
      );
      
      setSubmissions(submissionsMap);
    } catch (error) {
      console.error("Error fetching course data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setFetchingSubmissions(false);
    }
  };

  if (courseId) {
    fetchCourseData();
  } else {
    setError("No course ID provided");
    setLoading(false);
  }
}, [courseId]);

  // Refresh submission data for a specific assignment
  const refreshSubmission = async (assignmentId) => {
  try {
    const response = await api.get(`/api/assignments-upload/get/${assignmentId}`);
    // Check if the response has data (submission exists)
    if (response.data && response.data.id) {
      setSubmissions(prev => ({
        ...prev,
        [assignmentId]: response.data
      }));
      return response.data;
    } else {
      setSubmissions(prev => ({
        ...prev,
        [assignmentId]: null
      }));
      return null;
    }
  } catch (error) {
    console.warn(`Could not fetch submission for assignment ${assignmentId}:`, error);
    // If it's a 404 error, it means no submission exists yet
    if (error.response?.status === 404) {
      setSubmissions(prev => ({
        ...prev,
        [assignmentId]: null
      }));
    }
    return null;
  }
};

  const downloadMaterial = async (material) => {
    try {
      const response = await api.get(`/api/lectures/materials/${material.fileId}`, {
        responseType: 'blob',
        withCredentials: true
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      let fileName = material.fileName;
      if (!fileName.includes('.') && material.fileName) {
        const extIndex = material.fileName.lastIndexOf('.');
        if (extIndex !== -1) {
          fileName += material.fileName.substring(extIndex);
        }
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
    } catch (err) {
      console.error('Download error:', err);
      alert('Download failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmission = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissionForm(true);
    // Reset form fields
    setSubmissionFile(null);
    setSubmissionDescription("");
    setOwnWorkConfirmed(false);
  };

  
  const submitAssignment = async () => {
  if (!submissionFile) {
    alert("Please select a file to upload");
    return;
  }

  if (!submissionDescription.trim()) {
    alert("Please provide a description for your submission");
    return;
  }

  if (!ownWorkConfirmed) {
    alert("Please confirm that this is your own work");
    return;
  }

  if (submissionDescription.length > 250) {
    alert("Description must be 250 characters or less");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", submissionFile);
    formData.append("description", submissionDescription);

    const response = await api.post(`/api/assignments-upload/${selectedAssignment.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      withCredentials: true
    });

    // Refresh the submission data for this assignment
    await refreshSubmission(selectedAssignment.id);

    alert("Assignment submitted successfully!");
    setShowSubmissionForm(false);
    setSubmissionFile(null);
    setSubmissionDescription("");
    setOwnWorkConfirmed(false);
    setSelectedAssignment(null);
  } catch (err) {
    console.error("Submission error:", err);
    alert("Submission failed: " + (err.response?.data?.message || err.message));
  }
};

  const getSubmissionStatus = (assignment) => {
  const submission = submissions[assignment.id];
  
  // Check if submission exists and has the required data
  if (submission && submission.id) {
    return { 
      status: 'submitted', 
      text: 'Submitted', 
      date: submission.uploadedDate, // Use uploadedDate instead of submissionDate
      class: 'bg-green-100 text-green-800',
      submissionData: submission
    };
  }
  
  const now = new Date();
  const dueDate = new Date(assignment.dueDate);
  
  if (now > dueDate) {
    return { 
      status: 'overdue', 
      text: 'Overdue', 
      class: 'bg-red-100 text-red-800',
      submissionData: null
    };
  }
  
  return { 
    status: 'pending', 
    text: 'Not Submitted', 
    class: 'bg-yellow-100 text-yellow-800',
    submissionData: null
  };
};

// Update the viewSubmissionDetails function
// Replace the viewSubmissionDetails function
const viewSubmissionDetails = (assignment) => {
  const status = getSubmissionStatus(assignment);
  if (status.status === 'submitted' && status.submissionData) {
    setSelectedSubmission(status.submissionData);
    setShowSubmissionDetails(true);
  }
};

// Add a function to close the modal
const closeSubmissionDetails = () => {
  setShowSubmissionDetails(false);
  setSelectedSubmission(null);
};

// Update the formatDate function to handle the date format from backend
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return the original string if formatting fails
  }
};

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-red-600">Error: {error}</h2>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-bold text-red-600">Course not found</h2>
        <Link to="/student/courses" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to My Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link 
        to="/student/courses" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
      >
        <i className="fas fa-arrow-left mr-2"></i> Back to My Courses
      </Link>

      {/* Course Header */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-2">{course.code} - {course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description || "No description available."}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <i className="fas fa-chalkboard-teacher text-blue-600 mr-2"></i>
            <span>Lecturer: {course.lecturer?.firstName +" "+ course.lecturer?.lastName || 'Not assigned'}</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-calendar-alt text-blue-600 mr-2"></i>
            <span>{course.schedule || 'Schedule TBA'}</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-university text-blue-600 mr-2"></i>
            <span>Semester {course.semester || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("materials")}
              className={`py-4 px-6 text-center font-medium text-sm ${activeTab === "materials" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <i className="fas fa-file-pdf mr-2"></i>Lecture Materials
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`py-4 px-6 text-center font-medium text-sm ${activeTab === "assignments" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <i className="fas fa-tasks mr-2"></i>Assignments
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Materials Tab */}
          {activeTab === "materials" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Lecture Slides & Materials</h3>

              {materials.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No materials available for this course.</p>
              ) : (
                <div className="divide-y divide-gray-200">
                  {materials.map(material => (
                    <div key={material.id} className="py-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{material.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            <i className="fas fa-file mr-2 text-blue-500"></i>
                            {material.fileName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Uploaded: {formatDate(material.uploadDate)}
                          </p>
                        </div>
                        <button 
                          onClick={() => downloadMaterial(material)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center ml-4"
                        >
                          <i className="fas fa-download mr-2"></i>Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Assignments Tab */}
           {activeTab === "assignments" && (
  <div>
    <h3 className="text-lg font-medium mb-4">Course Assignments</h3>
    {fetchingSubmissions && (
      <div className="flex items-center justify-center p-4">
        <i className="fas fa-spinner fa-spin text-blue-600 mr-2"></i>
        <span>Loading submission details...</span>
      </div>
    )}

    {assignments.length === 0 ? (
      <p className="text-gray-500 text-center py-4">No assignments available for this course.</p>
    ) : (
      <div className="space-y-6">
        {assignments.map(assignment => {
          const status = getSubmissionStatus(assignment);
          const isOverdue = status.status === 'overdue';
          const isSubmitted = status.status === 'submitted';
          
          return (
            <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-lg">{assignment.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.class}`}>
                  {status.text}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="font-medium">Due Date:</span>{' '}
                  <span className={isOverdue ? 'text-red-600' : ''}>
                    {formatDate(assignment.dueDate)}
                  </span>
                  {isOverdue && <span className="text-red-600 ml-2">(Overdue)</span>}
                </div>
                {isSubmitted && status.submissionData && (
                  <div>
                    <span className="font-medium">Submitted:</span>{' '}
                    {formatDate(status.submissionData.uploadedDate)}
                  </div>
                )}
              </div>
              
              {/* Show submission details if submitted */}
              {isSubmitted && status.submissionData && (
                <div className="bg-gray-50 p-3 rounded-md mb-4">
                  <h5 className="font-medium text-sm mb-2">Your Submission:</h5>
                  <p className="text-sm text-gray-600 mb-1">
                    {status.submissionData.description || 'No description provided'}
                  </p>
                  <p className="text-xs text-gray-500">
                    File: {status.submissionData.fileName}
                  </p>
                  {/* <button
                    onClick={() => viewSubmissionDetails(assignment)}
                    className="text-blue-600 text-xs mt-2 hover:underline"
                  >
                    View Details
                  </button> */}
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                {isSubmitted && (
  <button
    onClick={() => viewSubmissionDetails(assignment)}
    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
  >
    <i className="fas fa-eye mr-1"></i>View Submission
  </button>
)}
                
                {!isOverdue && !isSubmitted && (
                  <button
                    onClick={() => handleSubmission(assignment)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    <i className="fas fa-upload mr-2"></i>Submit Assignment
                  </button>
                )}
                
                {isOverdue && (
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded text-sm cursor-not-allowed"
                    disabled
                  >
                    <i className="fas fa-clock mr-2"></i>Submission Closed
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
)}

        </div>
      </div>
{/* Submission Details Modal */}
{showSubmissionDetails && selectedSubmission && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Submission Details</h3>
        <button
          onClick={closeSubmissionDetails}
          className="text-gray-500 hover:text-gray-700"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Submitted on</label>
          <p className="text-sm text-gray-900">{formatDate(selectedSubmission.uploadedDate)}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <p className="text-sm text-gray-900">
            {selectedSubmission.description || 'No description provided'}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
          <p className="text-sm text-gray-900">{selectedSubmission.fileName}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <p className="text-sm text-gray-900">Submitted</p>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          onClick={closeSubmissionDetails}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      {/* Submission Modal */}
      {showSubmissionForm && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Submit Assignment: {selectedAssignment.title}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
              <input 
                type="file" 
                onChange={e => setSubmissionFile(e.target.files[0])} 
                className="border rounded p-2 w-full"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (max 250 characters)
                <span className="text-red-500">*</span>
              </label>
              <textarea 
                value={submissionDescription}
                onChange={e => setSubmissionDescription(e.target.value)}
                className="border rounded p-2 w-full"
                rows="4"
                placeholder="Describe your submission..."
                maxLength={250}
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                {submissionDescription.length}/250 characters
              </div>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={ownWorkConfirmed}
                  onChange={e => setOwnWorkConfirmed(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  required
                />
                <span className="text-sm text-gray-700">
                  I confirm that this is my own work and I have not plagiarized
                </span>
              </label>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Due Date: {formatDate(selectedAssignment.dueDate)}
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowSubmissionForm(false);
                  setSelectedAssignment(null);
                  setSubmissionFile(null);
                  setSubmissionDescription("");
                  setOwnWorkConfirmed(false);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={submitAssignment}
                disabled={!submissionFile || !submissionDescription.trim() || !ownWorkConfirmed}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourseDetail;