import React from "react";
import { useParams } from "react-router-dom";
import { Phone, Award, CheckCircle } from "lucide-react";
import { useAppState } from "../../hooks/useAppState.js";

export const ProfilePage = () => {
  const { id } = useParams();
  const { state } = useAppState();

  const user = state.users.find((u) => u.id === id);
  const isOwnProfile = id === state.currentUserId;

  const userTasks = state.tasks.filter(
    (t) => t.workerId === id || t.posterId === id
  );

  const completedTasks = userTasks.filter((t) => t.status === "paid");
  const postedTasks = userTasks.filter((t) => t.posterId === id);

  if (!user) {
    return <div className="text-center py-8">User not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg p-6 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-blue-600">
            {user.name.charAt(0)}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>

        <div className="flex items-center justify-center space-x-2 mt-2">
          <Phone size={16} className="text-gray-500" />
          <span className="text-gray-600">{user.phone}</span>
        </div>

        {user.trusted && (
          <div className="flex items-center justify-center space-x-2 mt-3">
            <Award size={16} className="text-green-600" />
            <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
              Trusted User
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {user.completedCount}
          </div>
          <div className="text-sm text-gray-600">Tasks Completed</div>
        </div>

        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            ₦{user.earnings.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Earnings</div>
        </div>
      </div>

      {/* Trust Status */}
      <div className="bg-white rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Trust Status</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Completed Tasks</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {user.completedCount} / 3
              </span>
              {user.completedCount >= 3 && (
                <CheckCircle size={16} className="text-green-600" />
              )}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                user.trusted ? "bg-green-600" : "bg-blue-600"
              }`}
              style={{
                width: `${Math.min((user.completedCount / 3) * 100, 100)}%`,
              }}
            />
          </div>

          <p className="text-xs text-gray-500">
            {user.trusted
              ? "This user has earned the Trusted badge!"
              : `${
                  3 - user.completedCount
                } more completed tasks to become Trusted`}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>

        {completedTasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No completed tasks yet</p>
        ) : (
          <div className="space-y-2">
            {completedTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {task.confirmedAt &&
                      new Date(task.confirmedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm font-medium text-green-600">
                  +₦{task.pay.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Posted Tasks (if viewing own profile or has posted tasks) */}
      {(isOwnProfile || postedTasks.length > 0) && (
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Posted Tasks</h3>

          {postedTasks.length === 0 ? (
            <p className="text-gray-500 text-sm">No tasks posted yet</p>
          ) : (
            <div className="space-y-2">
              {postedTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ₦{task.pay.toLocaleString()}
                    </p>
                    <p
                      className={`text-xs ${
                        task.status === "paid"
                          ? "text-green-600"
                          : task.status === "completed"
                          ? "text-blue-600"
                          : task.status === "reserved"
                          ? "text-orange-600"
                          : "text-gray-600"
                      }`}
                    >
                      {task.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
