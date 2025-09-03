// // components/UserTable.jsx
// import React, { useState } from 'react';
// import { api } from '../api';
// import UserModal from './UserModal';

// export default function UserTable({ users, userType, onUpdate, onDelete }) {
//   const [editingUser, setEditingUser] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setShowModal(true);
//   };

//   const handleDelete = async (userId) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       try {
//         await api.delete(`/api/user/${userId}`);
//         onDelete();
//       } catch (error) {
//         console.error('Error deleting user:', error);
//       }
//     }
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//     setEditingUser(null);
//   };

//   const handleModalSuccess = () => {
//     onUpdate();
//     handleModalClose();
//   };

//   return (
//     <>
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="text-left p-3 font-medium text-gray-700">ID</th>
//               <th className="text-left p-3 font-medium text-gray-700">Username</th>
//               <th className="text-left p-3 font-medium text-gray-700">Name</th>
//               <th className="text-left p-3 font-medium text-gray-700">Email</th>
//               <th className="text-left p-3 font-medium text-gray-700">Phone Number</th>
//                {userType === 'admin' && <th className="text-left p-3 font-medium text-gray-700">Staff Number</th>}
//               {userType === 'lecturer' && <th className="text-left p-3 font-medium text-gray-700">Staff Number</th>}
//               {userType === 'student' && <th className="text-left p-3 font-medium text-gray-700">Student Number</th>}
//               <th className="text-left p-3 font-medium text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map(user => (
//               <tr key={user.id} className="border-t hover:bg-gray-50">
//                 <td className="p-3">{user.id}</td>
//                 <td className="p-3 font-medium">{user.username}</td>
//                 <td className="p-3">{user.firstName} {user.lastName}</td>
//                 <td className="p-3">{user.email}</td>
//                 <td className="p-3">{user.phone}</td>
//                 {/* <td className="p-3">
//                   <span className={`px-2 py-1 rounded-full text-xs ${
//                     user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
//                     user.role === 'LECTURER' ? 'bg-green-100 text-green-800' :
//                     'bg-purple-100 text-purple-800'
//                   }`}>
//                     {user.role}
//                   </span>
//                 </td> */}
//                 {userType === 'admin' && <td className="p-3">{user.staffNumber}</td>}
//                 {userType === 'lecturer' && <td className="p-3">{user.staffNumber}</td>}
//                 {userType === 'student' && <td className="p-3">{user.studentNumber}</td>}
//                 <td className="p-3 space-x-2">
//                   <button
//                     onClick={() => handleEdit(user)}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
//                   >
//                     <i className="fas fa-edit mr-1"></i>Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(user.id)}
//                     className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
//                   >
//                     <i className="fas fa-trash mr-1"></i>Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {showModal && (
//         <UserModal
//           user={editingUser}
//           onClose={handleModalClose}
//           onSuccess={handleModalSuccess}
//         />
//       )}
//     </>
//   );
// }


// components/UserTable.jsx
import React, { useState } from 'react';
import { api } from '../api';
import UserModal from './UserModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function UserTable({ users, userType, onUpdate, onDelete }) {
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleDeleteClick = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      // Use role-specific delete endpoints
      if (userType === 'admin') {
        await api.delete(`/api/admin/${deletingUser.id}`);
      } else if (userType === 'lecturer') {
        await api.delete(`/api/lecturer/${deletingUser.id}`);
      } else if (userType === 'student') {
        await api.delete(`/api/student/${deletingUser.id}`);
      }
      
      onDelete();
      setShowDeleteModal(false);
      setDeletingUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleModalSuccess = () => {
    onUpdate();
    handleModalClose();
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 font-medium text-gray-700">ID</th>
              <th className="text-left p-3 font-medium text-gray-700">Name</th>
              <th className="text-left p-3 font-medium text-gray-700">Email</th>
              <th className="text-left p-3 font-medium text-gray-700">Phone Number</th>
              {userType === 'admin' && <th className="text-left p-3 font-medium text-gray-700">Staff Number</th>}
              {userType === 'lecturer' && <th className="text-left p-3 font-medium text-gray-700">Staff Number</th>}
              {userType === 'student' && <th className="text-left p-3 font-medium text-gray-700">Student Number</th>}
              <th className="text-left p-3 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{user.id}</td>
                
                <td className="p-3">{user.firstName} {user.lastName}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone}</td>
                {userType === 'admin' && <td className="p-3">{user.staffNumber}</td>}
                {userType === 'lecturer' && <td className="p-3">{user.staffNumber}</td>}
                {userType === 'student' && <td className="p-3">{user.studentNumber}</td>}
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    <i className="fas fa-edit mr-1"></i>Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    <i className="fas fa-trash mr-1"></i>Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <UserModal
          user={editingUser}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          userType={userType}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          user={deletingUser}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading}
          userType={userType}
        />
      )}
    </>
  );
}