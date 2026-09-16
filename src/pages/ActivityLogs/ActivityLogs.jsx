import { useEffect, useState } from "react";

import {
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineShieldCheck,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlinePhoto,
  HiOutlineCog6Tooth,
  HiOutlinePlusCircle,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

import { getActivityLogs } from "../../services/activityLogService";


function ActivityLogs() {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  // ================= LOAD LOGS =================

  const loadLogs = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await getActivityLogs({
        page: currentPage,
        limit: 10,
        search,
        category,
        status,
      });

      setLogs(data.logs || []);
      setTotalPages(data.totalPages || 1);

    } catch (err) {

      console.error(
        "Activity logs error:",
        err
      );

      setError(
        err.message ||
        "Unable to load activity logs."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    loadLogs();
  }, [
    search,
    category,
    status,
    currentPage,
  ]);


  // ================= ACTIVITY ICON =================

  const getActivityIcon = (action) => {

    switch (action) {

      case "LOGIN":

        return (
          <HiOutlineShieldCheck
            size={21}
            className="text-blue-600"
          />
        );


      case "USER_CREATED":

        return (
          <HiOutlinePlusCircle
            size={21}
            className="text-emerald-600"
          />
        );


      case "USER_UPDATED":

        return (
          <HiOutlinePencilSquare
            size={21}
            className="text-amber-600"
          />
        );


      case "USER_DELETED":

        return (
          <HiOutlineTrash
            size={21}
            className="text-red-600"
          />
        );


      case "PROFILE_IMAGE_UPDATED":

        return (
          <HiOutlinePhoto
            size={21}
            className="text-violet-600"
          />
        );


      case "PASSWORD_CHANGED":

        return (
          <HiOutlineShieldCheck
            size={21}
            className="text-orange-600"
          />
        );


      case "SETTINGS_UPDATED":

        return (
          <HiOutlineCog6Tooth
            size={21}
            className="text-cyan-600"
          />
        );


      default:

        return (
          <HiOutlineClock
            size={21}
            className="text-slate-500"
          />
        );

    }

  };


  // ================= CATEGORY STYLE =================

  const getCategoryStyle = (categoryName) => {

    switch (categoryName) {

      case "Authentication":
        return "bg-blue-50 text-blue-700 border-blue-100";


      case "User":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";


      case "Profile":
        return "bg-violet-50 text-violet-700 border-violet-100";


      case "Security":
        return "bg-orange-50 text-orange-700 border-orange-100";


      case "Settings":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";


      default:
        return "bg-slate-100 text-slate-600 border-slate-200";

    }

  };


  // ================= FORMAT DATE =================

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  };


  // ================= FORMAT ACTION =================

  const formatAction = (action) => {

    return action
      ?.replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        (char) => char.toUpperCase()
      );

  };


  return (

    <div className="min-h-screen w-full bg-slate-100 p-6 text-slate-900 lg:p-10">


      {/* ================= PAGE HEADER ================= */}

      <div className="mb-8">

        <p className="text-xs font-bold uppercase tracking-[2px] text-blue-600">
          Security & Monitoring
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 lg:text-4xl">
          Activity Logs
        </h1>

        <p className="mt-2 max-w-2xl text-slate-500">
          Monitor important activities and security
          events across your organization.
        </p>

      </div>


      {/* ================= MAIN CARD ================= */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">


        {/* ================= TOOLBAR ================= */}

        <div className="border-b border-slate-200 p-6">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


            {/* SEARCH */}

            <div className="relative w-full lg:max-w-md">

              <HiOutlineMagnifyingGlass
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {

                  setSearch(
                    e.target.value
                  );

                  setCurrentPage(1);

                }}
                placeholder="Search activity..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />

            </div>


            {/* FILTERS */}

            <div className="flex flex-col gap-3 sm:flex-row">


              {/* CATEGORY */}

              <div className="relative">

                <HiOutlineFunnel
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={category}
                  onChange={(e) => {

                    setCategory(
                      e.target.value
                    );

                    setCurrentPage(1);

                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-8 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white sm:w-auto"
                >

                  <option value="">
                    All Categories
                  </option>

                  <option value="Authentication">
                    Authentication
                  </option>

                  <option value="User">
                    User
                  </option>

                  <option value="Profile">
                    Profile
                  </option>

                  <option value="Security">
                    Security
                  </option>

                  <option value="Settings">
                    Settings
                  </option>

                  <option value="System">
                    System
                  </option>

                </select>

              </div>


              {/* STATUS */}

              <select
                value={status}
                onChange={(e) => {

                  setStatus(
                    e.target.value
                  );

                  setCurrentPage(1);

                }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
              >

                <option value="">
                  All Status
                </option>

                <option value="Success">
                  Success
                </option>

                <option value="Failed">
                  Failed
                </option>

              </select>

            </div>

          </div>

        </div>


        {/* ================= ERROR ================= */}

        {error && (

          <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>

        )}


        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="p-16 text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading activity logs...
            </p>

          </div>

        ) : logs.length === 0 ? (

          /* ================= EMPTY ================= */

          <div className="p-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

              <HiOutlineClock size={30} />

            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No activity found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          /* ================= ACTIVITY LIST ================= */

          <div className="divide-y divide-slate-100">

            {logs.map((log) => (

              <div
                key={log._id}
                className="group flex flex-col gap-5 p-6 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >


                {/* LEFT SIDE */}

                <div className="flex min-w-0 items-start gap-4">


                  {/* ICON */}

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">

                    {getActivityIcon(
                      log.action
                    )}

                  </div>


                  {/* DETAILS */}

                  <div className="min-w-0">


                    {/* ACTION + CATEGORY */}

                    <div className="flex flex-wrap items-center gap-2">

                      <h3 className="font-bold text-slate-900">

                        {formatAction(
                          log.action
                        )}

                      </h3>


                      <span
                        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${getCategoryStyle(
                          log.category
                        )}`}
                      >
                        {log.category}
                      </span>

                    </div>


                    {/* DESCRIPTION */}

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {log.description}
                    </p>


                    {/* USER */}

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">

                      <span className="flex items-center gap-1.5 font-medium">

                        <HiOutlineUser
                          size={15}
                        />

                        {log.userId?.name ||
                          "Unknown User"}

                      </span>


                      <span className="text-slate-300">
                        •
                      </span>


                      <span>
                        {log.userId?.role ||
                          "Unknown Role"}
                      </span>

                    </div>

                  </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">


                  {/* STATUS */}

                  <span
                    className={
                      log.status ===
                      "Success"
                        ? "flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                        : "flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700"
                    }
                  >

                    {log.status ===
                      "Success" && (
                      <HiOutlineCheckCircle
                        size={14}
                      />
                    )}

                    {log.status}

                  </span>


                  {/* DATE */}

                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">

                    <HiOutlineClock
                      size={14}
                    />

                    {formatDate(
                      log.createdAt
                    )}

                  </span>

                </div>

              </div>

            ))}

          </div>

        )}


        {/* ================= PAGINATION ================= */}

        {!loading &&
          logs.length > 0 && (

            <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">


              <p className="text-sm text-slate-500">

                Page{" "}

                <span className="font-bold text-slate-800">
                  {currentPage}
                </span>

                {" "}of{" "}

                <span className="font-bold text-slate-800">
                  {totalPages}
                </span>

              </p>


              <div className="flex items-center gap-2">


                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (prev) =>
                        prev - 1
                    )
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>


                {/* CURRENT PAGE */}

                <span className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">

                  {currentPage}

                </span>


                {/* NEXT */}

                <button
                  type="button"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (prev) =>
                        prev + 1
                    )
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>

              </div>

            </div>

          )}

      </div>

    </div>

  );
}


export default ActivityLogs;