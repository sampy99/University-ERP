// components/ResultForm.js
import React, { useState } from 'react';
import { api } from '../api';

const ResultForm = ({ student, courseId, onSuccess }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    grade: student.result?.grade || '',
    marks: student.result?.marks !== null && student.result?.marks !== undefined ? student.result.marks.toString() : ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if both grade and marks are filled
  const isFormValid = form.grade.trim() !== '' && form.marks.trim() !== '';

  // Check if we're updating an existing result
  const isUpdate = Boolean(student.result?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setError('Please fill in both grade and marks');
      return;
    }

    // Validate marks is a valid number
    const marksValue = parseFloat(form.marks);
    if (isNaN(marksValue) || marksValue < 0 || marksValue > 100) {
      setError('Please enter a valid marks value between 0 and 100');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isUpdate) {
        // UPDATE existing result
        await api.put(`/api/results/${student.result.id}`, {
          grade: form.grade.trim(),
          marks: marksValue
        });
      } else {
        // CREATE new result
        await api.post('/api/results', {
          student: Number(student.id),
          course: Number(courseId),
          grade: form.grade.trim(),
          marks: marksValue
        });
      }
      
      onSuccess();
      setShowForm(false);
      setForm({ grade: '', marks: '' });
      
    } catch (error) {
      console.error('Error saving result:', error);
      setError(error.response?.data?.message || 'Failed to save result');
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (e) => {
    const value = e.target.value;
    
    // Allow only numbers, decimal point, and empty string
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      // Prevent multiple decimal points
      if ((value.match(/\./g) || []).length <= 1) {
        setForm({ ...form, marks: value });
      }
    }
  };

  const handleMarksBlur = (e) => {
    const value = e.target.value;
    if (value && value !== '.') {
      // Format to 2 decimal places on blur
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setForm({ ...form, marks: numValue.toFixed(2) });
      }
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="bg-green-500 text-white px-3 py-1.5 rounded text-sm hover:bg-green-600 transition-colors"
      >
        {isUpdate ? 'Update' : 'Add'} Result
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {isUpdate ? 'Update' : 'Add'} Result for {student.firstName} {student.lastName}
          </h3>
          <button
            onClick={() => {
              setShowForm(false);
              setError('');
              setForm({ 
                grade: student.result?.grade || '', 
                marks: student.result?.marks !== null && student.result?.marks !== undefined ? student.result.marks.toString() : '' 
              });
            }}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade *
            </label>
            <select
              value={form.grade}
              onChange={(e) => setForm({...form, grade: e.target.value})}
              className="border border-gray-300 rounded p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Grade</option>
              <option value="A+">A+ (90-100)</option>
              <option value="A">A (85-89)</option>
              <option value="A-">A- (80-84)</option>
              <option value="B+">B+ (75-79)</option>
              <option value="B">B (70-74)</option>
              <option value="B-">B- (65-69)</option>
              <option value="C+">C+ (60-64)</option>
              <option value="C">C (55-59)</option>
              <option value="C-">C- (50-54)</option>
              <option value="D+">D+ (45-49)</option>
              <option value="D">D (40-44)</option>
              <option value="E">E (35-39)</option>
              <option value="F">F (0-34)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marks *
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={form.marks}
              onChange={handleMarksChange}
              onBlur={handleMarksBlur}
              className="border border-gray-300 rounded p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter marks (0.00 - 100.00)"
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              Enter marks between 0.00 - 100.00 (supports decimal values)
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError('');
                setForm({ 
                  grade: student.result?.grade || '', 
                  marks: student.result?.marks !== null && student.result?.marks !== undefined ? student.result.marks.toString() : '' 
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`px-4 py-2 rounded text-white transition-colors ${
                loading || !isFormValid
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  {isUpdate ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                isUpdate ? 'Update Result' : 'Save Result'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResultForm;