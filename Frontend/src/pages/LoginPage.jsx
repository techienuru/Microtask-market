import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthProvider.jsx";

export const LoginPage = () => {
  const { login, requestOtp, verifyOtp } = useAuth();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOtpLogin, setShowOtpLogin] = useState(false);
  const [otp, setOtp] = useState("");

  const validateForm = () => {
    const newErrors = {};

    // Identifier validation
    if (!formData.identifier.trim()) {
      newErrors.identifier = "Email or phone number is required";
    } else {
      const identifier = formData.identifier.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;

      if (
        !emailRegex.test(identifier) &&
        !phoneRegex.test(identifier.replace(/[-\s]/g, ""))
      ) {
        newErrors.identifier =
          "Please enter a valid email address or phone number";
      }
    }

    // Password validation (only if not using OTP login)
    if (!showOtpLogin && !formData.password) {
      newErrors.password = "Password is required";
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
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const credentials = {
        identifier: formData.identifier.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe,
      };

      const response = await login(credentials);

      alert(`Welcome back, ${response.user.name}!`);
      window.location.href = "/tasks";
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLogin = async () => {
    if (!formData.identifier.trim()) {
      setErrors({ identifier: "Email or phone number is required" });
      return;
    }

    setIsLoading(true);

    try {
      await requestOtp(formData.identifier.trim());
      setShowOtpLogin(true);
      setErrors({});
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
      const response = await verifyOtp(formData.identifier.trim(), otp);
      alert(`Welcome back, ${response.user.name}!`);
      window.location.href = "/tasks";
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

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);

    // Simulate password reset
    setTimeout(() => {
      alert(
        "Password reset instructions have been sent to your email address."
      );
      setShowForgotPassword(false);
    }, 1500);
  };

  if (showOtpLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link
              to="/"
              className="text-3xl font-bold text-blue-600 mb-2 block"
            >
              JobBridge
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">Enter OTP Code</h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a login code to {formData.identifier}
            </p>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Login Code
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
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => handleOtpLogin()}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Resend code
              </button>
              <br />
              <button
                type="button"
                onClick={() => setShowOtpLogin(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Back to password login
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
            JobBridge
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue earning
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
          {/* Identifier */}
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email or Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={20} className="text-gray-400" />
              </div>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                required
                value={formData.identifier}
                onChange={(e) =>
                  handleInputChange("identifier", e.target.value)
                }
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.identifier
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Enter your email or phone number"
                aria-describedby={
                  errors.identifier ? "identifier-error" : undefined
                }
              />
            </div>
            {errors.identifier && (
              <p
                id="identifier-error"
                className="mt-1 text-sm text-red-600 flex items-center"
              >
                <AlertCircle size={16} className="mr-1" />
                {errors.identifier}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`block w-full pr-10 pl-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.password
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Enter your password"
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
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
            {errors.password && (
              <p
                id="password-error"
                className="mt-1 text-sm text-red-600 flex items-center"
              >
                <AlertCircle size={16} className="mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) =>
                  handleInputChange("rememberMe", e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={showForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors disabled:text-gray-400"
            >
              {showForgotPassword ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                  Sending...
                </div>
              ) : (
                "Forgot password?"
              )}
            </button>
          </div>

          {/* OTP Login Option */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleOtpLogin}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors disabled:text-gray-400"
            >
              Login with OTP instead
            </button>
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
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>
        </form>

        {/* Success Message for Demo */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700 flex items-center">
            <CheckCircle size={16} className="mr-2" />
            This is a demo app. Use the quick login buttons above or create a
            new account.
          </p>
        </div>
      </div>
    </div>
  );
};
