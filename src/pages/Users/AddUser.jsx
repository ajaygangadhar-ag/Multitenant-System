import { useEffect, useState } from "react";
import {
  HiEye,
  HiEyeSlash,
} from "react-icons/hi2";

import { createUser } from "../../services/userService";

import {
  getTenants,
  getMyTenant,
} from "../../services/tenantService";


function AddUser({ onUserCreated, onClose }) {

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
    password: "",
    phone: "",
    department: "",
    designation: "",

    role: "User",

    tenantId: isTenantAdmin
      ? currentUser.tenantId || ""
      : "",

    status: "Active",
  });


  // =====================================================
  // STATES
  // =====================================================

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [tenants, setTenants] =
    useState([]);

  const [myTenant, setMyTenant] =
    useState(null);

  const [loadingTenants, setLoadingTenants] =
    useState(false);

// =====================================================
// USER CAPACITY
// =====================================================

const userLimit = myTenant?.userLimit ?? 10;

const currentUserCount =
  myTenant?.users?.length ?? 0;

const remainingUsers = Math.max(
  userLimit - currentUserCount,
  0
);


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

          // Automatically assign tenant
          setFormData((prev) => ({
            ...prev,

            tenantId:
              tenant._id,

            // TenantAdmin can create only User
            role: "User",
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

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (
      !formData.employeeId ||
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {

      setError(
        "Employee ID, name, email and password are required."
      );

      return;
    }


    if (
      formData.password.length < 6
    ) {

      setError(
        "Password must be at least 6 characters."
      );

      return;
    }


    // =================================================
    // TENANT VALIDATION
    // =================================================

    let finalTenantId =
      formData.tenantId;


    // TenantAdmin MUST use own tenant
    if (isTenantAdmin) {

      finalTenantId =
        currentUser.tenantId;

      if (!finalTenantId) {

        setError(
          "Your account is not linked to an organization."
        );

        return;
      }

    }


    // User / TenantAdmin require tenant
    if (
      !finalTenantId &&
      formData.role !== "SuperAdmin"
    ) {

      setError(
        "Please select a tenant."
      );

      return;
    }


    // =================================================
    // CREATE USER
    // =================================================

    try {

      setLoading(true);


      const userData = {

        employeeId:
          formData.employeeId.trim(),

        name:
          formData.name.trim(),

        email:
          formData.email.trim(),

        password:
          formData.password,

        phone:
          formData.phone.trim(),

        department:
          formData.department.trim(),

        designation:
          formData.designation.trim(),

        // TenantAdmin can only create User
        role:
          isTenantAdmin
            ? "User"
            : formData.role,

        // TenantAdmin gets own tenant
        tenantId:
          finalTenantId || null,

        status:
          formData.status,
      };


      console.log(
        "CREATE USER DATA:",
        userData
      );


      const data =
        await createUser(userData);


      setSuccess(
        data.message ||
          "User created successfully."
      );


      // =================================================
      // RESET FORM
      // =================================================

      setFormData({

        employeeId: "",

        name: "",

        email: "",

        password: "",

        phone: "",

        department: "",

        designation: "",

        role: "User",

        tenantId:
          isTenantAdmin
            ? currentUser.tenantId || ""
            : "",

        status: "Active",

      });


      // Refresh Users list
      if (onUserCreated) {

        onUserCreated();

      }


    } catch (err) {

      console.error(
        "Create user error:",
        err
      );

      setError(
        err.message ||
          "Unable to create user."
      );

    } finally {

      setLoading(false);

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
              Add New User
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new user account
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
            FORM
        ================================================= */}

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
              SUCCESS
          ================================================= */}

          {success && (

            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-600">

              {success}

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
                Employee ID *
              </label>

              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="EMP001"
                autoComplete="off"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* =================================================
                NAME
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                autoComplete="off"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* =================================================
                EMAIL
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email *
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                autoComplete="off"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password *
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
                >

                  {showPassword ? (
                    <HiEyeSlash size={21} />
                  ) : (
                    <HiEye size={21} />
                  )}

                </button>

              </div>

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
                placeholder="Phone number"
                autoComplete="off"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                placeholder="IT"
                autoComplete="off"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                placeholder="Software Developer"
                autoComplete="off"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                    TenantAdmins can create only User accounts.
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

                    Users will automatically belong to your organization.

                  </p>

                  {isTenantAdmin && (
  <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
    <div className="flex items-center justify-between">
      <p className="text-xs font-bold text-blue-700">
        User Capacity
      </p>

      <p className="text-sm font-black text-blue-800">
        {currentUserCount} / {userLimit}
      </p>
    </div>

    <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-100">
      <div
        className="h-full rounded-full bg-blue-600 transition-all"
        style={{
          width: `${Math.min(
            (currentUserCount / userLimit) * 100,
            100
          )}%`,
        }}
      />
    </div>

    <p className="mt-2 text-xs font-semibold text-blue-600">
      {remainingUsers > 0
        ? `${remainingUsers} user slot${
            remainingUsers === 1 ? "" : "s"
          } remaining`
        : "🔴 User limit reached"}
    </p>
  </div>
)}

                </div>

              ) : (

                <>

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


                  <p className="mt-1 text-xs text-slate-400">

                    Required for TenantAdmin and User roles.

                  </p>

                </>

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
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading
                ? "Creating..."
                : "Create User"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );
}

export default AddUser;