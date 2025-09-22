import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAppState } from "../hooks/useAppState.js";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { state, addUser, switchUser } = useAppState();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    return phoneRegex.test(phone.replace(/[-\s]/g, ""));
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      isValid: minLength && hasUpper && hasLower && hasNumber,
    };
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (state.users.some((u) => u.email === formData.email)) {
      newErrors.email = "Email is already registered";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid Nigerian phone number";
    } else if (state.users.some((u) => u.phone === formData.phone)) {
      newErrors.phone = "Phone number is already registered";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordCheck = validatePassword(formData.password);
      if (!passwordCheck.isValid) {
        newErrors.password = "Password does not meet requirements";
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const newUser = {
        id: `user_${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        completedCount: 0,
        trusted: false,
        earnings: 0,
        createdAt: new Date().toISOString(),
      };

      addUser(newUser);
      switchUser(newUser.id);

      // Success feedback
      alert(
        `Welcome to MicroTask, ${newUser.name}! Your account has been created successfully.`
      );
      navigate("/tasks");
    } catch (error) {
      setErrors({ submit: "Failed to create account. Please try again." });
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

  const passwordValidation = validatePassword(formData.password);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="text-3xl font-bold text-blue-600 mb-2 block">
            MicroTask
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join thousands of users earning money through micro-tasks
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={20} className="text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter your full name"
                aria-describedby={errors.name ? "name-error" : undefined}
              />
            </div>
            {errors.name && (
              <p
                id="name-error"
                className="mt-1 text-sm text-red-600 flex items-center"
              >
                <AlertCircle size={16} className="mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={20} className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter your email address"
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && (
              <p
                id="email-error"
                className="mt-1 text-sm text-red-600 flex items-center"
              >
                <AlertCircle size={16} className="mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={20} className="text-gray-400" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="080-XXX-XXXX"
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
            </div>
            {errors.phone && (
              <p
                id="phone-error"
                className="mt-1 text-sm text-red-600 flex items-center"
              >
                <AlertCircle size={16} className="mr-1" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`block w-full pr-10 pl-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.password
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Create a strong password"
                aria-describedby="password-requirements"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff
                    size={20}
                    className="text-gray-400 hover:text-gray-600"
                  />
                ) : (
                  <Eye
                    size={20}
                    className="text-gray-400 hover:text-gray-600"
                  />
                )}
              </button>
            </div>

            {/* Password Requirements */}
            {formData.password && (
              <div id="password-requirements" className="mt-2 space-y-1">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div
                    className={`flex items-center ${
                      passwordValidation.minLength
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <CheckCircle size={12} className="mr-1" />
                    8+ characters
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordValidation.hasUpper
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <CheckCircle size={12} className="mr-1" />
                    Uppercase letter
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordValidation.hasLower
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <CheckCircle size={12} className="mr-1" />
                    Lowercase letter
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordValidation.hasNumber
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <CheckCircle size={12} className="mr-1" />
                    Number
                  </div>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password *
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className={`block w-full pr-10 pl-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.confirmPassword
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Confirm your password"
                aria-describedby={
                  errors.confirmPassword ? "confirm-password-error" : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff
                    size={20}
                    className="text-gray-400 hover:text-gray-600"
                  />
                ) : (
                  <Eye
                    size={20}
                    className="text-gray-400 hover:text-gray-600"
                  />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p
                id="confirm-password-error"
                className="mt-1 text-sm text-red-600 flex items-center"
              >
                <AlertCircle size={16} className="mr-1" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-2" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
