// // pages/EnrollCourses.js
// import React, { useState, useEffect } from 'react';
// import CourseCard from '../components/CourseCard';
// import { api } from '../api';

// const EnrollCourses = () => {
//   const [availableCourses, setAvailableCourses] = useState([]);
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [enrollId, setEnrollId] = useState("");

//   useEffect(() => {
//     api.get("/api/course").then(r => setAvailableCourses(r.data));
//     api.get("/api/student/dashboard").then(r => setEnrolledCourses(r.data));
//   }, []);

//   const enroll = async () => {
//     if (!enrollId) return;
    
//     await api.post("/api/student/enroll", { courseId: Number(enrollId) });
    
//     // Refresh the enrolled courses list
//     const response = await api.get("/api/student/dashboard");
//     setEnrolledCourses(response.data);
    
//     // Clear selection
//     setEnrollId("");
//   };

//   // Filter out already enrolled courses
//   const filteredCourses = availableCourses.filter(
//     course => !enrolledCourses.some(ec => ec.id === course.id)
//   );

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold text-gray-800">Enroll in Courses</h1>
      
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
        
//         <div className="flex flex-col md:flex-row gap-4 mb-6">
//           <select 
//             value={enrollId} 
//             onChange={e => setEnrollId(e.target.value)}
//             className="border border-gray-300 rounded-lg p-2.5 flex-grow"
//           >
//             <option value="">Select a course to enroll</option>
//             {filteredCourses.map(course => (
//               <option key={course.id} value={course.id}>
//                 {course.code} — {course.title}
//               </option>
//             ))}
//           </select>
//           <button 
//             onClick={enroll} 
//             disabled={!enrollId}
//             className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg px-5 py-2.5"
//           >
//             Enroll
//           </button>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredCourses.map(course => (
//             <CourseCard key={course.id} course={course} showEnrollButton={true} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EnrollCourses;