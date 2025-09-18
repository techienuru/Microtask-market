import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Camera } from 'lucide-react';
import { useAppState } from '../hooks/useAppState.js';
import { ImageUpload } from '../components/ImageUpload.jsx';

export const PostTask = () => {
  const navigate = useNavigate();
  const { state, addTask } = useAppState();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pay: '',
    location: '',
    dateTime: '',
    mode: 'single',
    proofRequired: true,
    escrowRequired: false
  });
  const [escrowProof, setEscrowProof] = useState('');

  const currentUser = state.users.find(u => u.id === state.currentUserId);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.pay || !formData.location || !formData.dateTime) {
      alert('Please fill in all required fields');
      return;
    }

    const payAmount = parseFloat(formData.pay);
    if (payAmount < 0) {
      alert('Pay amount must be positive');
      return;
    }

    if (payAmount >= 5000 && !formData.escrowRequired) {
      alert('Tasks with pay ≥ ₦5000 require escrow');
      return;
    }

    if (formData.escrowRequired && !escrowProof) {
      alert('Please upload transfer screenshot for escrow');
      return;
    }

    const newTask = {
      id: `task_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      pay: payAmount,
      location: formData.location,
      dateTime: formData.dateTime,
      mode: formData.mode,
      status: 'active',
      posterId: state.currentUserId,
      applicants: [],
      proofRequired: formData.proofRequired,
      escrowRequired: formData.escrowRequired,
      escrowProof: escrowProof,
      createdAt: new Date().toISOString()
    };

    addTask(newTask);
    navigate('/');
  };

  const handlePayChange = (value) => {
    const payAmount = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      pay: value,
      escrowRequired: payAmount >= 5000
    }));
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Post New Task</h1>
        <p className="text-gray-600">Create a task for others to complete</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Clean market stall"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Provide more details about the task..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>

        {/* Pay */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pay Amount (₦) *
          </label>
          <input
            type="number"
            value={formData.pay}
            onChange={(e) => handlePayChange(e.target.value)}
            placeholder="1000"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            step="50"
            required
          />
          {parseFloat(formData.pay) >= 5000 && (
            <p className="text-sm text-yellow-600 mt-1">
              ⚠️ Tasks ≥ ₦5000 require escrow
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin size={16} className="inline mr-1" />
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g., Ikeja Market"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Date & Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-1" />
            Date & Time *
          </label>
          <input
            type="datetime-local"
            value={formData.dateTime}
            onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, mode: 'single' }))}
              className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                formData.mode === 'single'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Single (First Come)
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, mode: 'applications' }))}
              className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                formData.mode === 'applications'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Accept Applications
            </button>
          </div>
        </div>

        {/* Proof Required */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="proofRequired"
            checked={formData.proofRequired}
            onChange={(e) => setFormData(prev => ({ ...prev, proofRequired: e.target.checked }))}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="proofRequired" className="text-sm text-gray-700">
            <Camera size={16} className="inline mr-1" />
            Require photo proof when completed
          </label>
        </div>

        {/* Escrow */}
        {formData.escrowRequired && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-yellow-800">
                Escrow Required (Pay ≥ ₦5000)
              </span>
            </div>
            <p className="text-sm text-yellow-700">
              Please upload a screenshot of your transfer to show funds are available
            </p>
            <ImageUpload
              label="Upload transfer screenshot"
              onImageSelect={setEscrowProof}
              onImageRemove={() => setEscrowProof('')}
              currentImage={escrowProof}
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Post Task
        </button>
      </form>
    </div>
  );
};