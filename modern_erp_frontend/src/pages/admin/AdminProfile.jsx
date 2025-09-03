// pages/admin/AdminProfile.jsx
import React, { useState, useEffect } from "react";
import { api } from "../../api";

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    nic: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    username: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/admin/profile");
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-blue-800">Personal Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Username</label>
              <p className="mt-1 text-gray-900 font-medium">{profile.username}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600">NIC</label>
              <p className="mt-1 text-gray-900">{profile.nic}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600">First Name</label>
              <p className="mt-1 text-gray-900">{profile.firstName}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600">Last Name</label>
              <p className="mt-1 text-gray-900">{profile.lastName}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-blue-800">Contact Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <p className="mt-1 text-gray-900">{profile.email || "Not provided"}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600">Phone</label>
              <p className="mt-1 text-gray-900">{profile.phone || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-gray-50 p-6 rounded-lg md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-blue-800">Address Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Address Line 1</label>
              <p className="mt-1 text-gray-900">{profile.addressLine1 || "Not provided"}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600">Address Line 2</label>
              <p className="mt-1 text-gray-900">{profile.addressLine2 || "Not provided"}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600">Address Line 3</label>
              <p className="mt-1 text-gray-900">{profile.addressLine3 || "Not provided"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;