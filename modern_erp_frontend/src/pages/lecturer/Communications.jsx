// pages/Communications.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api";

const Communications = () => {
  const [searchParams] = useSearchParams();
  const courseIdFromParams = searchParams.get("courseId");
  
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(courseIdFromParams || "");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sentCount, setSentCount] = useState(null);

  useEffect(() => {
    api.get("/api/lecturer/dashboard").then(r => setCourses(r.data));
  }, []);

  const sendEmails = async () => {
    const r = await api.post("/api/email/course/send", null, { 
      params: { courseId, subject: emailSubject, body: emailBody } 
    });
    setSentCount(r.data);
    
    // Reset form
    setEmailSubject("");
    setEmailBody("");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Communications</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
          <select 
            className="border rounded p-2 w-full" 
            value={courseId} 
            onChange={e => setCourseId(e.target.value)}
          >
            <option value="">Select a course</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.title}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
          <input 
            className="border rounded p-2 w-full" 
            placeholder="Subject" 
            value={emailSubject} 
            onChange={e => setEmailSubject(e.target.value)} 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
          <textarea 
            className="border rounded p-2 w-full" 
            rows="6" 
            placeholder="Write your message to students here..." 
            value={emailBody} 
            onChange={e => setEmailBody(e.target.value)} 
          />
        </div>
        
        <button 
          onClick={sendEmails}
          disabled={!courseId || !emailSubject || !emailBody}
          className={`px-4 py-2 rounded text-white ${
            !courseId || !emailSubject || !emailBody
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <i className="fas fa-paper-plane mr-2"></i>Send to Enrolled Students
        </button>
        
        {sentCount !== null && (
          <div className="bg-green-100 text-green-800 p-3 rounded">
            <i className="fas fa-check-circle mr-2"></i>
            Email sent successfully to students!.
          </div>
        )}
      </div>
    </div>
  );
}

export default Communications;
