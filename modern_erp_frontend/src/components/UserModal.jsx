// // components/UserModal.js
// import React, { useState } from 'react';
// import { api } from '../api';

// const UserModal = ({ user, onClose, onSuccess }) => {


//   const [form, setForm] = useState({
//     email: user?.email || '',
//     firstName: user?.firstName || '',
//     lastName: user?.lastName || '',
//     nic: user?.nic || '',
//     phone: user?.phone || '',
//     addressLine1: user?.addressLine1 || '',
//     addressLine2: user?.addressLine2 || '',
//     addressLine3: user?.addressLine3 || '',
//     staffNumber: user?.staffNumber || '',
//     studentNumber: user?.studentNumber || '',
//     username: user?.username || '',
//     role: user?.role || 'STUDENT'
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       if (user) {
//         // Update existing user
//         await api.put(`/api/user/${user.id}`, form);
//         setMessage('User updated successfully!');
//       } else {
//         // Create new user
//         await api.post('/api/auth/signup', {
//           ...form,
//           password: 'tempPassword123' // You might want to handle this differently
//         });
//         setMessage('User created successfully!');
//       }
//       onSuccess();
//     } catch (error) {
//       setMessage('Error: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//       <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4">
//           {user ? 'Edit User' : 'Create User'}
//         </h2>
        
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Form fields similar to CreateUser page */}
//           {/* ... */}
          
//           <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//             >
//               {loading ? 'Saving...' : 'Save'}
//             </button>
//           </div>

//           {message && (
//             <div className={`md:col-span-2 p-3 rounded ${
//               message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
//             }`}>
//               {message}
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }

// export default UserModal;


// components/UserModal.js
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const UserModal = ({ user, onClose, onSuccess, userType = 'admin' }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    staffNumber: '',
    studentNumber: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        staffNumber: user.staffNumber || '',
        studentNumber: user.studentNumber || '',
        addressLine1: user.addressLine1 || '',
        addressLine2: user.addressLine2 || '',
        addressLine3: user.addressLine3 || ''
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.email.includes('@')) {
      newErrors.email = 'Email must contain @ symbol';
    }

    if (form.firstName.length > 100) {
      newErrors.firstName = 'First name cannot exceed 100 characters';
    }

    if (form.lastName.length > 100) {
      newErrors.lastName = 'Last name cannot exceed 100 characters';
    }

    const phoneRegex = /^\d{10}$/;
    if (form.phone && !phoneRegex.test(form.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
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
      if (user) {
        // Update existing user - use admin-specific endpoint
        let updatePayload;
        
        if (userType === 'admin') {
          updatePayload = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            staffNumber: form.staffNumber,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2,
            addressLine3: form.addressLine3
          };
          await api.put(`/api/admin/${user.id}`, updatePayload);
          
        } else if (userType === 'lecturer') {
          // Add lecturer-specific endpoint if needed
          updatePayload = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            staffNumber: form.staffNumber,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2,
            addressLine3: form.addressLine3
          };
          await api.put(`/api/lecturer/${user.id}`, updatePayload);
        } else if (userType === 'student') {
          // Add student-specific endpoint if needed
          updatePayload = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            studentNumber: form.studentNumber,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2,
            addressLine3: form.addressLine3
          };
          await api.put(`/api/student/${user.id}`, updatePayload);
        }

        setMessage('User updated successfully!');
      }
      onSuccess();
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setForm(prev => ({ ...prev, [name]: numericValue }));
    } else if (name === 'firstName' || name === 'lastName') {
      setForm(prev => ({ ...prev, [name]: value.slice(0, 100) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (['email', 'phone'].includes(name)) {
      validateForm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Edit {userType.charAt(0).toUpperCase() + userType.slice(1)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">Basic Information</h3>
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
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
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
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
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
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {(userType === 'admin' || userType === 'lecturer') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Staff Number *</label>
              <input
                type="text"
                name="staffNumber"
                value={form.staffNumber}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg p-2.5 w-full"
              />
            </div>
          )}

          {userType === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student Number *</label>
              <input
                type="text"
                name="studentNumber"
                value={form.studentNumber}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg p-2.5 w-full"
              />
            </div>
          )}

          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">Address Information</h3>
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

          <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update User'}
            </button>
          </div>

          {message && (
            <div className={`md:col-span-2 p-3 rounded ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default UserModal;