import React, { useState, useEffect } from "react";
import { TaskCard } from "../../components/TaskCard.jsx";
import { tasks } from "../../lib/api.js";
import { useAuth } from "../../contexts/AuthProvider.jsx";

export const TasksPage = () => {
  const { currentUser } = useAuth();
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params = {};

      if (filter === "available") {
        params.status = "active";
      } else if (filter === "my-jobs") {
        params.workerId = currentUser?.id;
      }

      const data = await tasks.list(params);
      setTaskList(data.tasks || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setTaskList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = () => {
    loadTasks(); // Refresh tasks after any update
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading tasks: {error}</p>
        <button
          onClick={loadTasks}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
        <div className="text-sm text-gray-600">{taskList.length} tasks</div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setFilter("all")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => setFilter("available")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            filter === "available"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Available
        </button>
        <button
          onClick={() => setFilter("my-jobs")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            filter === "my-jobs"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          My Jobs
        </button>
      </div>

      {/* Task List */}
      {taskList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {filter === "available"
              ? "No available tasks at the moment"
              : filter === "my-jobs"
              ? "You haven't taken any jobs yet"
              : "No tasks found"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {taskList.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              currentUser={currentUser}
              onUpdate={handleTaskUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};
