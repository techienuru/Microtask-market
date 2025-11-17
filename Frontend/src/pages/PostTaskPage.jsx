import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Camera, DollarSign } from "lucide-react";
import { tasks } from "../lib/api.js";
import { useAuth } from "../contexts/AuthProvider.jsx";

export const PostTaskPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pay: "",
    location: "",
    dateTime: "",
    mode: "single",
    proofRequired: true,
    category: "general",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.pay || parseFloat(formData.pay) <= 0)
      newErrors.pay = "Valid pay amount is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.dateTime) newErrors.dateTime = "Date and time is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        pay: parseFloat(formData.pay),
        location: formData.location.trim(),
        dateTime: formData.dateTime,
        mode: formData.mode,
        proofRequired: formData.proofRequired,
        category: formData.category,
      };

      await tasks.create(taskData);

      if (window.showToast) {
        window.showToast({
          message: "Task posted successfully!",
          type: "success",
        });
      }

      navigate("/tasks");
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g., Clean market stall"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? "border-red-300" : "border-gray-300"
            }`}
            required
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Provide more details about the task..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>

        {/* Pay and Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign size={16} className="inline mr-1" />
              Pay Amount (₦) *
            </label>
            <input
              type="number"
              value={formData.pay}
              onChange={(e) => handleInputChange("pay", e.target.value)}
              placeholder="1000"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.pay ? "border-red-300" : "border-gray-300"
              }`}
              min="0"
              step="50"
              required
            />
            {errors.pay && (
              <p className="mt-1 text-sm text-red-600">{errors.pay}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="general">General</option>
              <option value="cleaning">Cleaning</option>
              <option value="delivery">Delivery</option>
              <option value="repair">Repair</option>
              <option value="moving">Moving</option>
              <option value="shopping">Shopping</option>
            </select>
          </div>
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
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="e.g., Lafia New Market"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.location ? "border-red-300" : "border-gray-300"
            }`}
            required
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
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
            onChange={(e) => handleInputChange("dateTime", e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.dateTime ? "border-red-300" : "border-gray-300"
            }`}
            required
          />
          {errors.dateTime && (
            <p className="mt-1 text-sm text-red-600">{errors.dateTime}</p>
          )}
        </div>

        {/* Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleInputChange("mode", "single")}
              className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                formData.mode === "single"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Single (First Come)
            </button>
            <button
              type="button"
              onClick={() => handleInputChange("mode", "applications")}
              className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                formData.mode === "applications"
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
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
            onChange={(e) =>
              handleInputChange("proofRequired", e.target.checked)
            }
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="proofRequired" className="text-sm text-gray-700">
            <Camera size={16} className="inline mr-1" />
            Require photo proof when completed
          </label>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {isLoading ? "Posting Task..." : "Post Task"}
        </button>
      </form>
    </div>
  );
};
