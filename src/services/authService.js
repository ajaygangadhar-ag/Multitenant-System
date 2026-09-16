import api from "./api";

// =====================================================
// LOGIN
// =====================================================

export const loginUser = async (loginData) => {
  try {
    const response = await api.post(
      "/auth/login",
      loginData
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message:
          "Something went wrong. Please try again.",
      }
    );
  }
};


// =====================================================
// ORGANIZATION + TENANT ADMIN REGISTRATION
// =====================================================

export const registerOrganization = async (
  registrationData
) => {
  try {
    const response = await api.post(
      "/auth/register-organization",
      registrationData
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message:
          "Unable to register organization",
      }
    );
  }
};


// =====================================================
// CHANGE PASSWORD
// =====================================================

export const changePassword = async (
  passwordData
) => {
  try {
    const response = await api.put(
      "/auth/change-password",
      passwordData
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to change password",
      }
    );
  }
};

// Forgot Password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post(
      "/auth/forgot-password",
      {
        email,
      }
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message:
          "Unable to process password reset request",
      }
    );
  }
};


// Reset Password
export const resetPassword = async (
  token,
  newPassword
) => {
  try {
    const response = await api.post(
      "/auth/reset-password",
      {
        token,
        newPassword,
      }
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to reset password",
      }
    );
  }
};