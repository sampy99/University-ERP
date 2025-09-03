
import React, { useState } from "react";
import { api } from "../api"; // Import your existing API setup

export default function Signup() {
  const [form, setForm] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    nic: "",
    phone: "", 
    addressLine1: "", 
    addressLine2: "", 
    addressLine3: "",
    username: "", 
    password: "", 
    role: "STUDENT",
    studentNumber: "",
    staffNumber: ""
  });
  const [created, setCreated] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Clear error when user starts typing
  const handleInputChange = (field, value) => {
    setForm({...form, [field]: value});
    if (error) setError(""); // Clear error on input change
  };
  
  // Form validation
  const isFormValid = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'nic', 'phone', 'addressLine1', 'username', 'password'];
    const isBasicFieldsValid = requiredFields.every(field => form[field].trim() !== '');
    const isRoleFieldValid = form.role === "STUDENT" ? form.studentNumber.trim() !== '' : form.staffNumber.trim() !== '';
    return isBasicFieldsValid && isRoleFieldValid;
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    // Prepare form data for API
    const submitData = {
      ...form,
      fullName: `${form.firstName} ${form.lastName}`, // Combine names if your API expects fullName
      ...(form.role === "STUDENT" ? { studentNumber: form.studentNumber } : { staffNumber: form.staffNumber })
    };
    
    // Remove the unused field to keep data clean
    if (form.role === "STUDENT") {
      delete submitData.staffNumber;
    } else {
      delete submitData.studentNumber;
    }
    
    try {
      console.log("Submitting data:", submitData); // For debugging
      
      const res = await api.post("/api/auth/signup", submitData);
      
      console.log("API Response:", res.data); // For debugging
      setCreated(res.data);
      setIsSubmitting(false);
      
    } catch (error) {
      console.error("Signup failed:", error);
      setIsSubmitting(false);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || error.response.data?.error || "Server error occurred";
        setError(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        setError("Network error. Please check your connection and try again.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "STUDENT": return "🎓";
      case "LECTURER": return "👥";
      case "ADMIN": return "🛡️";
      default: return "👤";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "STUDENT": return "Student";
      case "LECTURER": return "Lecturer";
      case "ADMIN": return "Admin";
      default: return "Student";
    }
  };

  if (created) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 text-2xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
          <p className="text-gray-600 mb-4">Welcome to our academic community</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">
              <span className="font-semibold">Account Details:</span><br />
              {created.id && `ID: #${created.id}`}<br />
              {created.username && `Username: ${created.username}`}<br />
              {created.email && `Email: ${created.email}`}
            </p>
          </div>
          <button 
            onClick={() => setCreated(null)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-3 font-semibold transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
          >
            Create Another Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 text-2xl text-white">
            👤
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join our academic community</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
          <div className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 flex items-center">
                  <span className="mr-2 text-lg">⚠️</span>
                  {error}
                </p>
              </div>
            )}
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="mr-2 text-blue-600 text-lg">👤</span>
                Personal Information
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input 
                    className="w-full border border-gray-300 rounded-lg p-3 pl-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50" 
                    placeholder="First Name" 
                    value={form.firstName} 
                    onChange={e=>handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <input 
                    className="w-full border border-gray-300 rounded-lg p-3 pl-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50" 
                    placeholder="Last Name" 
                    value={form.lastName} 
                    onChange={e=>setForm({...form, lastName:e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">✉️</span>
                <input 
                  className="w-full border border-gray-300 rounded-lg p-3 pl-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50" 
                  placeholder="Email Address" 
                  type="email"
                  value={form.email} 
                  onChange={e=>setForm({...form, email:e.target.value})}
                  required
                />
              </div>

              <input 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50" 
                placeholder="National ID Number" 
                value={form.nic} 
                onChange={e=>setForm({...form, nic:e.target.value})}
                required
              />

              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">📞</span>
                <input 
                  className="w-full border border-gray-300 rounded-lg p-3 pl-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50" 
                  placeholder="Phone Number" 
                  value={form.phone} 
                  onChange={e=>setForm({...form, phone:e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="mr-2 text-green-600 text-lg">📍</span>
                Address
              </h3>
              
              <input 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50" 
                placeholder="Address Line 1" 
                value={form.addressLine1} 
                onChange={e=>setForm({...form, addressLine1:e.target.value})}
                required
              />
              
              <input 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50" 
                placeholder="Address Line 2" 
                value={form.addressLine2} 
                onChange={e=>setForm({...form, addressLine2:e.target.value})}
              />
              
              <input 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50" 
                placeholder="City / Address Line 3" 
                value={form.addressLine3} 
                onChange={e=>setForm({...form, addressLine3:e.target.value})}
              />
            </div>

            {/* Account Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="mr-2 text-purple-600 text-lg">✓</span>
                Account Information
              </h3>

              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">👤</span>
                <input 
                  className="w-full border border-gray-300 rounded-lg p-3 pl-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50" 
                  placeholder="Username" 
                  value={form.username} 
                  onChange={e=>setForm({...form, username:e.target.value})}
                  required
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔒</span>
                <input 
                  className="w-full border border-gray-300 rounded-lg p-3 pl-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50" 
                  placeholder="Password" 
                  type="password" 
                  value={form.password} 
                  onChange={e=>setForm({...form, password:e.target.value})}
                  required
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  {getRoleIcon(form.role)}
                </span>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-3 pl-11 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 cursor-pointer" 
                  style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}
                  value={form.role} 
                  onChange={e=>setForm({...form, role:e.target.value})}
                >
                  <option value="STUDENT">Student</option>
                  <option value="LECTURER">Lecturer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {/* Conditional ID Number Field */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  {getRoleIcon(form.role)}
                </span>
                {form.role === "STUDENT" ? (
                  <input 
                    className="w-full border border-gray-300 rounded-lg p-3 pl-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50" 
                    placeholder="Student Number (e.g., STU001234)" 
                    value={form.studentNumber} 
                    onChange={e=>setForm({...form, studentNumber:e.target.value})}
                    required
                  />
                ) : (
                  <input 
                    className="w-full border border-gray-300 rounded-lg p-3 pl-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50" 
                    placeholder="Staff Number (e.g., STF001234)" 
                    value={form.staffNumber} 
                    onChange={e=>setForm({...form, staffNumber:e.target.value})}
                    required
                  />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              onClick={onSubmit}
              disabled={isSubmitting || !isFormValid()}
              className={`w-full rounded-lg p-3 font-semibold transition-all duration-200 transform focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg ${
                isSubmitting || !isFormValid()
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02]'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                `Create Account as ${getRoleLabel(form.role)}`
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account? <span className="text-blue-600 font-medium cursor-pointer hover:underline">Sign in</span>
        </p>
      </div>
    </div>
  );
}