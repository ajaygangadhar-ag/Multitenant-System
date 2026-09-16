import { useEffect, useState } from "react";
import {
  getTenant,
  updateTenant,
} from "../../services/tenantService";

function EditTenant({ tenantId, onClose, onTenantUpdated }) {
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    phone: "",
    address: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTenant = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTenant(tenantId);
        const tenant = data.tenant;

        setFormData({
          companyName: tenant.companyName || "",
          companyEmail: tenant.companyEmail || "",
          phone: tenant.phone || "",
          address: tenant.address || "",
          status: tenant.status || "Active",
        });
      } catch (err) {
        console.error("Load tenant error:", err);
        setError(err.message || "Unable to load tenant.");
      } finally {
        setLoading(false);
      }
    };

    if (tenantId) {
      loadTenant();
    }
  }, [tenantId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setSaving(true);

      await updateTenant(tenantId, formData);

      if (onTenantUpdated) {
        onTenantUpdated();
      }
    } catch (err) {
      console.error("Update tenant error:", err);
      setError(err.message || "Unable to update tenant.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold">
              Edit Tenant
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Update organization information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xl text-slate-400 hover:bg-white/5 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="p-10 text-center text-slate-400">
            Loading tenant...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Company Name */}
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Company Name
                </label>

                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                />
              </div>

              {/* Company Email */}
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Company Email
                </label>

                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                />
              </div>

            </div>

            {/* Buttons */}
            <div className="mt-7 flex justify-end gap-3 border-t border-white/10 pt-5">

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 px-5 py-3 font-medium text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </form>
        )}

      </div>
    </div>
  );
}

export default EditTenant;