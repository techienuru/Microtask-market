import React, { useState } from 'react';
import { TaskCard } from '../components/TaskCard.jsx';
import { useAppState } from '../hooks/useAppState.js';

export const Home = () => {
  const { state, updateTask, addNotification } = useAppState();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [applicationNote, setApplicationNote] = useState('');

  const currentUser = state.users.find(u => u.id === state.currentUserId);
  const activeTasks = state.tasks.filter(t => t.status === 'active');

  const handleTakeJob = (taskId) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || !currentUser) return;

    updateTask(taskId, {
      status: 'reserved',
      workerId: state.currentUserId,
      reservedAt: new Date().toISOString()
    });

    // Notify poster
    addNotification({
      id: `notif_${Date.now()}`,
      userId: task.posterId,
      title: 'Job Taken',
      message: `${currentUser.name} has taken your job: ${task.title}`,
      taskId: taskId,
      createdAt: new Date().toISOString(),
      read: false
    });
  };

  const handleApply = (taskId) => {
    setSelectedTaskId(taskId);
    setShowApplicationModal(true);
  };

  const submitApplication = () => {
    const task = state.tasks.find(t => t.id === selectedTaskId);
    if (!task || !currentUser) return;

    const newApplicant = {
      userId: state.currentUserId,
      note: applicationNote,
      appliedAt: new Date().toISOString(),
      distance: Math.random() * 10 // Mock distance
    };

    updateTask(selectedTaskId, {
      applicants: [...task.applicants, newApplicant]
    });

    // Notify poster
    addNotification({
      id: `notif_${Date.now()}`,
      userId: task.posterId,
      title: 'New Application',
      message: `${currentUser.name} applied for: ${task.title}`,
      taskId: selectedTaskId,
      createdAt: new Date().toISOString(),
      read: false
    });

    setShowApplicationModal(false);
    setApplicationNote('');
    setSelectedTaskId('');
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Available Tasks</h1>
        <div className="text-sm text-gray-600">
          {activeTasks.length} active
        </div>
      </div>

      {activeTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No active tasks available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              currentUserId={state.currentUserId}
              users={state.users}
              onTakeJob={handleTakeJob}
              onApply={handleApply}
            />
          ))}
        </div>
      )}

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Apply for Task</h3>
            <textarea
              value={applicationNote}
              onChange={(e) => setApplicationNote(e.target.value)}
              placeholder="Add a note with your application (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows={3}
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowApplicationModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitApplication}
                className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};