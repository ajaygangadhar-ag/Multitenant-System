import api from "./api";


// =====================================================
// DASHBOARD STATISTICS
// =====================================================

export const getDashboardStats = async () => {
  try {
    const response = await api.get("/dashboard");

    return response.data;

  } catch (error) {
    throw (
      error.response?.data || {
        message:
          "Unable to load dashboard statistics",
      }
    );
  }
};


// =====================================================
// DASHBOARD RECENT ACTIVITIES
// =====================================================

export const getRecentActivities = async () => {
  try {
    const response = await api.get(
      "/dashboard/recent-activities"
    );

    return response.data;

  } catch (error) {
    throw (
      error.response?.data || {
        message:
          "Unable to load recent activities",
      }
    );
  }
};