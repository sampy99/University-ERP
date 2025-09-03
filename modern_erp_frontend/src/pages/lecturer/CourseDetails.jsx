// pages/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState("materials");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    // Fetch course details
    api.get(`/api/course/${courseId}`).then(r => setCourse(r.data));
    
    // Fetch course materials
    api.get(`/api/lectures/materials/course/${courseId}`).then(r => setMaterials(r.data));
    
    // Fetch assignments
    api.get(`/api/assignments/course/${courseId}`).then(r => setAssignments(r.data));
  }, [courseId]);

//   const uploadMaterial = async () => {
//     const form = new FormData();
//     form.append("title", title);
//     form.append("file", file);
    
//     const r = await api.post(`/api/lectures/materials/course/${courseId}`, form, { 
//       headers: { "Content-Type": "multipart/form-data" } 
//     });
    

//     alert("Uploaded: " + r.data.title);
//     setMaterials([...materials, r.data]);
//     setShowUploadForm(false);
//     setTitle("");
//     setFile(null);
//   };

const uploadMaterial = async () => {
  if (!file || !title) {
    alert("Please provide both file and title");
    return;
  }

  const form = new FormData();
  form.append("file", file);   // Match backend @RequestPart("file")
  form.append("title", title); // Match backend @RequestPart("title")

  try {
    const r = await api.post(`/api/lectures/materials/${courseId}`, form, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      withCredentials: true
    });
    
    
    setMaterials([...materials, r.data]); // Now single object, not array
    setShowUploadForm(false);
    setTitle("");
    setFile(null);
  } catch (err) {
    console.error("Upload error:", err);
    console.error("Response:", err.response?.data);
    alert("Upload failed: " + (err.response?.data?.message || err.message));
  }
};

const downloadMaterial = async (material) => {
  try {
    // Make the API call to get the file
    const response = await api.get(`/api/lectures/materials/${material.fileId}`, {
      responseType: 'blob', // Important for file downloads
      withCredentials: true
    });

    // Create a blob from the response
    const blob = new Blob([response.data]);
    
    // Create a download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    // Set the filename from content-disposition header or use material title
    const contentDisposition = response.headers['content-disposition'];
    let fileName = material.fileName;


// Append extension if missing
if (!fileName.includes('.') && material.fileName) {
  const extIndex = material.fileName.lastIndexOf('.');
  if (extIndex !== -1) {
    fileName += material.fileName.substring(extIndex);
  }
}

    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1];
      }
    }
    
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
    
  } catch (err) {
    console.error('Download error:', err);
    alert('Download failed: ' + (err.response?.data?.message || err.message));
  }
};


  const createAssignment = async () => {
    const r = await api.post(`/api/assignments`, {
      title: assignmentTitle,
      description: assignmentDescription,
      dueDate: dueDate,
      courseId: courseId
    });

    console.log("dueDate:", dueDate)
    
    alert("Created: " + r.data.title);
    setAssignments([...assignments, r.data]);
    setShowAssignmentForm(false);
    setAssignmentTitle("");
    setAssignmentDescription("");
    setDueDate("");
  };

  if (!course) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-2">{course.code} - {course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description || "No description available."}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <i className="fas fa-users text-blue-600 mr-2"></i>
            <span>{course.enrolledStudents || 0} Enrolled Students</span>
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Lecture Slides & Materials</h3>
                <button 
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  <i className="fas fa-upload mr-2"></i>Upload New
                </button>
              </div>

              {showUploadForm && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium mb-3">Upload New Material</h4>
                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <input 
                      className="border rounded p-2" 
                      placeholder="Title" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                    />
                    <input 
                      type="file" 
                      onChange={e => setFile(e.target.files[0])} 
                      className="border rounded p-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={uploadMaterial}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                    >
                      Upload
                    </button>
                    <button 
                      onClick={() => setShowUploadForm(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {materials.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No materials uploaded yet.</p>
              ) : (
                <div className="divide-y divide-gray-200">
                  {materials.map(material => (
  <div key={material.id} className="py-3 border-b border-gray-200">
    {/* Main Title */}
    <h4 className="font-semibold text-gray-800 mb-1">{material.title}</h4>
    
    <div className="flex justify-between items-center">
      <div>
        {/* File name as secondary info */}
        <p className="text-sm text-gray-600 mb-1">
          <i className="fas fa-file mr-2 text-blue-500"></i>
          {material.fileName}
        </p>
        <p className="text-xs text-gray-500">
          Uploaded: {new Date(material.uploadDate).toLocaleDateString()}
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Course Assignments</h3>
                <button 
                  onClick={() => setShowAssignmentForm(!showAssignmentForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  <i className="fas fa-plus mr-2"></i>Create Assignment
                </button>
              </div>

              {showAssignmentForm && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium mb-3">Create New Assignment</h4>
                  <div className="grid gap-3 mb-3">
                    <input 
                      className="border rounded p-2" 
                      placeholder="Assignment Title" 
                      value={assignmentTitle} 
                      onChange={e => setAssignmentTitle(e.target.value)} 
                    />
                    <textarea 
                      className="border rounded p-2" 
                      placeholder="Description"
                      rows="3"
                      value={assignmentDescription} 
                      onChange={e => setAssignmentDescription(e.target.value)} 
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                      <input 
                        type="datetime-local" 
                        className="border rounded p-2 w-full" 
                        value={dueDate} 
                        onChange={e => setDueDate(e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={createAssignment}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                    >
                      Create
                    </button>
                    <button 
                      onClick={() => setShowAssignmentForm(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {assignments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No assignments created yet.</p>
              ) : (
                <div className="divide-y divide-gray-200">
                  {assignments.map(assignment => (
                    <div key={assignment.id} className="py-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{assignment.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          new Date(assignment.dueDate) > new Date() 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          Due: {new Date(assignment.dueDate).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {assignment.submissions || 0} submissions
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetails ;
