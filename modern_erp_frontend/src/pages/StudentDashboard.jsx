
// import React, { useEffect, useState } from "react";
// import { api } from "../api";

// export default function StudentDashboard() {
//   const [courses, setCourses] = useState([]);
//   const [allCourses, setAllCourses] = useState([]);
//   const [enrollId, setEnrollId] = useState("");

//   useEffect(() => {
//     api.get("/api/student/dashboard").then(r=>setCourses(r.data));
//     api.get("/api/course").then(r=>setAllCourses(r.data));
//   }, []);

//   const enroll = async () => {
//     await api.post("/api/student/enroll", { courseId: Number(enrollId) });
//     const r = await api.get("/api/student/dashboard");
//     setCourses(r.data);
//   };

//   const [results, setResults] = useState([]);
//   useEffect(() => {
//     api.get("/api/student/results").then(r=>setResults(r.data));
//   }, []);

//   return (
//     <div className="grid md:grid-cols-2 gap-6">
//       <div className="bg-white p-4 rounded-xl shadow">
//         <h3 className="font-semibold mb-2">Enrolled Courses</h3>
//         <ul className="list-disc ml-5">
//           {courses.map(c => <li key={c.id}>{c.code} — {c.title}</li>)}
//         </ul>
//         <div className="mt-4">
//           <h4 className="font-medium">Enroll in a new course</h4>
//           <select className="border rounded p-2 w-full" value={enrollId} onChange={e=>setEnrollId(e.target.value)}>
//             <option value="">Select course</option>
//             {allCourses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
//           </select>
//           <button onClick={enroll} className="mt-2 bg-black text-white rounded px-4 py-2">Enroll</button>
//         </div>
//       </div>
//       <div className="bg-white p-4 rounded-xl shadow">
//         <h3 className="font-semibold mb-2">Results</h3>
//         <table className="w-full text-sm">
//           <thead><tr><th className="text-left p-2">Course</th><th className="text-left p-2">Grade</th><th className="text-left p-2">Marks</th></tr></thead>
//           <tbody>
//             {results.map(r => (
//               <tr key={r.id} className="border-t">
//                 <td className="p-2">{r.course?.code} — {r.course?.title}</td>
//                 <td className="p-2">{r.grade}</td>
//                 <td className="p-2">{r.marks ?? "-"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


// pages/StudentDashboard.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import StudentLayout from "../components/StudentLayout";
import StudentCourses from "./student/StudentCourses";
import StudentEnroll from "./student/StudentEnroll";
import StudentResults from "./student/StudentResults";
import StudentProfile from "./student/StudentProfile"; // Add this import
import StudentCourseDetail from "./student/StudentCourseDetail";


const StudentDashboard = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<StudentLayout />}>
          <Route index element={<Navigate to="courses" replace />} />
          <Route path="courses" element={<StudentCourses />} />
           <Route path="courses/:courseId" element={<StudentCourseDetail />} /> {/* Add this route */}
          <Route path="enroll" element={<StudentEnroll />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="profile" element={<StudentProfile />} /> 

        </Route>
      </Routes>
    </div>
  );
};

export default StudentDashboard;