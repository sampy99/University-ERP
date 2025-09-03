
// import React, { useEffect, useState } from "react";
// import { api } from "../api";

// export default function LecturerDashboard() {
//   const [courses, setCourses] = useState([]);
//   const [courseId, setCourseId] = useState("");
//   const [title, setTitle] = useState("");
//   const [file, setFile] = useState(null);
//   const [emailSubject, setEmailSubject] = useState("");
//   const [emailBody, setEmailBody] = useState("");
//   const [sentCount, setSentCount] = useState(null);

//   useEffect(() => {
//     api.get("/api/lecturer/dashboard").then(r=>setCourses(r.data));
//   }, []);

//   const upload = async () => {
//     const form = new FormData();
//     form.append("courseId", courseId);
//     form.append("title", title);
//     form.append("file", file);
//     const r = await api.post("/api/lecturer/materials/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
//     alert("Uploaded: " + r.data.title);
//   };

//   const sendEmails = async () => {
//     const r = await api.post("/api/lecturer/email", null, { params: { courseId, subject: emailSubject, body: emailBody } });
//     setSentCount(r.data);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="bg-white p-4 rounded-xl shadow">
//         <h3 className="font-semibold mb-2">My Teaching Courses</h3>
//         <ul className="list-disc ml-5">
//           {courses.map(c => <li key={c.id}>{c.code} — {c.title}</li>)}
//         </ul>
//       </div>

//       <div className="bg-white p-4 rounded-xl shadow">
//         <h3 className="font-semibold mb-2">Upload Lecture Slides</h3>
//         <div className="grid md:grid-cols-2 gap-3">
//           <select className="border rounded p-2" value={courseId} onChange={e=>setCourseId(e.target.value)}>
//             <option value="">Select course</option>
//             {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
//           </select>
//           <input className="border rounded p-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
//           <input type="file" onChange={e=>setFile(e.target.files[0])} />
//           <button onClick={upload} className="bg-black text-white rounded px-4 py-2">Upload</button>
//         </div>
//       </div>

//       <div className="bg-white p-4 rounded-xl shadow">
//         <h3 className="font-semibold mb-2">Email Enrolled Students</h3>
//         <div className="grid md:grid-cols-2 gap-3">
//           <select className="border rounded p-2" value={courseId} onChange={e=>setCourseId(e.target.value)}>
//             <option value="">Select course</option>
//             {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
//           </select>
//           <input className="border rounded p-2" placeholder="Subject" value={emailSubject} onChange={e=>setEmailSubject(e.target.value)} />
//           <textarea className="border rounded p-2 md:col-span-2" rows="4" placeholder="Body" value={emailBody} onChange={e=>setEmailBody(e.target.value)} />
//           <button onClick={sendEmails} className="bg-black text-white rounded px-4 py-2">Send Emails</button>
//           {sentCount !== null && <p className="text-green-700">Sent to {sentCount} students.</p>}
//         </div>
//       </div>
//     </div>
//   );
// }

// pages/LecturerDashboard.jsx
// pages/LecturerDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function LecturerDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lecturer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <i className="fas fa-book text-blue-600 mr-3"></i>
            Course Management
          </h2>
          <p className="text-gray-600 mb-4">View and manage your teaching courses, upload materials, and create assignments.</p>
          <Link 
            to="/lecturer/courses" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Manage Courses
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <i className="fas fa-envelope text-green-600 mr-3"></i>
            Student Communications
          </h2>
          <p className="text-gray-600 mb-4">Send emails to students enrolled in your courses for announcements and updates.</p>
          <Link 
            to="/lecturer/communications" 
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Send Emails
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow mt-6">
        <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">5</div>
            <div className="text-sm text-gray-600">Courses</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">142</div>
            <div className="text-sm text-gray-600">Students</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">24</div>
            <div className="text-sm text-gray-600">Materials</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">8</div>
            <div className="text-sm text-gray-600">Assignments</div>
          </div>
        </div>
      </div>
    </div>
  );
}