import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Camera, MessageCircle } from 'lucide-react';

export const TaskCard = ({ 
  task, 
  currentUserId, 
  users,
  onTakeJob,
  onApply 
}) => {
  const poster = users.find(u => u.id === task.posterId);
  const worker = task.workerId ? users.find(u => u.id === task.workerId) : null;
  const taskManager = users.find(u => u.name === 'Sani');

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = () => {
    if (task.status === 'reserved' && worker) {
      return (
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
            Reserved by {worker.name}
          </span>
          <MessageCircle size={16} className="text-blue-600" />
        </div>
      );
    }
    
    if (task.mode === 'single') {
      return (
        <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
          Single
        </span>
      );
    }
    
    return (
      <span className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
        Applications open ({task.applicants.length}/3)
      </span>
    );
  };

  const getActionButton = () => {
    if (task.status === 'reserved' || task.status === 'completed' || task.status === 'paid') {
      return null;
    }

    if (task.mode === 'single' && onTakeJob) {
      return (
        <button
          onClick={() => onTakeJob(task.id)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Take job
        </button>
      );
    }

    if (task.mode === 'applications' && onApply) {
      const isApplied = task.applicants.some(a => a.userId === currentUserId);
      const isFull = task.applicants.length >= 3;
      
      return (
        <button
          onClick={() => onApply(task.id)}
          disabled={isApplied || isFull}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isApplied || isFull
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isApplied ? 'Applied' : isFull ? 'Full (3/3)' : 'Apply'}
        </button>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <Link 
          to={`/task/${task.id}`} 
          className="flex-1 hover:text-blue-600 transition-colors"
        >
          <h3 className="font-semibold text-gray-900">{task.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        </Link>
        <div className="flex items-center space-x-2 ml-3">
          <span className="text-lg font-bold text-green-600">
            ₦{task.pay.toLocaleString()}
          </span>
          {task.proofRequired && (
            <Camera size={16} className="text-gray-500" />
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <MapPin size={14} />
          <span>{task.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar size={14} />
          <span>{formatDateTime(task.dateTime)}</span>
        </div>
      </div>

      {/* Escrow Badge */}
      {task.escrowRequired && (
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
            Escrow required
          </span>
        </div>
      )}

      {/* Status Badge */}
      <div className="flex items-center justify-between">
        {getStatusBadge()}
      </div>

      {/* Task Manager Info */}
      {taskManager && (
        <div className="text-xs text-gray-500 border-t pt-2">
          Task Manager: {taskManager.name} — {taskManager.phone}
        </div>
      )}

      {/* Action Button */}
      {getActionButton()}
    </div>
  );
};