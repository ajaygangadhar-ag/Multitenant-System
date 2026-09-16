import { useEffect, useState } from "react";

import {
  HiOutlineUsers,
  HiOutlineBuildingOffice2,
  HiOutlineUserGroup,
  HiOutlineArrowLeft,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineEye,
} from "react-icons/hi2";

import {
  getUsers,
  deleteUser,
} from "../../services/userService";

import {
  getTenants,
  deleteTenant,
} from "../../services/tenantService";

import EditUser from "./EditUser";
import AddUser from "./AddUser";


function Users() {

  // =====================================================
  // CURRENT USER
  // =====================================================

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const isSuperAdmin =
    currentUser.role === "SuperAdmin";

  const isTenantAdmin =
    currentUser.role === "TenantAdmin";


  // =====================================================
  // USERS
  // =====================================================

  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // ORGANIZATIONS
  // =====================================================

  const [tenants, setTenants] =
    useState([]);

  const [loadingTenants, setLoadingTenants] =
    useState(false);

  const [selectedTenant, setSelectedTenant] =
    useState(null);

  // SuperAdmin organization search
  const [tenantSearch, setTenantSearch] =
    useState("");


  // =====================================================
  // FILTERS
  // =====================================================

  const [search, setSearch] =
    useState("");

  const [role, setRole] =
    useState("");

  const [status, setStatus] =
    useState("");


  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalUsers, setTotalUsers] =
    useState(0);


  // =====================================================
  // EDIT USER
  // =====================================================

  const [editingUserId, setEditingUserId] =
    useState(null);

  const [showAddUser, setShowAddUser] =
  useState(false);


  // =====================================================
  // LOAD USERS
  // =====================================================

  const loadUsers = async () => {

    try {

      setLoading(true);
      setError("");

      const params = {
        page: currentPage,
        limit: 5,
        search,
        role,
        status,
      };


      // SuperAdmin organization filter
      if (
        isSuperAdmin &&
        selectedTenant?._id
      ) {

        params.tenantId =
          selectedTenant._id;

      }


      const data =
        await getUsers(params);


      setUsers(
  [...(data.users || [])].sort((a, b) => {
    const numA = parseInt(
      String(a.employeeId || "").match(/\d+$/)?.[0] || "0",
      10
    );

    const numB = parseInt(
      String(b.employeeId || "").match(/\d+$/)?.[0] || "0",
      10
    );

    return numA - numB;
  })
);


      setTotalUsers(
        data.totalUsers ||
        data.total ||
        data.count ||
        0
      );


      setTotalPages(
        data.totalPages ||
        Math.ceil(
          (
            data.totalUsers ||
            data.total ||
            data.count ||
            0
          ) / 5
        ) ||
        1
      );

    } catch (err) {

      console.error(
        "Load users error:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load users."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD ORGANIZATIONS
  // =====================================================

  const loadTenants = async () => {

    if (!isSuperAdmin) {
      return;
    }


    try {

      setLoadingTenants(true);
      setError("");

      const data =
        await getTenants();


      setTenants(
        data.tenants || []
      );

    } catch (err) {

      console.error(
        "Load organizations error:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load organizations."
      );

    } finally {

      setLoadingTenants(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadTenants();

  }, [isSuperAdmin]);


  // =====================================================
  // LOAD USERS
  // =====================================================

  useEffect(() => {

    if (
      isSuperAdmin &&
      !selectedTenant
    ) {

      setLoading(false);

      return;

    }

    loadUsers();

  }, [
    currentPage,
    search,
    role,
    status,
    selectedTenant,
  ]);


  // =====================================================
  // SELECT ORGANIZATION
  // =====================================================

  const handleSelectTenant = (tenant) => {

    setSelectedTenant(tenant);

    setCurrentPage(1);

    setSearch("");

    setRole("");

    setStatus("");

  };


  // =====================================================
  // BACK TO ORGANIZATIONS
  // =====================================================

  const handleBackToOrganizations = () => {

    setSelectedTenant(null);

    setCurrentPage(1);

    setSearch("");

    setRole("");

    setStatus("");

    setUsers([]);

  };


  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDeleteUser = async (userId) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this user?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");

      await deleteUser(userId);

      await loadUsers();

      if (isSuperAdmin) {
        await loadTenants();
      }

    } catch (err) {

      console.error(
        "Delete user error:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to delete user."
      );

    }

  };


  // =====================================================
  // DELETE ORGANIZATION
  // =====================================================

  const handleDeleteTenant = async (
    tenantId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this organization?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");

      await deleteTenant(
        tenantId
      );


      await loadTenants();

    } catch (err) {

      console.error(
        "Delete organization error:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to delete organization."
      );

    }

  };


  // =====================================================
  // USER UPDATED
  // =====================================================

  const handleUserUpdated = async () => {

    setEditingUserId(null);

    await loadUsers();

    if (isSuperAdmin) {
      await loadTenants();
    }

  };


  // =====================================================
  // FILTER ORGANIZATIONS FOR SUPERADMIN
  // =====================================================

  const filteredTenants = tenants.filter((tenant) => {
    const value = tenantSearch.trim().toLowerCase();

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


  // =====================================================
  // SUMMARY COUNTS
  // =====================================================


  // =====================================================
  // ORGANIZATION CARD
  // =====================================================

const renderTenantCard = (tenant) => {

  const stats = tenant.userStats || {};

  // userStats currently counts regular Users only.
  // The organization TenantAdmin is also an employee and must be included.
  const tenantAdminCount = 1;

  const total =
    (stats.totalUsers || 0) + tenantAdminCount;

  const active =
    (stats.activeUsers || 0) + tenantAdminCount;

  const inactive =
    stats.inactiveUsers || 0;

      // User capacity
  const userLimit = tenant.userLimit ?? 10;

  const remainingUsers = Math.max(
    userLimit - total,
    0
  );

  return (
    <div
      key={tenant._id}
      className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    >

      {/* ORGANIZATION NAME */}

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

          <HiOutlineBuildingOffice2
            size={23}
          />

        </div>

        <div>

          <h3 className="text-lg font-bold text-slate-800">

            {tenant.companyName ||
              "Unnamed Organization"}

          </h3>

        </div>

      </div>


      {/* STATISTICS */}

      <div className="mt-6 grid grid-cols-3 gap-3">

        {/* EMPLOYEES */}

        <div className="rounded-xl bg-slate-50 p-3.5 text-center">

          <p className="text-xs font-semibold text-slate-500">

            Employees

          </p>

          <p className="mt-2 text-2xl font-bold text-slate-800">

            {total}

          </p>

        </div>


        {/* ACTIVE */}

        <div className="rounded-xl bg-green-50 p-3.5 text-center">

          <p className="text-xs font-semibold text-green-600">

            Active

          </p>

          <p className="mt-2 text-2xl font-bold text-green-700">

            {active}

          </p>

        </div>


        {/* INACTIVE */}

        <div className="rounded-xl bg-red-50 p-3.5 text-center">

          <p className="text-xs font-semibold text-red-600">

            Inactive

          </p>

          <p className="mt-2 text-2xl font-bold text-red-700">

            {inactive}

          </p>

        </div>

      </div>

      {/* USER CAPACITY */}
<div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
  <div className="flex items-center justify-between">
    <p className="text-sm font-semibold text-blue-700">
      User Capacity
    </p>

    <p className="text-lg font-bold text-blue-800">
      {total} / {userLimit}
    </p>
  </div>

  <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-100">
    <div
      className="h-full rounded-full bg-blue-600 transition-all"
      style={{
        width: `${Math.min(
          (total / userLimit) * 100,
          100
        )}%`,
      }}
    />
  </div>

  <p className="mt-2 text-xs font-medium text-blue-600">
    {remainingUsers > 0
      ? `${remainingUsers} user slot${
          remainingUsers === 1 ? "" : "s"
        } remaining`
      : "🔴 User limit reached"}
  </p>
</div>


      {/* VIEW USERS */}

      <button
        type="button"
        onClick={() =>
          handleSelectTenant(tenant)
        }
        className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >

        View Users →

      </button>

    </div>
  );
};


  // =====================================================
  // LOADING ORGANIZATIONS
  // =====================================================

  if (
    isSuperAdmin &&
    loadingTenants &&
    !selectedTenant
  ) {

    return (

      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">

            Loading organizations...

          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // SUPERADMIN ORGANIZATION VIEW
  // =====================================================

  if (
    isSuperAdmin &&
    !selectedTenant
  ) {
    return (
      <div className="min-h-[70vh] space-y-7 pb-8">

        {/* PAGE HEADER */}

        <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-sm md:p-8">

          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-indigo-200/20 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">
                <HiOutlineBuildingOffice2 size={28} />
              </div>

              <div>
                <div className="mb-2 inline-flex items-center rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
                  SuperAdmin Workspace
                </div>

                <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                  Organizations
                </h1>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                  Manage organizations and open their employee workspace from one place.
                </p>
              </div>

            </div>

            <div className="hidden rounded-2xl border border-white/80 bg-white/80 px-5 py-4 shadow-sm backdrop-blur sm:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Workspace
              </p>
              <p className="mt-1 text-sm font-bold text-slate-700">
                Organization Management
              </p>
            </div>

          </div>

        </div>


        {/* SEARCH */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-base font-bold text-slate-800">
                Find an organization
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Search by company name, email, phone, or address.
              </p>
            </div>

            <div className="relative w-full md:max-w-xl">

              <HiOutlineMagnifyingGlass
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={tenantSearch}
                onChange={(e) =>
                  setTenantSearch(e.target.value)
                }
                placeholder="Search organizations..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm">
            {error}
          </div>
        )}


        {/* ORGANIZATION LIST */}

        {filteredTenants.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <HiOutlineBuildingOffice2 size={32} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-800">
              {tenantSearch
                ? "No organizations match your search"
                : "No organizations found"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {tenantSearch
                ? "Try a different organization name, email, phone, or address."
                : "There are currently no organizations available."}
            </p>

          </div>

        ) : (

          <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-2">

            {filteredTenants.map((tenant) => {

             const stats = tenant.userStats || {};

const total =
  stats.totalUsers || 0;

const active =
  stats.activeUsers || 0;

const inactive =
  stats.inactiveUsers || 0;

// User capacity
const userLimit = tenant.userLimit ?? 10;

const remainingUsers = Math.max(
  userLimit - total,
  0
);

              const initials =
                (tenant.companyName || "OR")
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase();

              return (
                <div
                  key={tenant._id}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60"
                >

                  {/* CARD ACCENT */}

                  <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500" />

                  <div className="p-6">

                    {/* ORGANIZATION HEADER */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex min-w-0 items-center gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-lg font-black text-blue-600 ring-1 ring-blue-100">
                          {initials}
                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate text-lg font-extrabold text-slate-900 md:text-xl">
                            {tenant.companyName ||
                              "Unnamed Organization"}
                          </h3>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            {tenant.companyEmail ||
                              "Organization account"}
                          </p>

                        </div>

                      </div>

                      <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                        Active
                      </span>

                    </div>


                    {/* DIVIDER */}

                    <div className="my-6 border-t border-slate-100" />


                    {/* STATISTICS */}

                    <div className="grid grid-cols-3 gap-3">

                      {/* EMPLOYEES */}
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center transition group-hover:bg-slate-100/80">
                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                          <HiOutlineUserGroup size={19} />
                        </div>

                        <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                          Employees
                        </p>

                        <p className="mt-1 text-2xl font-black text-slate-800">
                          {total}
                        </p>
                      </div>

                      {/* ACTIVE */}
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 text-center">
                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                          <HiOutlineUsers size={19} />
                        </div>

                        <p className="mt-3 text-xs font-bold uppercase tracking-wide text-emerald-600">
                          Active
                        </p>

                        <p className="mt-1 text-2xl font-black text-emerald-700">
                          {active}
                        </p>
                      </div>

                      {/* INACTIVE */}
                      <div className="rounded-2xl border border-red-100 bg-red-50/80 p-4 text-center">
                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
                          <HiOutlineUsers size={19} />
                        </div>

                        <p className="mt-3 text-xs font-bold uppercase tracking-wide text-red-600">
                          Inactive
                        </p>

                        <p className="mt-1 text-2xl font-black text-red-700">
                          {inactive}
                        </p>
                      </div>

                    </div>

                    {/* USER CAPACITY */}
                    <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-blue-700">
                          User Capacity
                        </p>

                        <p className="text-lg font-black text-blue-800">
                          {total} / {userLimit}
                        </p>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-100">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{
                            width: `${Math.min(
                              (total / userLimit) * 100,
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


                    {/* ACTION */}

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectTenant(tenant)
                      }
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-200"
                    >
                      View Users
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>
    );
  }


  // =====================================================
  // USER MANAGEMENT VIEW
  // =====================================================

  const activeUsersCount = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsersCount = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  const visibleRoleCount = new Set(
    users.map((user) => user.role).filter(Boolean)
  ).size;

 const resetFilters = () => {
  setSearch("");
  setRole("");
  setStatus("");
  setCurrentPage(1);
};

if (isTenantAdmin) {
  return (
    <div className="min-h-[70vh] space-y-6 pb-8">

      {/* ================= TENANT ADMIN HEADER ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-sm md:p-8">

        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-indigo-200/20 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
              Tenant Admin Workspace
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Users Management
            </h1>

            <p className="mt-2 text-sm text-slate-500 md:text-base">
              View and manage users in your organization.
            </p>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white/90 px-6 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Employees
            </p>

            <p className="mt-1 text-3xl font-black text-blue-600">
              {totalUsers}
            </p>
          </div>

        </div>
      </div>


      {/* ================= STATISTICS ================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <HiOutlineUserGroup size={25} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">
                Total Employees
              </p>

              <p className="mt-1 text-2xl font-black text-blue-600">
                {totalUsers}
              </p>
            </div>

          </div>
        </div>


        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <HiOutlineUsers size={25} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">
                Active
              </p>

              <p className="mt-1 text-2xl font-black text-emerald-600">
                {activeUsersCount}
              </p>
            </div>

          </div>
        </div>


        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <HiOutlineUsers size={25} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">
                Inactive
              </p>

              <p className="mt-1 text-2xl font-black text-red-600">
                {inactiveUsersCount}
              </p>
            </div>

          </div>
        </div>

      </div>


      {/* ================= FILTERS ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.5fr_0.8fr_0.8fr_auto_auto]">

          <div className="relative">

            <HiOutlineMagnifyingGlass
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search users by name, email or ID..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

          </div>


          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          >
            <option value="">All Roles</option>
            <option value="TenantAdmin">Tenant Admin</option>
            <option value="User">User</option>
          </select>


          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>


          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 rounded-xl border border-blue-300 bg-white px-5 py-3.5 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
          >
            ↻
            Reset Filters
          </button>


          <button
            type="button"
            onClick={() => setShowAddUser(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700"
          >
            <span className="text-lg leading-none">
              +
            </span>
            Add User
          </button>

        </div>
      </div>


      {/* ================= ERROR ================= */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm">
          {error}
        </div>
      )}


      {/* ================= USERS TABLE ================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {loading ? (

          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading users...
              </p>

            </div>
          </div>

        ) : users.length === 0 ? (

          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <HiOutlineUsers size={32} />
            </div>

            <h3 className="mt-5 text-lg font-black text-slate-800">
              No users found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              No users match the current filters.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead>

                <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-[11px] font-black uppercase tracking-[1.5px] text-slate-400">

                  <th className="px-6 py-4">
                    Employee ID
                  </th>

                  <th className="px-6 py-4">
                    Name
                  </th>

                  <th className="px-6 py-4">
                    Email
                  </th>

                  <th className="px-6 py-4">
                    Department
                  </th>

                  <th className="px-6 py-4">
                    Role
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {users.map((user) => (

                  <tr
                    key={user._id}
                    className="border-b border-slate-100 transition hover:bg-blue-50/30"
                  >

                    <td className="px-6 py-5 text-sm font-bold text-slate-700">
                      {user.employeeId || "-"}
                    </td>


                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-black text-blue-600">
                          {(user.name || "U")
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase()}
                        </div>

                        <p className="truncate font-extrabold text-slate-800">
                          {user.name}
                        </p>

                      </div>

                    </td>


                    <td className="px-6 py-5 text-sm text-slate-500">
                      {user.email}
                    </td>


                    <td className="px-6 py-5 text-sm font-medium text-slate-600">
                      {user.department || "-"}
                    </td>


                    <td className="px-6 py-5">

                      <span
                        className={
                          user.role === "TenantAdmin"
                            ? "inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700"
                            : "inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"
                        }
                      >
                        {user.role}
                      </span>

                    </td>


                    <td className="px-6 py-5">

                      <span
                        className={
                          user.status === "Active"
                            ? "inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                            : "inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700"
                        }
                      >

                        <span
                          className={
                            user.status === "Active"
                              ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
                              : "h-1.5 w-1.5 rounded-full bg-red-500"
                          }
                        />

                        {user.status}

                      </span>

                    </td>


                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            setEditingUserId(user._id)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                          title="Edit"
                        >
                          <HiOutlinePencilSquare size={18} />
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteUser(user._id)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                          title="Delete"
                        >
                          <HiOutlineTrash size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}


        {/* ================= PAGINATION ================= */}
        {!loading && users.length > 0 && (

          <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-slate-500">

              Showing{" "}
              <span className="font-bold text-slate-700">
                {(currentPage - 1) * 5 + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-slate-700">
                {(currentPage - 1) * 5 + users.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700">
                {totalUsers}
              </span>

            </p>


            <div className="flex items-center gap-2">

              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() =>
                  setCurrentPage((page) => page - 1)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>


              <span className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm">
                {currentPage}
              </span>


              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>

            </div>

          </div>

        )}

      </div>


      {/* ================= EDIT USER ================= */}
      {editingUserId && (
        <EditUser
          userId={editingUserId}
          onClose={() =>
            setEditingUserId(null)
          }
          onUserUpdated={handleUserUpdated}
        />
      )}


      {/* ================= ADD USER ================= */}
      {showAddUser && (
        <AddUser
          onClose={() =>
            setShowAddUser(false)
          }
          onUserCreated={async () => {
            setShowAddUser(false);
            setCurrentPage(1);
            await loadUsers();
          }}
        />
      )}

    </div>
  );
}

return (

    <div className="min-h-[70vh] space-y-5 pb-8">

      {/* ================= BREADCRUMB / HEADER ================= */}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">

          {isSuperAdmin && (
            <button
              type="button"
              onClick={handleBackToOrganizations}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              title="Back to organizations"
            >
              <HiOutlineArrowLeft size={21} />
            </button>
          )}

          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
              <span>Dashboard</span>
              <span>›</span>
              <span>Organizations</span>
              <span>›</span>
              <span>{selectedTenant?.companyName || "Users"}</span>
              <span>›</span>
              <span className="text-blue-600">Users</span>
            </div>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              {selectedTenant
                ? `${selectedTenant.companyName} Users`
                : "Users Management"}
            </h1>

            <p className="mt-1 text-sm text-slate-500 md:text-base">
              {selectedTenant
                ? `Employees belonging to ${selectedTenant.companyName}`
                : "View and manage users."}
            </p>
          </div>

        </div>

      </div>


      {/* ================= ORGANIZATION HERO ================= */}

      {selectedTenant && (

        <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-indigo-50 p-6 shadow-sm">

          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-100/30 to-transparent" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
                <HiOutlineBuildingOffice2 size={31} />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Organization
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-3">

                  <h2 className="text-2xl font-black text-slate-900">
                    {selectedTenant.companyName}
                  </h2>

                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Manage and view all users belonging to this organization.
                </p>
              </div>

            </div>


            {/* BLUE TOTAL EMPLOYEES CARD */}

            <div className="flex min-w-[230px] items-center justify-between rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white shadow-lg shadow-blue-200">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-100">
                  Total Employees
                </p>

                <p className="mt-1 text-3xl font-black">
                  {totalUsers}
                </p>

                <p className="mt-1 text-xs text-blue-100">
                  All users in organization
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <HiOutlineUserGroup size={27} />
              </div>

            </div>

          </div>

        </div>

      )}


      {/* ================= STATISTICS ================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <HiOutlineUserGroup size={28} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-500">
                Total Employees
              </p>

              <p className="mt-1 text-3xl font-black text-blue-600">
                {totalUsers}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                All users in organization
              </p>
            </div>

          </div>

        </div>


        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <HiOutlineUsers size={28} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-500">
                Active
              </p>

              <p className="mt-1 text-3xl font-black text-emerald-600">
                {activeUsersCount}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Currently active users
              </p>
            </div>

          </div>

        </div>


        <div className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <HiOutlineUsers size={28} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-500">
                Inactive
              </p>

              <p className="mt-1 text-3xl font-black text-red-600">
                {inactiveUsersCount}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Inactive users
              </p>
            </div>

          </div>

        </div>


        <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <HiOutlineUsers size={28} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-500">
                User Roles
              </p>

              <p className="mt-1 text-3xl font-black text-violet-600">
                {visibleRoleCount}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Different roles
              </p>
            </div>

          </div>

        </div>

      </div>


      {/* ================= ERROR ================= */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm">
          {error}
        </div>
      )}


      {/* ================= FILTER BAR ================= */}

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.5fr_0.8fr_0.8fr_auto_auto]">

          <div className="relative">

            <HiOutlineMagnifyingGlass
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search users by name, email or ID..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>


          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">All Roles</option>
            <option value="TenantAdmin">Tenant Admin</option>
            <option value="User">User</option>
          </select>


          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>


          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 rounded-xl border border-blue-300 bg-white px-5 py-3.5 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
          >
            ↻
            Reset Filters
          </button>

          {isTenantAdmin && (
            <button
              type="button"
              onClick={() => setShowAddUser(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              <span className="text-lg leading-none">+</span>
              Add User
            </button>
          )}

        </div>

      </div>


      {/* ================= USERS TABLE ================= */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {loading ? (

          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading users...
              </p>
            </div>
          </div>

        ) : users.length === 0 ? (

          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <HiOutlineUsers size={32} />
            </div>

            <h3 className="mt-5 text-lg font-black text-slate-800">
              No users found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              No users match the current filters.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead>

                <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-[11px] font-black uppercase tracking-[1.5px] text-slate-400">

                  <th className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5">
                      Employee ID
                      <span className="text-slate-300">↕</span>
                    </span>
                  </th>
                  <th className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5">
                      Name
                      <span className="text-slate-300">↕</span>
                    </span>
                  </th>
                  <th className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5">
                      Email
                      <span className="text-slate-300">↕</span>
                    </span>
                  </th>
                  <th className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5">
                      Department
                      <span className="text-slate-300">↕</span>
                    </span>
                  </th>
                  <th className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5">
                      Role
                      <span className="text-slate-300">↕</span>
                    </span>
                  </th>
                  <th className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5">
                      Status
                      <span className="text-slate-300">↕</span>
                    </span>
                  </th>
                  <th className="px-6 py-4 text-right">Actions</th>

                </tr>

              </thead>


              <tbody>

                {users.map((user) => (

                  <tr
                    key={user._id}
                    className="border-b border-slate-100 transition hover:bg-blue-50/30"
                  >

                    <td className="px-6 py-5 text-sm font-bold text-slate-700">
                      {user.employeeId || "-"}
                    </td>


                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-black text-blue-600">
                          {(user.name || "U")
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase()}
                        </div>

                        <p className="truncate font-extrabold text-slate-800">
                          {user.name}
                        </p>

                      </div>

                    </td>


                    <td className="px-6 py-5 text-sm text-slate-500">
                      {user.email}
                    </td>


                    <td className="px-6 py-5 text-sm font-medium text-slate-600">
                      {user.department || "-"}
                    </td>


                    <td className="px-6 py-5">

                      <span
                        className={
                          user.role === "TenantAdmin"
                            ? "inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700"
                            : "inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"
                        }
                      >
                        {user.role}
                      </span>

                    </td>


                    <td className="px-6 py-5">

                      <span
                        className={
                          user.status === "Active"
                            ? "inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                            : "inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700"
                        }
                      >
                        <span
                          className={
                            user.status === "Active"
                              ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
                              : "h-1.5 w-1.5 rounded-full bg-red-500"
                          }
                        />
                        {user.status}
                      </span>

                    </td>


                    <td className="px-6 py-5">

                      <div className="flex justify-end">

                        {isSuperAdmin ? (

                          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700">
                            <HiOutlineEye size={16} />
                            Read Only
                          </span>

                        ) : (

                          <div className="flex items-center gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                setEditingUserId(user._id)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 transition hover:-translate-y-0.5 hover:bg-blue-100"
                              title="Edit"
                            >
                              <HiOutlinePencilSquare size={18} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteUser(user._id)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:-translate-y-0.5 hover:bg-red-100"
                              title="Delete"
                            >
                              <HiOutlineTrash size={18} />
                            </button>

                          </div>

                        )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}


        {!loading && users.length > 0 && (

          <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-700">
                {(currentPage - 1) * 5 + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-slate-700">
                {(currentPage - 1) * 5 + users.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700">
                {totalUsers}
              </span>{" "}
              users
            </p>

            <div className="flex items-center gap-2">

              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() =>
                  setCurrentPage((page) => page - 1)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm">
                {currentPage}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>

            </div>

          </div>

        )}

      </div>


      {editingUserId && (

        <EditUser
          userId={
            editingUserId
          }

          onClose={() =>
            setEditingUserId(
              null
            )
          }

          onUserUpdated={
            handleUserUpdated
          }
        />

      )}

      {showAddUser && isTenantAdmin && (
      <AddUser
        onClose={() =>
          setShowAddUser(false)
        }
        onUserCreated={async () => {
          setShowAddUser(false);
          setCurrentPage(1);
          await loadUsers();
        }}
      />
    )}

    </div>

  );

}


export default Users;