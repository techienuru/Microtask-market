import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { useAuth } from "../contexts/AuthProvider.jsx";

export const SignUpPage = () => {
  const { register, requestOtp } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "worker",
    lga: "",
    neighbourhood: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");

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
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid Nigerian phone number";
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    // Location validation
    if (!formData.lga.trim()) {
      newErrors.lga = "Local Government Area is required";
    }

    if (!formData.neighbourhood.trim()) {
      newErrors.neighbourhood = "Neighbourhood is required";
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

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
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

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
        lga: formData.lga.trim(),
        neighbourhood: formData.neighbourhood.trim(),
      };

      await register(userData);

      // Show OTP form
      setShowOtpForm(true);
      await requestOtp(formData.email);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setErrors({ otp: "Please enter the OTP code" });
      return;
    }

    setIsLoading(true);

    try {
      const { verifyOtp } = useAuth();
      await verifyOtp(formData.email, otp);

      alert("Account verified successfully! You can now log in.");
      window.location.href = "/login";
    } catch (error) {
      setErrors({ otp: error.message });
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

  if (showOtpForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link
              to="/"
              className="text-3xl font-bold text-blue-600 mb-2 block"
            >
              Jobbridge
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">
              Verify Your Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a verification code to {formData.email}
            </p>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000000"
                maxLength={6}
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.otp}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {isLoading ? "Verifying..." : "Verify Account"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => requestOtp(formData.email)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Resend verification code
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="text-3xl font-bold text-blue-600 mb-2 block">
            Jobbridge
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

          {/* Terms Agreement */}
          <div className="flex items-start space-x-3">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) =>
                handleInputChange("agreeToTerms", e.target.checked)
              }
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
              I agree to the{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-500 underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-500 underline"
              >
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle size={16} className="mr-1" />
              {errors.agreeToTerms}
            </p>
          )}

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I want to *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInputChange("role", "worker")}
                className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                  formData.role === "worker"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Find Jobs
              </button>
              <button
                type="button"
                onClick={() => handleInputChange("role", "poster")}
                className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                  formData.role === "poster"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Post Jobs
              </button>
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.role}
              </p>
            )}
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="lga"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <MapPin size={16} className="inline mr-1" />
                LGA *
              </label>
              <input
                id="lga"
                name="lga"
                type="text"
                required
                value={formData.lga}
                onChange={(e) => handleInputChange("lga", e.target.value)}
                className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.lga ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="e.g., Lafia"
              />
              {errors.lga && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.lga}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="neighbourhood"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Area *
              </label>
              <input
                id="neighbourhood"
                name="neighbourhood"
                type="text"
                required
                value={formData.neighbourhood}
                onChange={(e) =>
                  handleInputChange("neighbourhood", e.target.value)
                }
                className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.neighbourhood
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="e.g., New Market"
              />
              {errors.neighbourhood && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.neighbourhood}
                </p>
              )}
            </div>
          </div>

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
