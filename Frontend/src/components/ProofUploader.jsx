import React, { useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { tasks } from "../lib/api.js";

export const ProofUploader = ({ taskId, onSuccess, onError }) => {
  const [uploading, setUploading] = useState(false);
  const [proofType, setProofType] = useState("photo");
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [code, setCode] = useState("");

  const handleFileSelect = (file, type) => {
    if (!file.type.startsWith("image/")) {
      onError?.("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      onError?.("Image size should be less than 5MB");
      return;
    }

    if (type === "before") {
      setBeforeImage(file);
    } else {
      setAfterImage(file);
    }
  };

  const handleSubmit = async () => {
    if (proofType === "photo" && (!beforeImage || !afterImage)) {
      onError?.("Please upload both before and after photos");
      return;
    }

    if (proofType === "code" && !code.trim()) {
      onError?.("Please enter the completion code");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("type", proofType);

      if (proofType === "photo") {
        formData.append("beforeImage", beforeImage);
        formData.append("afterImage", afterImage);
      } else if (proofType === "code") {
        formData.append("code", code);
      }

      await tasks.uploadProof(taskId, formData);
      onSuccess?.();
    } catch (error) {
      onError?.(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Proof Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setProofType("photo")}
            className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
              proofType === "photo"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Camera size={16} className="inline mr-2" />
            Photos
          </button>
          <button
            type="button"
            onClick={() => setProofType("code")}
            className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
              proofType === "code"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Code
          </button>
        </div>
      </div>

      {proofType === "photo" && (
        <div className="grid grid-cols-2 gap-4">
          {/* Before Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Before Photo
            </label>
            {beforeImage ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(beforeImage)}
                  alt="Before"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  onClick={() => setBeforeImage(null)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileSelect(e.target.files[0], "before")
                    }
                    className="hidden"
                  />
                  <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Upload Before</span>
                </div>
              </label>
            )}
          </div>

          {/* After Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              After Photo
            </label>
            {afterImage ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(afterImage)}
                  alt="After"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  onClick={() => setAfterImage(null)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileSelect(e.target.files[0], "after")
                    }
                    className="hidden"
                  />
                  <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Upload After</span>
                </div>
              </label>
            )}
          </div>
        </div>
      )}

      {proofType === "code" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Completion Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter the code provided by the task poster"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={uploading}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          uploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        } text-white`}
      >
        {uploading ? "Uploading..." : "Upload Proof"}
      </button>
    </div>
  );
};
