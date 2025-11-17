/**
 * API client for Micro-Task Market
 * Uses fetch with credentials: 'include' for cookie-based auth
 * Handles 401 errors with automatic token refresh
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Base fetch wrapper with error handling
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<any>} Parsed JSON response
 */
export const apiClient = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;

  const config = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  try {
    const response = await fetch(url, config);

    // Handle 401 - attempt token refresh
    if (response.status === 401 && !endpoint.includes("/auth/")) {
      try {
        const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (refreshResponse.ok) {
          // Retry original request
          const retryResponse = await fetch(url, config);
          const retryData = await retryResponse.json();

          if (!retryResponse.ok) {
            throw {
              status: retryResponse.status,
              message: retryData.message || "Request failed after refresh",
              errors: retryData.errors || null,
            };
          }

          return retryData;
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = "/login";
        throw {
          status: 401,
          message: "Session expired. Please log in again.",
          errors: null,
        };
      }
    }

    // Handle non-JSON responses (like file uploads)
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || data || "Request failed",
        errors: data.errors || null,
      };
    }

    return data;
  } catch (error) {
    if (error.status) {
      throw error; // Re-throw API errors
    }

    // Network or other errors
    throw {
      status: 0,
      message: "Network error or server unavailable",
      errors: null,
    };
  }
};

// Auth endpoints
export const auth = {
  me: () => apiClient("/api/auth/me"),
  login: (credentials) =>
    apiClient("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (userData) =>
    apiClient("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  logout: () => apiClient("/api/auth/logout", { method: "POST" }),
  requestOtp: (identifier) =>
    apiClient("/api/auth/request-otp", {
      method: "POST",
      body: JSON.stringify({ identifier }),
    }),
  verifyOtp: (identifier, otp) =>
    apiClient("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ identifier, otp }),
    }),
};

// Task endpoints
export const tasks = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/api/tasks${query ? `?${query}` : ""}`);
  },
  get: (id) => apiClient(`/api/tasks/${id}`),
  create: (taskData) =>
    apiClient("/api/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    }),
  reserve: (id) => apiClient(`/api/tasks/${id}/reserve`, { method: "POST" }),
  apply: (id, applicationData) =>
    apiClient(`/api/tasks/${id}/apply`, {
      method: "POST",
      body: JSON.stringify(applicationData),
    }),
  complete: (id, proofData) =>
    apiClient(`/api/tasks/${id}/complete`, {
      method: "POST",
      body: JSON.stringify(proofData),
    }),
  confirm: (id) => apiClient(`/api/tasks/${id}/confirm`, { method: "POST" }),
  dispute: (id, reason) =>
    apiClient(`/api/tasks/${id}/dispute`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
  uploadProof: (id, formData) =>
    apiClient(`/api/tasks/${id}/proof`, {
      method: "POST",
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    }),
  getApplicants: (id) => apiClient(`/api/tasks/${id}/applicants`),
};

// User endpoints
export const users = {
  me: () => apiClient("/api/users/me"),
  getPostings: () => apiClient("/api/users/me/postings"),
  getJobs: () => apiClient("/api/users/me/jobs"),
  getWallet: () => apiClient("/api/users/me/wallet"),
  getProfile: (id) => apiClient(`/api/users/${id}`),
};

// Admin endpoints
export const admin = {
  seed: () => apiClient("/api/admin/seed", { method: "POST" }),
  getStats: () => apiClient("/api/admin/stats"),
  getDisputes: () => apiClient("/api/admin/disputes"),
  resolveDispute: (taskId, resolution) =>
    apiClient(`/api/admin/disputes/${taskId}/resolve`, {
      method: "POST",
      body: JSON.stringify({ resolution }),
    }),
};

export default apiClient;
