// components/DeleteConfirmationModal.jsx
import React from 'react';

const DeleteConfirmationModal = ({ user, onClose, onConfirm, loading, userType = 'admin' }) => {
  if (!user) return null;

  const userTypeLabel = userType.charAt(0).toUpperCase() + userType.slice(1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600">Confirm Delete</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete this {userType} user?
          </p>
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-600">
              {userType === 'admin' || userType === 'lecturer' ? user.staffNumber : user.studentNumber}
            </p>
          </div>
          <p className="text-red-600 text-sm mt-2">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Deleting...
              </>
            ) : (
              'Yes, Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;