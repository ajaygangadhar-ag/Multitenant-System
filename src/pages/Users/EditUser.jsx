import { useEffect, useState } from "react";

import {
  getUser,
  updateUser,
} from "../../services/userService";

import {
  getTenants,
  getMyTenant,
} from "../../services/tenantService";


function EditUser({
  userId,
  onClose,
  onUserUpdated,
}) {

  // =====================================================
  // CURRENT LOGGED-IN USER
  // =====================================================

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const isSuperAdmin =
    currentUser.role === "SuperAdmin";

  const isTenantAdmin =
    currentUser.role === "TenantAdmin";


  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    role: "User",
    tenantId: "",
    status: "Active",
  });


  // =====================================================
  // STATES
  // =====================================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [tenants, setTenants] =
    useState([]);

  const [myTenant, setMyTenant] =
    useState(null);

  const [loadingTenants, setLoadingTenants] =
    useState(false);


  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {

    const loadUser = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getUser(userId);

        const user =
          data.user;


        setFormData({

          employeeId:
            user.employeeId || "",

          name:
            user.name || "",

          email:
            user.email || "",

          phone:
            user.phone || "",

          department:
            user.department || "",

          designation:
            user.designation || "",

          role:
            user.role || "User",

          tenantId:
            typeof user.tenantId === "object"
              ? user.tenantId?._id || ""
              : user.tenantId || "",

          status:
            user.status || "Active",

        });

      } catch (err) {

        console.error(
          "Load user error:",
          err
        );

        setError(
          err.message ||
            "Unable to load user."
        );

      } finally {

        setLoading(false);

      }

    };


    if (userId) {
      loadUser();
    }

  }, [userId]);


  // =====================================================
  // LOAD TENANT DATA
  // =====================================================

  useEffect(() => {

    const loadTenantData = async () => {

      try {

        setError("");

        // =================================================
        // TENANT ADMIN
        // =================================================

        if (isTenantAdmin) {

          setLoadingTenants(true);

          const data =
            await getMyTenant();

          const tenant =
            data.tenant;


          if (!tenant) {

            setError(
              "Unable to find your organization."
            );

            return;
          }


          setMyTenant(tenant);


          // Keep actual tenant ID internally
          setFormData((prev) => ({
            ...prev,

            tenantId:
              tenant._id,

          }));


          return;
        }


        // =================================================
        // SUPER ADMIN
        // =================================================

        if (isSuperAdmin) {

          setLoadingTenants(true);

          const data =
            await getTenants();

          setTenants(
            data.tenants || []
          );

        }

      } catch (err) {

        console.error(
          "Load tenant error:",
          err
        );

        setError(
          err.message ||
            "Unable to load organization."
        );

      } finally {

        setLoadingTenants(false);

      }

    };


    loadTenantData();

  }, [
    isSuperAdmin,
    isTenantAdmin,
  ]);


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,

      [e.target.name]:
        e.target.value,

    }));

  };


  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");


    try {

      setSaving(true);


      // =================================================
      // TENANT ID
      // =================================================

      const finalTenantId =
        isTenantAdmin
          ? myTenant?._id ||
            currentUser.tenantId
          : formData.tenantId.trim() ||
            null;


      // =================================================
      // USER DATA
      // =================================================

      const userData = {

        ...formData,

        tenantId:
          finalTenantId,

      };


      // TenantAdmin can only keep User role
      if (isTenantAdmin) {

        userData.role =
          "User";

      }


      await updateUser(
        userId,
        userData
      );


      if (onUserUpdated) {

        onUserUpdated();

      }


    } catch (err) {

      console.error(
        "Update user error:",
        err
      );

      setError(
        err.message ||
          "Unable to update user."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Edit User
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update user information
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ×
          </button>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="flex min-h-64 items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading user...
              </p>

            </div>

          </div>

        ) : (

          <form
            onSubmit={handleSubmit}
            className="p-6"
          >


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">

                {error}

              </div>

            )}


            {/* =================================================
                FORM GRID
            ================================================= */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


              {/* =================================================
                  EMPLOYEE ID
              ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Employee ID
                </label>

                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* =================================================
                  NAME
              ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* =================================================
                  EMAIL
              ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* =================================================
                  PHONE
              ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* =================================================
                  DEPARTMENT
              ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Department
                </label>

                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* =================================================
                  DESIGNATION
              ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Designation
                </label>

                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* =================================================
                  ROLE
              ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Role
                </label>


                {isTenantAdmin ? (

                  <div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                      <span className="font-medium text-slate-700">
                        User
                      </span>

                      <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                        Assigned
                      </span>

                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      TenantAdmins can manage only User accounts.
                    </p>

                  </div>

                ) : (

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >

                    <option value="User">
                      User
                    </option>

                    <option value="TenantAdmin">
                      TenantAdmin
                    </option>

                    <option value="SuperAdmin">
                      SuperAdmin
                    </option>

                  </select>

                )}

              </div>


              {/* =================================================
                  TENANT
              ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tenant / Company
                </label>


                {isTenantAdmin ? (

                  <div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                      <span className="font-medium text-slate-800">

                        {loadingTenants
                          ? "Loading organization..."
                          : myTenant?.companyName ||
                            "Organization not found"}

                      </span>


                      <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">

                        Assigned

                      </span>

                    </div>


                    <p className="mt-1 text-xs text-slate-400">

                      Users automatically belong to your organization.

                    </p>

                  </div>

                ) : (

                  <select
                    name="tenantId"
                    value={formData.tenantId}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >

                    <option value="">

                      {loadingTenants
                        ? "Loading tenants..."
                        : "Select a tenant"}

                    </option>


                    {tenants.map(
                      (tenant) => (

                        <option
                          key={tenant._id}
                          value={tenant._id}
                        >

                          {tenant.companyName}

                        </option>

                      )
                    )}

                  </select>

                )}

              </div>


              {/* =================================================
                  STATUS
              ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>


            </div>


            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="mt-7 flex justify-end gap-3 border-t border-slate-200 pt-5">

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>


              <button
                type="submit"
                disabled={
                  saving ||
                  loadingTenants
                }
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </div>


          </form>

        )}

      </div>

    </div>

  );
}


export default EditUser;