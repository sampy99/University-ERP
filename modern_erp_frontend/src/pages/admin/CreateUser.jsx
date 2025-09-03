// pages/admin/CreateUser.jsx
import React, { useState } from 'react';
import { api } from '../../api';

export default function CreateUser() {
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    nic: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    staffNumber: '',
    studentNumber: '',
    username: '',
    password: '',
    role: 'STUDENT'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!form.email.includes('@')) {
      newErrors.email = 'Email must contain @ symbol';
    }

    // First Name validation
    if (form.firstName.length > 100) {
      newErrors.firstName = 'First name cannot exceed 100 characters';
    }

    // Last Name validation
    if (form.lastName.length > 100) {
      newErrors.lastName = 'Last name cannot exceed 100 characters';
    }

    // NIC validation
    if (form.nic && (form.nic.length !== 10 && form.nic.length !== 12)) {
      newErrors.nic = 'NIC must be 10 or 12 characters';
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (form.phone && !phoneRegex.test(form.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    // Password validation
    if (form.password.length < 8 || form.password.length > 12) {
      newErrors.password = 'Password must be between 8-12 characters';
    }

    // Role-specific validations
    if (form.role === 'LECTURER' && !form.staffNumber) {
      newErrors.staffNumber = 'Staff number is required for lecturers';
    }

    if (form.role === 'ADMIN' && !form.staffNumber) {
      newErrors.staffNumber = 'Staff number is required for admins';
    }

    if (form.role === 'STUDENT' && !form.studentNumber) {
      newErrors.studentNumber = 'Student number is required for students';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      setMessage('Please fix the validation errors');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/auth/signup', form);
      setMessage('User created successfully!');
      setForm({
        email: '',
        firstName: '',
        lastName: '',
        nic: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        staffNumber: '',
        studentNumber: '',
        username: '',
        password: '',
        role: 'STUDENT'
      });
      setErrors({});
    } catch (error) {
      setMessage('Error creating user: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Real-time validation for specific fields
    if (name === 'phone') {
      // Only allow numbers and limit to 10 characters
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setForm({
        ...form,
        [name]: numericValue
      });
    } else if (name === 'nic') {
      // Allow alphanumeric for NIC but limit length
      const nicValue = value.slice(0, 12);
      setForm({
        ...form,
        [name]: nicValue
      });
    } else if (name === 'firstName' || name === 'lastName') {
      // Limit names to 100 characters
      setForm({
        ...form,
        [name]: value.slice(0, 100)
      });
    } else if (name === 'password') {
      // Limit password to 12 characters
      setForm({
        ...form,
        [name]: value.slice(0, 12)
      });
    } else {
      setForm({
        ...form,
        [name]: value
      });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    // Re-validate specific fields on blur
    if (['email', 'phone', 'nic', 'password'].includes(name)) {
      validateForm();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Create User Account</h1>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-blue-800">Basic Information</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={`border rounded-lg p-2.5 w-full ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="user@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2.5 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={`border rounded-lg p-2.5 w-full ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={100}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          <p className="text-xs text-gray-500 mt-1">
            {form.firstName.length}/100 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={`border rounded-lg p-2.5 w-full ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={100}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          <p className="text-xs text-gray-500 mt-1">
            {form.lastName.length}/100 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">NIC *</label>
          <input
            type="text"
            name="nic"
            value={form.nic}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={`border rounded-lg p-2.5 w-full ${
              errors.nic ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={12}
            placeholder="10 or 12 characters"
          />
          {errors.nic && <p className="text-red-500 text-xs mt-1">{errors.nic}</p>}
          <p className="text-xs text-gray-500 mt-1">
            {form.nic.length} characters (10 or 12 required)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={`border rounded-lg p-2.5 w-full ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={10}
            placeholder="0771234567"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          <p className="text-xs text-gray-500 mt-1">
            {form.phone.length}/10 digits
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2.5 w-full"
          >
            <option value="STUDENT">Student</option>
            <option value="LECTURER">Lecturer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={`border rounded-lg p-2.5 w-full ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            minLength={8}
            maxLength={12}
            placeholder="8-12 characters"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          <p className="text-xs text-gray-500 mt-1">
            {form.password.length}/12 characters
          </p>
        </div>

        {form.role === 'LECTURER' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Staff Number *</label>
            <input
              type="text"
              name="staffNumber"
              value={form.staffNumber}
              onChange={handleChange}
              className={`border rounded-lg p-2.5 w-full ${
                errors.staffNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.staffNumber && <p className="text-red-500 text-xs mt-1">{errors.staffNumber}</p>}
          </div>
        )}

        {form.role === 'ADMIN' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Staff Number *</label>
            <input
              type="text"
              name="staffNumber"
              value={form.staffNumber}
              onChange={handleChange}
              className={`border rounded-lg p-2.5 w-full ${
                errors.staffNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.staffNumber && <p className="text-red-500 text-xs mt-1">{errors.staffNumber}</p>}
          </div>
        )}

        {form.role === 'STUDENT' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student Number *</label>
            <input
              type="text"
              name="studentNumber"
              value={form.studentNumber}
              onChange={handleChange}
              className={`border rounded-lg p-2.5 w-full ${
                errors.studentNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.studentNumber && <p className="text-red-500 text-xs mt-1">{errors.studentNumber}</p>}
          </div>
        )}

        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-blue-800">Address Information</h2>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
          <input
            type="text"
            name="addressLine1"
            value={form.addressLine1}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2.5 w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
          <input
            type="text"
            name="addressLine2"
            value={form.addressLine2}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2.5 w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 3</label>
          <input
            type="text"
            name="addressLine3"
            value={form.addressLine3}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2.5 w-full"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg px-6 py-2.5"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Creating...
              </>
            ) : (
              'Create User'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}