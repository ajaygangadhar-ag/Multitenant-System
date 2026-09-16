import { useState } from "react";
import { createTenant } from "../../services/tenantService";

function AddTenant({ onClose, onTenantCreated }) {
  const [formData, setFormData] = useState({
    // ================================
    // ORGANIZATION DETAILS
    // ================================
    companyName: "",
    companyEmail: "",
    phone: "",
    address: "",
    status: "Active",

    // ================================
    // TENANT ADMIN DETAILS
    // ================================
    adminEmployeeId: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

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

    // Password confirmation
    if (
      formData.adminPassword !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // PAYLOAD
      // Do not send confirmPassword to backend
      // =================================================
      const payload = {
        companyName: formData.companyName.trim(),
        companyEmail: formData.companyEmail.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        status: formData.status,

        adminEmployeeId:
          formData.adminEmployeeId.trim(),

        adminName:
          formData.adminName.trim(),

        adminEmail:
          formData.adminEmail.trim(),

        adminPassword:
          formData.adminPassword,
      };

      await createTenant(payload);

      if (onTenantCreated) {
        onTenantCreated();
      }
    } catch (err) {
      console.error("Create organization error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create organization."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-center justify-between border-b border-white/10 px-7 py-5">

          <div>
            <h2 className="text-2xl font-bold text-white">
              Create New Organization
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Register an organization and its Tenant Admin
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-2xl leading-none text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ×
          </button>

        </div>

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="p-7"
        >

          {/* ================================================= */}
          {/* ERROR */}
          {/* ================================================= */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* ================================================= */}
          {/* ORGANIZATION DETAILS */}
          {/* ================================================= */}

          <div className="mb-8">

            <div className="mb-5">
              <h3 className="text-lg font-semibold text-white">
                Organization Details
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Enter the basic information of the organization.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Company Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Company Name *
                </label>

                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Company Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Company Email *
                </label>

                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  placeholder="company@example.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Phone *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Address *
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter company address"
                  required
                  rows="3"
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />

              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* TENANT ADMIN DETAILS */}
          {/* ================================================= */}

          <div className="border-t border-white/10 pt-7">

            <div className="mb-5">

              <h3 className="text-lg font-semibold text-white">
                Tenant Admin Details
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Create the administrator account for this organization.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Employee ID */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Employee ID *
                </label>

                <input
                  type="text"
                  name="adminEmployeeId"
                  value={formData.adminEmployeeId}
                  onChange={handleChange}
                  placeholder="Enter employee ID"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />

              </div>

              {/* Admin Name */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full Name *
                </label>

                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  placeholder="Enter admin full name"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />

              </div>

              {/* Admin Email */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Admin Email *
                </label>

                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  placeholder="admin@company.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />

              </div>

              {/* Password */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password *
                </label>

                <input
                  type="password"
                  name="adminPassword"
                  value={formData.adminPassword}
                  onChange={handleChange}
                  placeholder="Create admin password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />

              </div>

              {/* Confirm Password */}
              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Confirm Password *
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm admin password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />

              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* BUTTONS */}
          {/* ================================================= */}

          <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-6">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-white/10 px-5 py-3 font-medium text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-cyan-500 px-7 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create Organization"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddTenant;