import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { fileToBase64 } from '../utils/storage.js';

export const ImageUpload = ({
  label,
  onImageSelect,
  onImageRemove,
  currentImage,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const base64 = await fileToBase64(file);
      onImageSelect(base64);
    } catch (error) {
      console.error('Error converting file to base64:', error);
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  if (currentImage) {
    return (
      <div className={`relative ${className}`}>
        <img
          src={currentImage}
          alt={label}
          className="w-full h-32 object-cover rounded-lg border border-gray-300"
        />
        <button
          onClick={onImageRemove}
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <X size={16} />
        </button>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="block">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
          />
          <div className="flex flex-col items-center space-y-2">
            <Camera size={24} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {isUploading ? 'Uploading...' : label}
            </span>
          </div>
        </div>
      </label>
    </div>
  );
};