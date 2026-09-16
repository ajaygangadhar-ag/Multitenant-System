import api from "./api";

// Get all users
export const getUsers = async (params = {}) => {
  try {
    const response = await api.get("/users", {
      params,
    });

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to load users",
      }
    );
  }
};

// Get single user
export const getUser = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to load user",
      }
    );
  }
};

// Get my profile
export const getMyProfile = async () => {
  try {
    const response = await api.get("/users/me");

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to load profile",
      }
    );
  }
};

// Update my profile
export const updateMyProfile = async (profileData) => {
  try {
    const response = await api.put("/users/me", profileData);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to update profile",
      }
    );
  }
};

// Create user
export const createUser = async (userData) => {
  try {
    const response = await api.post("/users", userData);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to create user",
      }
    );
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to update user",
      }
    );
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to delete user",
      }
    );
  }
};

// Upload profile image
export const uploadProfileImage = async (id, formData) => {
  try {
    const response = await api.post(
      `/users/upload/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to upload profile image",
      }
    );
  }
};