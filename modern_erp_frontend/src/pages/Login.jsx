import React, { useState } from "react";
import { api, setAuth, clearAuth, loadAuth } from "../api";

export default function Login() {
  console.log('####')
  // const { login } = useAuth(); // Uncomment if using AuthContext
  
  const [form, setForm] = useState({ 
    username: "", 
    password: ""
  });
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loginResponse, setLoginResponse] = useState(null);
  
  const onSubmit = async (e) => {
    e.preventDefault();
  setIsSubmitting(true);
  setError("");
  
  try {
    const res = await api.post("/api/auth/login", {
      username: form.username,
      password: form.password
    });
    
    console.log("✅ Login API Response:", res.data);
    
    // Store the response data
    setLoginResponse(res.data);
    
    // Store JWT token and user data
    if (res.data.token) {
      setAuth(res.data.token);
      
      // Store user role and info in localStorage for redirection
      localStorage.setItem('userRole', res.data.role);
      localStorage.setItem('userName', res.data.fullName);
      localStorage.setItem('username', form.username);
      
      setIsSignedIn(true);
      
      // Redirect based on role after a brief delay
      setTimeout(() => {
        redirectBasedOnRole(res.data.role);
      }, 1500); // 1.5 second delay to show success message
    }
      
    } catch (error) {
      console.error("❌ Login failed:", error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        request: error.request ? "Request made but no response" : "No request made"
      })
      
      setIsSubmitting(false);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        console.log("🔴 Server Error Response:", error.response.status, error.response.data);
        const errorMessage = error.response.data?.message || error.response.data?.error || `Server error (${error.response.status})`;
        setError(errorMessage);
      } else if (error.request) {
        // Request was made but no response received (likely CORS or network)
        console.log("🔴 Network/CORS Error - no response received");
        setError("Unable to connect to server. Check console for CORS/network details.");
      } else {
        // Something else happened
        console.log("🔴 Other Error:", error.message);
        setError("An unexpected error occurred: " + error.message);
      }
    }finally{
          setIsSubmitting(false);

    }
    
  };
// Add this function to handle redirection
const redirectBasedOnRole = (role) => {
  switch (role) {
    case 'STUDENT':
      window.location.href = '/student/courses';
      break;
    case 'LECTURER':
      window.location.href = '/lecturer/dashboard';
      break;
    case 'ADMIN':
      window.location.href = '/admin/profile';
      break;
    default:
      console.warn('Unknown role:', role);
      // Optional: redirect to a default page or show error
      window.location.href = '/';
  }
};
  

  const getRoleIcon = (role) => {
    switch (role) {
      case "USER":
      case "STUDENT": return "🎓";
      case "LECTURER":
      case "TEACHER": return "👥";
      case "ADMIN": return "🛡️";
      default: return "👤";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "USER":
      case "STUDENT": return "Student";
      case "LECTURER":
      case "TEACHER": return "Lecturer";
      case "ADMIN": return "Admin";
      default: return "User";
    }
  };
  
  // Clear error when user starts typing
  const handleInputChange = (field, value) => {
    setForm({...form, [field]: value});
    if (error) setError(""); // Clear error on input change
  };

  if (isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 text-2xl text-white">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-4">You have successfully signed in to University ERP</p>
          
          <button 
            onClick={() => {
  clearAuth();
  setIsSignedIn(false);
  setLoginResponse(null);
  setForm({ username: "", password: "" });
  setError("");
}}

            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-3 font-semibold transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 text-2xl text-white">
            🔐
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 flex items-center">
                  <span className="mr-2 text-lg">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            {/* Sign In Form */}
            <div className="space-y-5">
              {/* Username Field */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">👤</span>
                <input 
                  className="w-full border border-gray-300 rounded-lg p-3 pl-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50" 
                  placeholder="Username or Email" 
                  value={form.username} 
                  onChange={e=>handleInputChange('username', e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔒</span>
                <input 
                  className="w-full border border-gray-300 rounded-lg p-3 pl-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50" 
                  placeholder="Password" 
                  type="password" 
                  value={form.password} 
                  onChange={e=>handleInputChange('password', e.target.value)}
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-600">
                  <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  Remember me
                </label>
                <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>

              {/* Sign In Button */}
              <button 
                type="submit"
                disabled={isSubmitting || !form.username.trim() || !form.password.trim()}
                className={`w-full rounded-lg p-3 font-semibold transition-all duration-200 transform focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg ${
                  isSubmitting || !form.username.trim() || !form.password.trim()
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02]'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-3">
          {/* <p className="text-gray-500 text-sm">
            Don't have an account? <span className="text-blue-600 font-medium cursor-pointer hover:underline">Sign up</span>
          </p> */}
          
          {/* Social Sign In Options */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">Or continue with</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white/50 hover:bg-white/70 transition-all duration-200">
                <span className="mr-2 text-lg">🔵</span>
                <span className="text-sm font-medium text-gray-700">Google</span>
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white/50 hover:bg-white/70 transition-all duration-200">
                <span className="mr-2 text-lg">📘</span>
                <span className="text-sm font-medium text-gray-700">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}