import React from 'react';
import { RefreshCw, Users, Clock, Zap } from 'lucide-react';
import { useAppState } from '../hooks/useAppState.js';
import { resetDemo } from '../utils/storage.js';

export const AdminPage = () => {
  const { state, updateState, switchUser, updateTask } = useAppState();

  const handleResetDemo = () => {
    if (confirm('Reset all demo data? This will restore original sample data.')) {
      const freshData = resetDemo();
      updateState(freshData);
      alert('Demo data has been reset!');
    }
  };

  const handleTriggerAutoPick = () => {
    const applicationTasks = state.tasks.filter(t => 
      t.mode === 'applications' && 
      t.status === 'active' && 
      t.applicants.length > 0
    );

    if (applicationTasks.length === 0) {
      alert('No tasks with applications to auto-pick from');
      return;
    }

    applicationTasks.forEach(task => {
      // Sort by: trusted users first, then by distance, then by application time
      const sortedApplicants = [...task.applicants].sort((a, b) => {
        const userA = state.users.find(u => u.id === a.userId);
        const userB = state.users.find(u => u.id === b.userId);
        
        // Trusted status (trusted first)
        if (userA?.trusted && !userB?.trusted) return -1;
        if (!userA?.trusted && userB?.trusted) return 1;
        
        // Distance (closer first)
        if (a.distance !== b.distance) return a.distance - b.distance;
        
        // Application time (earlier first)
        return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
      });

      const selectedApplicant = sortedApplicants[0];
      
      updateTask(task.id, {
        status: 'reserved',
        workerId: selectedApplicant.userId,
        reservedAt: new Date().toISOString()
      });
    });

    alert(`Auto-picked workers for ${applicationTasks.length} tasks based on trust, distance, and application time`);
  };

  const handleSimulate6Hours = () => {
    const completedTasks = state.tasks.filter(t => t.status === 'completed');
    
    if (completedTasks.length === 0) {
      alert('No completed tasks to trigger alerts for');
      return;
    }

    completedTasks.forEach(task => {
      // Set completed time to 7 hours ago to trigger alert
      const sevenHoursAgo = new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString();
      updateTask(task.id, {
        completedAt: sevenHoursAgo,
        taskManagerAlerted: true
      });
    });

    alert(`Simulated 6-hour timeout for ${completedTasks.length} completed tasks. Check Manager dashboard.`);
  };

  const exportToGitHub = () => {
    const instructions = `
To export this project to GitHub:

1. Initialize Git repository:
   git init
   git add .
   git commit -m "Initial commit: Micro-Task Market demo"

2. Create GitHub repository:
   - Go to https://github.com/new
   - Name it "micro-task-market"
   - Don't initialize with README (we already have one)

3. Push to GitHub:
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/micro-task-market.git
   git push -u origin main

4. Deploy to Vercel:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project
   - Click Deploy!

Your app will be live at: https://micro-task-market.vercel.app
    `;

    alert(instructions);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600">Demo management and user switching</p>
      </div>

      {/* Current User */}
      <div className="bg-white rounded-lg p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Current User</h2>
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <p className="font-medium text-blue-900">
              {state.users.find(u => u.id === state.currentUserId)?.name}
            </p>
            <p className="text-sm text-blue-700">
              {state.users.find(u => u.id === state.currentUserId)?.phone}
            </p>
          </div>
          {state.users.find(u => u.id === state.currentUserId)?.trusted && (
            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
              Trusted
            </span>
          )}
        </div>
      </div>

      {/* User Switching */}
      <div className="bg-white rounded-lg p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Switch User</h2>
        <div className="grid grid-cols-1 gap-2">
          {state.users.map(user => (
            <button
              key={user.id}
              onClick={() => switchUser(user.id)}
              disabled={user.id === state.currentUserId}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                user.id === state.currentUserId
                  ? 'bg-blue-50 border-blue-200 cursor-not-allowed'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="text-left">
                <p className={`font-medium ${
                  user.id === state.currentUserId ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {user.name}
                  {user.id === state.currentUserId && ' (Current)'}
                </p>
                <p className="text-sm text-gray-600">
                  {user.phone} • {user.completedCount} tasks • ₦{user.earnings.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {user.trusted && (
                  <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    Trusted
                  </span>
                )}
                {user.name === 'Sani' && (
                  <span className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                    Task Manager
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Demo Actions */}
      <div className="bg-white rounded-lg p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Demo Actions</h2>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={handleTriggerAutoPick}
            className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Zap size={20} className="text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-purple-900">Trigger Auto-pick Now</p>
              <p className="text-sm text-purple-700">
                Automatically select workers for tasks with applications
              </p>
            </div>
          </button>

          <button
            onClick={handleSimulate6Hours}
            className="flex items-center space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <Clock size={20} className="text-orange-600" />
            <div className="text-left">
              <p className="font-medium text-orange-900">Simulate 6-hour No-response Alert</p>
              <p className="text-sm text-orange-700">
                Trigger Task Manager alerts for completed tasks
              </p>
            </div>
          </button>

          <button
            onClick={handleResetDemo}
            className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RefreshCw size={20} className="text-gray-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Reset Demo</p>
              <p className="text-sm text-gray-700">
                Restore original sample data and clear all changes
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Export */}
      <div className="bg-white rounded-lg p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Export Project</h2>
        <button
          onClick={exportToGitHub}
          className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors w-full"
        >
          <Users size={20} className="text-green-600" />
          <div className="text-left">
            <p className="font-medium text-green-900">Export to GitHub & Deploy</p>
            <p className="text-sm text-green-700">
              Get instructions for GitHub push and Vercel deployment
            </p>
          </div>
        </button>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-lg p-4">
        <h2 className="font-semibold text-gray-900 mb-3">System Info</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Total Tasks</p>
            <p className="font-medium">{state.tasks.length}</p>
          </div>
          <div>
            <p className="text-gray-600">Active Tasks</p>
            <p className="font-medium">{state.tasks.filter(t => t.status === 'active').length}</p>
          </div>
          <div>
            <p className="text-gray-600">Completed Tasks</p>
            <p className="font-medium">{state.tasks.filter(t => t.status === 'paid').length}</p>
          </div>
          <div>
            <p className="text-gray-600">Disputed Tasks</p>
            <p className="font-medium">{state.tasks.filter(t => t.status === 'disputed').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};