import { useEffect, useState } from "react";

import {
  HiOutlineBuildingOffice2,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineUsers,
  HiOutlineXCircle,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";

import {
  getTenants,
  deleteTenant,
} from "../../services/tenantService";

import AddTenant from "./AddTenant";
import EditTenant from "./EditTenant";

function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddTenant, setShowAddTenant] = useState(false);
  const [editingTenantId, setEditingTenantId] = useState(null);

  // Search organizations
  const [search, setSearch] = useState("");

  // Success popup
  const [successMessage, setSuccessMessage] = useState("");

  const loadTenants = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTenants();

      setTenants(data.tenants || []);
    } catch (err) {
      console.error("Tenants loading error:", err);
      setError(err.message || "Unable to load tenants");
    } finally {
      setLoading(false);
    }
  };

  // ================= SUCCESS POPUP =================

  const showSuccess = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 2500);
  };

  // ================= DELETE TENANT =================

  const handleDelete = async (tenantId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this tenant?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteTenant(tenantId);

      showSuccess("Tenant deleted successfully");

      await loadTenants();
    } catch (err) {
      console.error("Delete tenant error:", err);
      setError(err.message || "Unable to delete tenant.");
    }
  };

  const filteredTenants = tenants.filter((tenant) => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return true;
    }

    return (
      tenant.companyName?.toLowerCase().includes(value) ||
      tenant.companyEmail?.toLowerCase().includes(value) ||
      tenant.phone?.toLowerCase().includes(value) ||
      tenant.address?.toLowerCase().includes(value)
    );
  });


  useEffect(() => {
    loadTenants();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900 lg:p-10">

      {/* ================= SUCCESS POPUP ================= */}

      {successMessage && (
        <div className="fixed right-6 top-6 z-[100]">

          <div className="flex min-w-[320px] items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-xl shadow-slate-900/10">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <HiOutlineCheckCircle size={23} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                Success
              </p>

              <p className="mt-1 text-sm text-emerald-600">
                {successMessage}
              </p>
            </div>

          </div>

        </div>
      )}


      {/* ================= PREMIUM TENANT MANAGEMENT UI ================= */}

      <div className="space-y-6">

        {/* PREMIUM HERO */}
        <section className="relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.07)]">

          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/70" />
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />

          <div className="relative px-7 py-8 lg:px-9 lg:py-9">

            <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">

              <div className="flex items-start gap-5">

                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/25">
                  <HiOutlineBuildingOffice2 size={31} />
                  <span className="absolute -bottom-1.5 -right-1.5 h-4 w-4 rounded-full border-[3px] border-white bg-emerald-500" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-black uppercase tracking-[1.8px] text-blue-700">
                      Administration
                    </span>

                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Workspace
                    </span>
                  </div>

                  <h1 className="mt-3 text-3xl font-black tracking-[-0.8px] text-slate-950 lg:text-4xl">
                    Tenant Management
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 lg:text-base">
                    Manage organizations, tenant accounts, and their workspace access from one place.
                  </p>
                </div>

              </div>


              <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/80 bg-white/80 p-2 shadow-lg shadow-slate-900/5 backdrop-blur">

                <div className="min-w-[88px] rounded-xl bg-slate-50 px-4 py-3 text-center">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Total
                  </p>
                  <p className="mt-1 text-xl font-black text-slate-900">
                    {tenants.length}
                  </p>
                </div>

                <div className="min-w-[88px] rounded-xl bg-emerald-50 px-4 py-3 text-center">
                  <p className="text-[9px] font-black uppercase tracking-wider text-emerald-600">
                    Active
                  </p>
                  <p className="mt-1 text-xl font-black text-emerald-700">
                    {tenants.filter((t) => t.status === "Active").length}
                  </p>
                </div>

                <div className="min-w-[88px] rounded-xl bg-red-50 px-4 py-3 text-center">
                  <p className="text-[9px] font-black uppercase tracking-wider text-red-500">
                    Inactive
                  </p>
                  <p className="mt-1 text-xl font-black text-red-600">
                    {tenants.filter((t) => t.status !== "Active").length}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* QUICK STATS */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <HiOutlineBuildingOffice2 size={23} />
              </div>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-600">
                Organizations
              </span>
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Tenants
            </p>
            <p className="mt-1 text-3xl font-black text-slate-900">
              {tenants.length}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <HiOutlineArrowTrendingUp size={15} className="text-blue-500" />
              Organizations in your system
            </div>
          </div>


          <div className="group rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/60 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <HiOutlineCheckCircle size={23} />
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                Healthy
              </span>
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Tenants
            </p>
            <p className="mt-1 text-3xl font-black text-emerald-700">
              {tenants.filter((t) => t.status === "Active").length}
            </p>
            <div className="mt-3 text-xs font-semibold text-emerald-700/70">
              Currently active organizations
            </div>
          </div>


          <div className="group rounded-2xl border border-red-100 bg-gradient-to-br from-white to-red-50/60 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <HiOutlineXCircle size={23} />
              </div>
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-600">
                Attention
              </span>
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Inactive Tenants
            </p>
            <p className="mt-1 text-3xl font-black text-red-600">
              {tenants.filter((t) => t.status !== "Active").length}
            </p>
            <div className="mt-3 text-xs font-semibold text-red-600/70">
              Organizations requiring attention
            </div>
          </div>

        </section>


        {/* ERROR */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
            {error}
          </div>
        )}


        {/* MAIN WORKSPACE */}
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.06)]">

          {/* TOOLBAR */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/70 px-6 py-6 lg:px-7">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <HiOutlineUsers size={21} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      All Organizations
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {filteredTenants.length} of {tenants.length} organizations shown
                    </p>
                  </div>
                </div>
              </div>


              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

                <div className="relative min-w-0 sm:w-[350px]">

                  <HiOutlineMagnifyingGlass
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by company, email, phone..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                </div>

                <button
                  type="button"
                  onClick={() => setShowAddTenant(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <HiOutlinePlus size={20} />
                  Add Tenant
                </button>

              </div>

            </div>

          </div>


          {/* TABLE */}
          {loading ? (

            <div className="flex min-h-96 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                <p className="mt-4 text-sm font-semibold text-slate-500">
                  Loading organizations...
                </p>
              </div>
            </div>

          ) : filteredTenants.length === 0 ? (

            <div className="flex min-h-96 items-center justify-center px-6">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <HiOutlineBuildingOffice2 size={31} />
                </div>
                <h3 className="mt-5 text-lg font-black text-slate-800">
                  {search ? "No organizations found" : "No tenants found"}
                </h3>
                <p className="mt-2 max-w-md text-sm text-slate-500">
                  {search
                    ? "Try another company name, email, phone number, or address."
                    : "Create your first organization to get started."}
                </p>
              </div>
            </div>

          ) : (

            <div className="overflow-x-auto p-5 lg:p-6">

              <table className="w-full min-w-[1120px] border-separate border-spacing-y-2">

                <thead>
                  <tr className="text-left text-[10px] font-black uppercase tracking-[1.7px] text-slate-400">
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>


                <tbody>

                  {filteredTenants.map((tenant) => (

                    <tr
                      key={tenant._id}
                      className="group bg-white shadow-sm ring-1 ring-slate-100 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50/20 hover:shadow-md"
                    >

                      <td className="rounded-l-2xl px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-black text-blue-700">
                            {tenant.companyName
                              ? tenant.companyName.charAt(0).toUpperCase()
                              : "T"}
                          </div>
                          <div>
                            <p className="font-black text-slate-900">
                              {tenant.companyName}
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-slate-400">
                              Organization
                            </p>
                          </div>
                        </div>
                      </td>


                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <HiOutlineEnvelope size={17} className="shrink-0 text-blue-300" />
                          <span className="truncate">
                            {tenant.companyEmail || "—"}
                          </span>
                        </div>
                      </td>


                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <HiOutlinePhone size={17} className="shrink-0 text-blue-300" />
                          <span>{tenant.phone || "—"}</span>
                        </div>
                      </td>


                      <td className="max-w-xs px-4 py-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <HiOutlineMapPin size={17} className="shrink-0 text-blue-300" />
                          <span className="truncate">
                            {tenant.address || "—"}
                          </span>
                        </div>
                      </td>


                      <td className="px-4 py-4">
                        <span
                          className={
                            tenant.status === "Active"
                              ? "inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700"
                              : "inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600"
                          }
                        >
                          <span
                            className={
                              tenant.status === "Active"
                                ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
                                : "h-1.5 w-1.5 rounded-full bg-red-500"
                            }
                          />
                          {tenant.status}
                        </span>
                      </td>


                      <td className="rounded-r-2xl px-4 py-4">
                        <div className="flex items-center gap-2">

                          <button
                            type="button"
                            onClick={() => setEditingTenantId(tenant._id)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-sm font-bold text-blue-600 transition hover:-translate-y-0.5 hover:bg-blue-100"
                          >
                            <HiOutlinePencilSquare size={17} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(tenant._id)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-bold text-red-600 transition hover:-translate-y-0.5 hover:bg-red-100"
                          >
                            <HiOutlineTrash size={17} />
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>


      {/* ================= ADD TENANT ================= */}

      {showAddTenant && (

        <AddTenant
          onClose={() =>
            setShowAddTenant(false)
          }

          onTenantCreated={() => {

            setShowAddTenant(false);

            showSuccess(
              "Tenant created successfully"
            );

            loadTenants();

          }}
        />

      )}


      {/* ================= EDIT TENANT ================= */}

      {editingTenantId && (

        <EditTenant
          tenantId={editingTenantId}

          onClose={() =>
            setEditingTenantId(null)
          }

          onTenantUpdated={() => {

            setEditingTenantId(null);

            showSuccess(
              "Tenant updated successfully"
            );

            loadTenants();

          }}
        />

      )}

    </div>
  );
}

export default Tenants;