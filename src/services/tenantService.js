import api from "./api";

// Get all tenants
export const getTenants = async () => {
  try {
    const response = await api.get("/tenants");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to load tenants",
      }
    );
  }
};

// Get single tenant
export const getTenant = async (id) => {
  try {
    const response = await api.get(`/tenants/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to load tenant",
      }
    );
  }
};

// Create tenant
export const createTenant = async (tenantData) => {
  try {
    const response = await api.post("/tenants", tenantData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to create tenant",
      }
    );
  }
};

// Update tenant
export const updateTenant = async (id, tenantData) => {
  try {
    const response = await api.put(`/tenants/${id}`, tenantData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to update tenant",
      }
    );
  }
};

// Delete tenant
export const deleteTenant = async (id) => {
  try {
    const response = await api.delete(`/tenants/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to delete tenant",
      }
    );
  }
};

export const getMyTenant = async () => {
  try {
    const response = await api.get(
      "/tenants/my-tenant"
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to load your organization",
      }
    );
  }
};