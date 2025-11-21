import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Camera,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useAppState } from "../../hooks/useAppState.js";
import { ImageUpload } from "../../components/ImageUpload.jsx";

export const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, updateTask, updateUser, addNotification } = useAppState();

  const [proofData, setProofData] = useState({
    type: "photo",
  });

  const task = state.tasks.find((t) => t.id === id);
  const currentUser = state.users.find((u) => u.id === state.currentUserId);
  const poster = task ? state.users.find((u) => u.id === task.posterId) : null;
  const worker = task?.workerId
    ? state.users.find((u) => u.id === task.workerId)
    : null;

  if (!task || !currentUser) {
    return <div className="text-center py-8">Task not found</div>;
  }

  const isWorker = task.workerId === state.currentUserId;
  const isPoster = task.posterId === state.currentUserId;

  const handleMarkDone = () => {
    if (!task.proofRequired) {
      updateTask(task.id, {
        status: "completed",
        completedAt: new Date().toISOString(),
      });

      if (poster) {
        addNotification({
          id: `notif_${Date.now()}`,
          userId: poster.id,
          title: "Task Completed",
          message: `${currentUser.name} marked task as completed: ${task.title}`,
          taskId: task.id,
          createdAt: new Date().toISOString(),
          read: false,
        });
      }
      return;
    }

    if (!proofData.beforeImage || !proofData.afterImage) {
      alert("Please upload both before and after photos");
      return;
    }

    const proof = {
      type: proofData.type || "photo",
      beforeImage: proofData.beforeImage,
      afterImage: proofData.afterImage,
      code: proofData.code,
      submittedAt: new Date().toISOString(),
    };

    updateTask(task.id, {
      status: "completed",
      completedAt: new Date().toISOString(),
      proofSubmitted: proof,
    });

    if (poster) {
      addNotification({
        id: `notif_${Date.now()}`,
        userId: poster.id,
        title: "Task Completed - Review Required",
        message: `${currentUser.name} completed task with proof: ${task.title}`,
        taskId: task.id,
        createdAt: new Date().toISOString(),
        read: false,
      });
    }
  };

  const handleConfirmCompleted = () => {
    if (!worker) return;

    const newEarnings = worker.earnings + task.pay;
    const newCompletedCount = worker.completedCount + 1;
    const shouldBeTrusted = newCompletedCount >= 3;

    updateUser(worker.id, {
      earnings: newEarnings,
      completedCount: newCompletedCount,
      trusted: shouldBeTrusted,
    });

    updateTask(task.id, {
      status: "paid",
      confirmedAt: new Date().toISOString(),
    });

    addNotification({
      id: `notif_${Date.now()}`,
      userId: worker.id,
      title: shouldBeTrusted
        ? "Payment Received - You're now Trusted!"
        : "Payment Received",
      message: `You received ₦${task.pay.toLocaleString()} for: ${task.title}${
        shouldBeTrusted ? " And you've earned your Trusted badge!" : ""
      }`,
      taskId: task.id,
      createdAt: new Date().toISOString(),
      read: false,
    });
  };

  const handleDispute = () => {
    const reason = prompt("Please describe the issue with this task:");
    if (!reason) return;

    updateTask(task.id, {
      status: "disputed",
      disputeReason: reason,
      taskManagerAlerted: true,
    });

    const taskManager = state.users.find((u) => u.name === "Sani");
    if (taskManager) {
      addNotification({
        id: `notif_${Date.now()}`,
        userId: taskManager.id,
        title: "Task Dispute",
        message: `Dispute raised for task: ${task.title}`,
        taskId: task.id,
        createdAt: new Date().toISOString(),
        read: false,
      });
    }
  };

  const handleWasntPaid = () => {
    updateTask(task.id, {
      status: "disputed",
      disputeReason: "Worker reports not being paid",
      taskManagerAlerted: true,
    });

    const taskManager = state.users.find((u) => u.name === "Sani");
    if (taskManager) {
      addNotification({
        id: `notif_${Date.now()}`,
        userId: taskManager.id,
        title: "Payment Dispute",
        message: `${currentUser.name} reports not being paid for: ${task.title}`,
        taskId: task.id,
        createdAt: new Date().toISOString(),
        read: false,
      });
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 text-sm mb-2"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
        <div className="flex items-center space-x-4 mt-2">
          <span className="text-xl font-bold text-green-600">
            ₦{task.pay.toLocaleString()}
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              task.status === "paid"
                ? "text-green-700 bg-green-100"
                : task.status === "completed"
                ? "text-blue-700 bg-blue-100"
                : task.status === "disputed"
                ? "text-red-700 bg-red-100"
                : task.status === "reserved"
                ? "text-orange-700 bg-orange-100"
                : "text-gray-700 bg-gray-100"
            }`}
          >
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-lg p-4 space-y-3">
        <p className="text-gray-700">{task.description}</p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <MapPin size={16} />
            <span>{task.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar size={16} />
            <span>{formatDateTime(task.dateTime)}</span>
          </div>
        </div>

        {poster && (
          <div className="border-t pt-3">
            <p className="text-sm text-gray-600">
              Posted by: <span className="font-medium">{poster.name}</span>
              {poster.trusted && (
                <span className="ml-2 px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                  Trusted
                </span>
              )}
            </p>
          </div>
        )}

        {worker && (
          <div className="border-t pt-3">
            <p className="text-sm text-gray-600">
              Worker: <span className="font-medium">{worker.name}</span>
              {worker.trusted && (
                <span className="ml-2 px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                  Trusted
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Escrow Proof */}
      {task.escrowRequired && task.escrowProof && (
        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">Escrow Proof</h3>
          <img
            src={task.escrowProof}
            alt="Escrow proof"
            className="w-full max-w-sm h-32 object-cover rounded border"
          />
        </div>
      )}

      {/* Applicants (for application mode) */}
      {task.mode === "applications" &&
        task.applicants.length > 0 &&
        isPoster && (
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">
              Applicants ({task.applicants.length}/3)
            </h3>
            <div className="space-y-3">
              {task.applicants.map((applicant) => {
                const user = state.users.find((u) => u.id === applicant.userId);
                if (!user) return null;

                return (
                  <div
                    key={applicant.userId}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{user.name}</span>
                        {user.trusted && (
                          <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                            Trusted
                          </span>
                        )}
                      </div>
                      {applicant.note && (
                        <p className="text-sm text-gray-600 mt-1">
                          {applicant.note}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Applied{" "}
                        {new Date(applicant.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {task.status === "active" && (
                      <button
                        onClick={() => {
                          updateTask(task.id, {
                            status: "reserved",
                            workerId: applicant.userId,
                            reservedAt: new Date().toISOString(),
                          });
                        }}
                        className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                      >
                        Choose
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {/* Worker Actions */}
      {isWorker && task.status === "reserved" && (
        <div className="bg-white rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-gray-900">Complete Task</h3>

          {task.proofRequired && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ImageUpload
                  label="Before Photo"
                  onImageSelect={(base64) =>
                    setProofData((prev) => ({ ...prev, beforeImage: base64 }))
                  }
                  onImageRemove={() =>
                    setProofData((prev) => ({
                      ...prev,
                      beforeImage: undefined,
                    }))
                  }
                  currentImage={proofData.beforeImage}
                />
                <ImageUpload
                  label="After Photo"
                  onImageSelect={(base64) =>
                    setProofData((prev) => ({ ...prev, afterImage: base64 }))
                  }
                  onImageRemove={() =>
                    setProofData((prev) => ({ ...prev, afterImage: undefined }))
                  }
                  currentImage={proofData.afterImage}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleMarkDone}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Mark Done
          </button>
        </div>
      )}

      {/* Proof Review (for poster) */}
      {isPoster && task.status === "completed" && task.proofSubmitted && (
        <div className="bg-white rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-gray-900">Review Work Proof</h3>

          {task.proofSubmitted.beforeImage &&
            task.proofSubmitted.afterImage && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Before</p>
                  <img
                    src={task.proofSubmitted.beforeImage}
                    alt="Before"
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">After</p>
                  <img
                    src={task.proofSubmitted.afterImage}
                    alt="After"
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              </div>
            )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleConfirmCompleted}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={20} />
              <span>Confirm Completed</span>
            </button>
            <button
              onClick={handleDispute}
              className="flex items-center justify-center space-x-2 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <AlertTriangle size={20} />
              <span>Dispute / Request Rework</span>
            </button>
          </div>
        </div>
      )}

      {/* Payment Simulation */}
      {isPoster && task.status === "paid" && (
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-green-800 font-medium">Task Completed & Paid</p>
          <p className="text-sm text-green-600 mt-1">
            Worker received ₦{task.pay.toLocaleString()}
          </p>
        </div>
      )}

      {/* "I wasn't paid" button for worker */}
      {isWorker && task.status === "paid" && (
        <button
          onClick={handleWasntPaid}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          I wasn't paid
        </button>
      )}
    </div>
  );
};
