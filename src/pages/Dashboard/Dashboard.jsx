import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineBuildingOffice2,
  HiOutlineUserCircle,
  HiOutlineCog6Tooth,
  HiOutlineClock,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

import {
  getDashboardStats,
  getRecentActivities,
} from "../../services/dashboardService";

import {  
  getMyTenant,
  getTenants,
} from "../../services/tenantService";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // TenantAdmin organization
  const [organization, setOrganization] = useState(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTenants: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);

  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    let parsedUser = null;

    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("user");
      }
    }

    // =====================================================
    // LOAD DASHBOARD STATISTICS
    // =====================================================

    const loadDashboardStats = async () => {
      try {
        // =================================================
        // SUPERADMIN
        // READ CURRENT DATA FROM ORGANIZATIONS
        // =================================================

        if (parsedUser?.role === "SuperAdmin") {
          const data = await getTenants();

          const organizations = data.tenants || [];

          let totalUsers = 0;
          let activeUsers = 0;
          let inactiveUsers = 0;

          organizations.forEach((organization) => {
            const users = organization.users || [];

            totalUsers += users.length;

            activeUsers += users.filter(
              (user) => user.status === "Active"
            ).length;

            inactiveUsers += users.filter(
              (user) => user.status === "Inactive"
            ).length;
          });

          setStats({
            totalUsers,
            totalTenants: organizations.length,
            activeUsers,
            inactiveUsers,
          });

          return;
        }

        // =================================================
        // TENANTADMIN / USER
        // READ USERS FROM ORGANIZATION.USERS[]
        // =================================================

        const data = await getMyTenant();

        const currentOrganization = data.tenant || null;

        if (!currentOrganization) {
          setStats({
            totalUsers: 0,
            totalTenants: 0,
            activeUsers: 0,
            inactiveUsers: 0,
          });

          return;
        }

        const users = currentOrganization.users || [];

        const totalUsers = users.length;

        const activeUsers = users.filter(
          (user) => user.status === "Active"
        ).length;

        const inactiveUsers = users.filter(
          (user) => user.status === "Inactive"
        ).length;

        setStats({
          totalUsers,
          totalTenants: 1,
          activeUsers,
          inactiveUsers,
        });
      } catch (error) {
        console.error("Dashboard stats error:", error);
      }
    };

    // =====================================================
    // LOAD RECENT ACTIVITIES
    // =====================================================

const loadRecentActivities = async () => {
  try {
    const data = await getRecentActivities();

    console.log(
      "DASHBOARD RECENT ACTIVITIES:",
      data
    );

    const activities = Array.isArray(data)
      ? data
      : [];

    console.log(
      "DASHBOARD RECENT ACTIVITY COUNT:",
      activities.length
    );

    setRecentActivities(activities);
  } catch (error) {
    console.error(
      "Dashboard recent activity error:",
      error
    );
  }
};

    // =====================================================
    // LOAD ORGANIZATION - TENANT ADMIN / USER
    // =====================================================

    const loadOrganization = async () => {
      try {
        const data = await getMyTenant();

        setOrganization(data.tenant || null);
      } catch (error) {
        console.error(
          "Organization error:",
          error
        );

        setOrganization(null);
      }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    loadDashboardStats();
    loadRecentActivities();

    if (
      parsedUser?.role === "User" ||
      parsedUser?.role === "TenantAdmin"
    ) {
      loadOrganization();
    }

    // =====================================================
    // REFRESH WHEN DASHBOARD WINDOW/TAB BECOMES ACTIVE
    // =====================================================

    const handleFocus = () => {
      loadDashboardStats();
      loadRecentActivities();

      if (
        parsedUser?.role === "User" ||
        parsedUser?.role === "TenantAdmin"
      ) {
        loadOrganization();
      }
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, []);

  // =====================================================
  // BROWSER BACK SECURITY
  // =====================================================

  useEffect(() => {
    // Add a history guard entry for the Dashboard.
    // When the browser Back button is pressed, the popstate
    // event will be caught before leaving the Dashboard.
    window.history.pushState(
      { dashboardGuard: true },
      "",
      window.location.href
    );

    const handleBackButton = () => {
      // User pressed browser Back
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Force a fresh Login page and replace the current history entry
      window.location.replace("/");
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.replace("/");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-100 text-slate-900 lg:flex-row">

      {/* ================= SIDEBAR ================= */}

      <aside className="flex w-full shrink-0 flex-col bg-slate-900 text-white shadow-xl lg:min-h-screen lg:w-64">

        {/* Logo */}

        <div className="border-b border-slate-700 px-6 py-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500 text-xl font-black text-white shadow-lg shadow-cyan-500/20">
              M
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">
                Multitenant
              </h1>

              <p className="mt-0.5 text-xs text-slate-400">
                User Management
              </p>
            </div>

          </div>

        </div>

        {/* Navigation */}

        <nav className="flex-1 px-4 py-6">

          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[2px] text-slate-500">
            Workspace
          </p>

          <div className="space-y-1">

            {/* Dashboard */}

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex w-full items-center gap-3 rounded-xl bg-cyan-500 px-4 py-3 text-left font-semibold text-white shadow-lg shadow-cyan-900/20 transition"
            >
              <HiOutlineHome size={20} />
              <span>Dashboard</span>
            </button>

            {/* Users */}

            {(user?.role === "SuperAdmin" ||
              user?.role === "TenantAdmin") && (
              <button
                type="button"
                onClick={() => navigate("/users")}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <HiOutlineUsers size={20} />
                <span>Users</span>
              </button>
            )}

            {/* Tenants */}

            {user?.role === "SuperAdmin" && (
              <button
                type="button"
                onClick={() => navigate("/tenants")}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <HiOutlineBuildingOffice2 size={20} />
                <span>Tenants</span>
              </button>
            )}

            {/* Profile */}

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <HiOutlineUserCircle size={20} />
              <span>Profile</span>
            </button>

            {/* Activity Logs */}

            <button
              type="button"
              onClick={() => navigate("/activity-logs")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <HiOutlineClock size={20} />
              <span>Activity Logs</span>
            </button>

            {/* Settings */}

            <button
              type="button"
              onClick={() => navigate("/settings")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <HiOutlineCog6Tooth size={20} />
              <span>Settings</span>
            </button>

          </div>
        </nav>

        {/* User + Logout */}

        <div className="border-t border-slate-700 p-4">

          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-800 p-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500 font-bold text-white">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold text-white">
                {user?.name || "User"}
              </p>

              <p className="truncate text-xs text-slate-400">
                {user?.role || "User"}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-red-500/20 px-4 py-3 text-left font-semibold text-red-400 transition hover:bg-red-500/10"
          >
            <HiOutlineArrowRightOnRectangle size={20} />
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* ================= TOP BAR ================= */}

        <header className="flex min-h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm lg:px-10">

          <div>

            <p className="text-xs font-bold uppercase tracking-[2px] text-blue-600">
              Overview
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Dashboard
            </h2>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">

              <p className="font-semibold text-slate-800">
                {user?.name || "User"}
              </p>

              <p className="text-xs font-medium text-slate-500">
                {user?.role || "User"}
              </p>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

          </div>

        </header>

        {/* ================= DASHBOARD CONTENT ================= */}

        <main className="flex-1 bg-slate-100 p-6 lg:p-10">

          {/* Welcome */}

          <div className="mb-8">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>

                <p className="text-sm font-semibold text-blue-600">
                  Welcome back 👋
                </p>

                <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 lg:text-4xl">
                  {user?.name || "User"}
                </h1>

                <p className="mt-2 max-w-2xl text-slate-500">
                  Here's what's happening with your organization today.
                </p>

              </div>

              <div className="flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 shadow-sm">

                <HiOutlineCheckCircle
                  size={19}
                  className="text-emerald-600"
                />

                <span className="text-sm font-semibold text-emerald-700">
                  System Active
                </span>

              </div>

            </div>

          </div>

          {/* ================= STAT CARDS ================= */}

          <div
            className={`grid w-full grid-cols-1 items-stretch gap-5 sm:grid-cols-2 ${
              user?.role === "TenantAdmin"
                ? "xl:grid-cols-5"
                : "xl:grid-cols-4"
            }`}
          >

            {/* =================================================
                ORGANIZATION
                TENANTADMIN ONLY
            ================================================= */}

            {(user?.role === "User" || user?.role === "TenantAdmin") && (
              <div className="group flex min-h-[205px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                <div className="flex items-start justify-between">

                  <div className="min-w-0">

                    <p className="text-sm font-medium text-slate-500">
                      Organization
                    </p>

                    <h3 className="mt-3 break-words text-xl font-black leading-7 text-slate-900">
                    {organization?.companyName || "Loading..."}
                  </h3>

                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                    <HiOutlineBuildingOffice2 size={23} />
                  </div>

                </div>

                <p className="mt-4 text-sm text-slate-400">
                  Your Organization
                </p>

              </div>
            )}

            {/* =================================================
                TOTAL USERS
            ================================================= */}

            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Total Users
                  </p>

                  <h3 className="mt-3 text-4xl font-black text-slate-900">
                    {stats.totalUsers}
                  </h3>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <HiOutlineUserGroup size={23} />
                </div>

              </div>

              <p className="mt-4 text-sm text-slate-400">
                Registered users
              </p>

            </div>

            {/* =================================================
                TOTAL TENANTS
                SUPERADMIN ONLY
            ================================================= */}

            {user?.role === "SuperAdmin" && (
              <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-medium text-slate-500">
                      Total Tenants
                    </p>

                    <h3 className="mt-3 text-4xl font-black text-slate-900">
                      {stats.totalTenants}
                    </h3>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                    <HiOutlineBuildingOffice2 size={23} />
                  </div>

                </div>

                <p className="mt-4 text-sm text-slate-400">
                  Organizations
                </p>

              </div>
            )}

            {/* =================================================
                ACTIVE USERS
            ================================================= */}

            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Active Users
                  </p>

                  <h3 className="mt-3 text-4xl font-black text-slate-900">
                    {stats.activeUsers}
                  </h3>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <HiOutlineCheckCircle size={23} />
                </div>

              </div>

              <p className="mt-4 text-sm text-slate-400">
                Currently active
              </p>

            </div>

            {/* =================================================
                INACTIVE USERS
                TENANTADMIN ONLY
            ================================================= */}

            {user?.role === "TenantAdmin" && (
              <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-medium text-slate-500">
                      Inactive Users
                    </p>

                    <h3 className="mt-3 text-4xl font-black text-red-600">
                      {stats.inactiveUsers}
                    </h3>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                    <HiOutlineUsers size={23} />
                  </div>

                </div>

                <p className="mt-4 text-sm text-slate-400">
                  Currently inactive
                </p>

              </div>
            )}

            {/* =================================================
                ROLE
            ================================================= */}

            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-start justify-between">

                <div className="min-w-0">

                  <p className="text-sm font-medium text-slate-500">
                    Your Role
                  </p>

                  <h3 className="mt-3 whitespace-nowrap text-xl font-black leading-7 text-slate-900">
                  {user?.role || "User"}
                </h3>

                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                  <HiOutlineShieldCheck size={23} />
                </div>

              </div>

              <p className="mt-4 text-sm text-slate-400">
                Access level
              </p>

            </div>

          </div>

          {/* ================= LOWER CONTENT ================= */}

          <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* Recent Activity */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Recent Activity
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Latest activity in your organization
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => navigate("/activity-logs")}
                  className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                >
                  View All
                </button>

              </div>

             <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
  {recentActivities.length > 0 ? (
    <div className="divide-y divide-slate-200">
      {recentActivities.map((activity, index) => (
        <div
          key={`${activity._id}-${index}`}
          className="flex items-start gap-4 px-5 py-4"
        >
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <HiOutlineClock size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
              <p className="font-semibold text-slate-800">
                {activity.description || activity.action || "Activity"}
              </p>

              <span className="shrink-0 text-xs text-slate-400">
                {activity.createdAt
                  ? new Date(activity.createdAt).toLocaleString()
                  : ""}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-600">
                {activity.action || "ACTIVITY"}
              </span>

              <span>
                {activity.category || "System"}
              </span>

              {activity.userId?.name && (
                <>
                  <span>•</span>
                  <span>{activity.userId.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex min-h-40 items-center justify-center px-4 text-center">
      <div>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
          <HiOutlineClock size={23} />
        </div>

        <p className="mt-3 text-sm font-medium text-slate-500">
          No recent activity available.
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Activity will appear here as actions occur.
        </p>
      </div>
    </div>
  )}
</div>

            </div>

            {/* ================= SYSTEM INFORMATION ================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              {/* Header */}

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <HiOutlineCheckCircle size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    System Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Current system and account status
                  </p>
                </div>

              </div>


              {/* Information */}

              <div className="mt-6 space-y-3">

                {/* System Status */}

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                      <HiOutlineCheckCircle size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        System Status
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Platform availability
                      </p>
                    </div>

                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                    Operational
                  </span>

                </div>


                {/* Authentication */}

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                      <HiOutlineShieldCheck size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Authentication
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Secure login session
                      </p>
                    </div>

                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                    Secured
                  </span>

                </div>


                {/* Current Session */}

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                      <HiOutlineClock size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Current Session
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Your account session
                      </p>
                    </div>

                  </div>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                    Active
                  </span>

                </div>


                {/* Access Level */}

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-orange-600 shadow-sm">
                      <HiOutlineShieldCheck size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Access Level
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Your current role
                      </p>
                    </div>

                  </div>

                  <span className="max-w-[120px] truncate rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                    {user?.role || "User"}
                  </span>

                </div>

              </div>


              {/* Footer */}

              <div className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3">

                <div className="flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>

                  <p className="text-xs font-medium text-slate-500">
                    Multitenant User Management System
                  </p>

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;