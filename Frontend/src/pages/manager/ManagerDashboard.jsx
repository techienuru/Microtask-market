import React from "react";
import { Phone, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useAppState } from "../../hooks/useAppState.js";

export const ManagerPage = () => {
  const { state, updateTask, addNotification, updateUser } = useAppState();

  const disputedTasks = state.tasks.filter((t) => t.status === "disputed");
  const completedTasks = state.tasks.filter(
    (t) =>
      t.status === "completed" &&
      t.completedAt &&
      Date.now() - new Date(t.completedAt).getTime() > 6 * 60 * 60 * 1000 // 6 hours
  );

  const handleResolveDispute = (taskId, resolution) => {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const worker = task.workerId
      ? state.users.find((u) => u.id === task.workerId)
      : null;
    const poster = state.users.find((u) => u.id === task.posterId);

    let payAmount = 0;
    let status = "paid";

    switch (resolution) {
      case "paid":
        payAmount = task.pay;
        status = "paid";
        break;
      case "partial":
        payAmount = Math.floor(task.pay * 0.5);
        status = "paid";
        break;
      case "rework":
        status = "active";
        break;
    }

    updateTask(taskId, {
      status,
      confirmedAt: new Date().toISOString(),
      disputeReason: undefined,
      taskManagerAlerted: false,
    });

    if (worker && payAmount > 0) {
      const newEarnings = worker.earnings + payAmount;
      const newCompletedCount =
        resolution === "paid"
          ? worker.completedCount + 1
          : worker.completedCount;
      const shouldBeTrusted = newCompletedCount >= 3;

      updateUser(worker.id, {
        earnings: newEarnings,
        completedCount: newCompletedCount,
        trusted: shouldBeTrusted,
      });

      addNotification({
        id: `notif_${Date.now()}`,
        userId: worker.id,
        title: "Dispute Resolved",
        message: `Task Manager resolved dispute. You received ₦${payAmount.toLocaleString()} for: ${
          task.title
        }`,
        taskId: taskId,
        createdAt: new Date().toISOString(),
        read: false,
      });
    }

    if (poster) {
      addNotification({
        id: `notif_${Date.now() + 1}`,
        userId: poster.id,
        title: "Dispute Resolved",
        message: `Task Manager resolved dispute for: ${task.title}`,
        taskId: taskId,
        createdAt: new Date().toISOString(),
        read: false,
      });
    }
  };

  const handleCallUser = (userId) => {
    const user = state.users.find((u) => u.id === userId);
    if (user) {
      alert(`Calling ${user.name} at ${user.phone}...`);
    }
  };

  const formatTimeAgo = (dateString) => {
    const hours = Math.floor(
      (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60)
    );
    return `${hours}h ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Task Manager Dashboard
        </h1>
        <p className="text-gray-600">Manage disputes and confirmations</p>
      </div>

      {/* Active Disputes */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle size={20} className="text-red-600" />
          <h2 className="font-semibold text-gray-900">Active Disputes</h2>
          <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
            {disputedTasks.length}
          </span>
        </div>

        {disputedTasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No active disputes</p>
        ) : (
          <div className="space-y-4">
            {disputedTasks.map((task) => {
              const poster = state.users.find((u) => u.id === task.posterId);
              const worker = task.workerId
                ? state.users.find((u) => u.id === task.workerId)
                : null;

              return (
                <div
                  key={task.id}
                  className="border border-red-200 rounded-lg p-4 bg-red-50"
                >
                  <div className="mb-3">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-red-700 mt-1">
                      {task.disputeReason}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Pay: ₦{task.pay.toLocaleString()} • {task.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {poster && (
                      <div className="text-sm">
                        <p className="font-medium text-gray-700">Poster</p>
                        <p className="text-gray-600">{poster.name}</p>
                        <button
                          onClick={() => handleCallUser(poster.id)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 mt-1"
                        >
                          <Phone size={14} />
                          <span>{poster.phone}</span>
                        </button>
                      </div>
                    )}

                    {worker && (
                      <div className="text-sm">
                        <p className="font-medium text-gray-700">Worker</p>
                        <p className="text-gray-600">{worker.name}</p>
                        <button
                          onClick={() => handleCallUser(worker.id)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 mt-1"
                        >
                          <Phone size={14} />
                          <span>{worker.phone}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleResolveDispute(task.id, "paid")}
                      className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Mark Paid
                    </button>
                    <button
                      onClick={() => handleResolveDispute(task.id, "partial")}
                      className="px-3 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                    >
                      Partial Pay
                    </button>
                    <button
                      onClick={() => handleResolveDispute(task.id, "rework")}
                      className="px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                    >
                      Rework
                    </button>
                    <button
                      onClick={() =>
                        alert("Escalating to higher management...")
                      }
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Escalate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pending Confirmations */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Clock size={20} className="text-orange-600" />
          <h2 className="font-semibold text-gray-900">
            Pending Confirmations (6h+)
          </h2>
          <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
            {completedTasks.length}
          </span>
        </div>

        {completedTasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No overdue confirmations</p>
        ) : (
          <div className="space-y-4">
            {completedTasks.map((task) => {
              const poster = state.users.find((u) => u.id === task.posterId);
              const worker = task.workerId
                ? state.users.find((u) => u.id === task.workerId)
                : null;

              return (
                <div
                  key={task.id}
                  className="border border-orange-200 rounded-lg p-4 bg-orange-50"
                >
                  <div className="mb-3">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-orange-700">
                      Completed{" "}
                      {task.completedAt && formatTimeAgo(task.completedAt)} - No
                      response from poster
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Pay: ₦{task.pay.toLocaleString()} • {task.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {poster && (
                      <div className="text-sm">
                        <p className="font-medium text-gray-700">
                          Poster (No Response)
                        </p>
                        <p className="text-gray-600">{poster.name}</p>
                        <button
                          onClick={() => handleCallUser(poster.id)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 mt-1"
                        >
                          <Phone size={14} />
                          <span>{poster.phone}</span>
                        </button>
                      </div>
                    )}

                    {worker && (
                      <div className="text-sm">
                        <p className="font-medium text-gray-700">Worker</p>
                        <p className="text-gray-600">{worker.name}</p>
                        <button
                          onClick={() => handleCallUser(worker.id)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 mt-1"
                        >
                          <Phone size={14} />
                          <span>{worker.phone}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleResolveDispute(task.id, "paid")}
                      className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Mark Resolved: Paid
                    </button>
                    <button
                      onClick={() => handleResolveDispute(task.id, "partial")}
                      className="px-3 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                    >
                      Partial Payment
                    </button>
                    <button
                      onClick={() =>
                        alert("Escalating to higher management...")
                      }
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Escalate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Resolutions */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle size={20} className="text-green-600" />
          <h2 className="font-semibold text-gray-900">Recent Resolutions</h2>
        </div>

        <div className="space-y-2">
          {state.tasks
            .filter((t) => t.status === "paid" && t.confirmedAt)
            .slice(0, 5)
            .map((task) => {
              const worker = task.workerId
                ? state.users.find((u) => u.id === task.workerId)
                : null;

              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Resolved • {worker?.name} •{" "}
                      {task.confirmedAt &&
                        new Date(task.confirmedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    ₦{task.pay.toLocaleString()}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
