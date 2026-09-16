import api from "./api";

export const getActivityLogs = async (params = {}) => {
  try {
    const response = await api.get("/activity-logs", {
      params,
    });

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to load activity logs",
      }
    );
  }
};