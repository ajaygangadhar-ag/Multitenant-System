import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  HiOutlineCog6Tooth,
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineBuildingOffice2,
  HiOutlineUserCircle,
  HiOutlineCheckCircle,
  HiOutlineChevronRight,
  HiOutlineEnvelope,
  HiOutlineComputerDesktop,
  HiOutlineLockClosed,
} from "react-icons/hi2";

import api from "../../services/api";

function Settings() {
  const navigate = useNavigate();

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [systemNotifications, setSystemNotifications] =
    useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [user, setUser] = useState(null);

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error(
          "User loading error:",
          err
        );
      }
    }
  }, []);

  // =====================================================
  // LOAD SETTINGS
  // =====================================================

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get("/auth/settings");

        const settings =
          response.data.notificationSettings;

        setEmailNotifications(
          settings?.emailNotifications ?? true
        );

        setSystemNotifications(
          settings?.systemNotifications ?? true
        );
      } catch (err) {
        console.error(
          "Settings loading error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load settings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // =====================================================
  // UPDATE SETTINGS
  // =====================================================

  const updateSettings = async (
    emailValue,
    systemValue
  ) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put(
        "/auth/settings",
        {
          emailNotifications:
            emailValue,

          systemNotifications:
            systemValue,
        }
      );

      const settings =
        response.data.notificationSettings;

      setEmailNotifications(
        settings.emailNotifications
      );

      setSystemNotifications(
        settings.systemNotifications
      );

      setSuccess(
        "Your notification preferences have been saved."
      );

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(
        "Settings update error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // EMAIL TOGGLE
  // =====================================================

  const handleEmailToggle = () => {
    const newValue =
      !emailNotifications;

    setEmailNotifications(newValue);

    updateSettings(
      newValue,
      systemNotifications
    );
  };

  // =====================================================
  // SYSTEM TOGGLE
  // =====================================================

  const handleSystemToggle = () => {
    const newValue =
      !systemNotifications;

    setSystemNotifications(newValue);

    updateSettings(
      emailNotifications,
      newValue
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-100">
        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading settings...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 px-5 py-6 text-slate-900 lg:px-8 lg:py-8">

      <div className="mx-auto w-full max-w-[1500px]">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>

              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                  <HiOutlineCog6Tooth size={19} />
                </div>

                <span className="text-xs font-black uppercase tracking-[2px] text-blue-600">
                  Configuration
                </span>

              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                Settings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 lg:text-base">
                Manage your preferences, notifications,
                account information, and security.
              </p>

            </div>

            {/* Status */}

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-3 shadow-sm">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <HiOutlineCheckCircle size={21} />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  System Status
                </p>

                <p className="text-sm font-bold text-emerald-600">
                  All systems operational
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {success && (
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
              <HiOutlineCheckCircle size={22} />
            </div>

            <div>

              <p className="text-sm font-bold text-emerald-800">
                Settings updated
              </p>

              <p className="mt-0.5 text-sm text-emerald-600">
                {success}
              </p>

            </div>

          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white font-black text-red-600 shadow-sm">
              !
            </div>

            <div>

              <p className="text-sm font-bold text-red-800">
                Something went wrong
              </p>

              <p className="mt-0.5 text-sm text-red-600">
                {error}
              </p>

            </div>

          </div>
        )}

        {/* =================================================
            TOP OVERVIEW CARDS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* ACCOUNT */}

          <div className="group min-h-[180px] rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <HiOutlineUserCircle size={28} />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Account
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-900">
                    {user?.name || "Your Profile"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {user?.role || "User"}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/profile")
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
              >
                <HiOutlineChevronRight size={20} />
              </button>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/profile")
              }
              className="mt-6 flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <span>Manage your profile</span>

              <HiOutlineChevronRight size={18} />

            </button>

          </div>

          {/* ORGANIZATION */}

          <div className="group min-h-[180px] rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <HiOutlineBuildingOffice2 size={28} />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Organization
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-900">
                    {user?.role === "SuperAdmin"
                      ? "Multitenant Platform"
                      : "Your Organization"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Organization settings and access
                  </p>

                </div>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <HiOutlineShieldCheck size={20} />
              </div>

            </div>

            <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3">

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500">
                  Access level
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-600 shadow-sm">
                  {user?.role || "User"}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            MAIN SETTINGS GRID
        ================================================= */}

        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

            {/* Header */}

            <div className="border-b border-slate-200 px-6 py-6">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <HiOutlineBell size={25} />
                </div>

                <div>

                  <h2 className="text-xl font-black text-slate-900">
                    Notifications
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose how you want to receive updates.
                  </p>

                </div>

              </div>

            </div>

            {/* Email */}

            <div className="p-5 sm:p-6">

              <div className="flex items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm">

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <HiOutlineEnvelope size={22} />
                  </div>

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                      <h3 className="font-bold text-slate-900">
                        Email Notifications
                      </h3>

                      {emailNotifications && (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                          Enabled
                        </span>
                      )}

                    </div>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Receive important account updates and
                      alerts by email.
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={handleEmailToggle}
                  disabled={saving}
                  aria-label="Toggle email notifications"
                  className={`relative h-8 w-14 shrink-0 rounded-full p-1 transition ${
                    emailNotifications
                      ? "bg-blue-600"
                      : "bg-slate-300"
                  } ${
                    saving
                      ? "cursor-not-allowed opacity-60"
                      : ""
                  }`}
                >

                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                      emailNotifications
                        ? "translate-x-6"
                        : "translate-x-0"
                    }`}
                  />

                </button>

              </div>

            </div>

            {/* System */}

            <div className="px-5 pb-5 sm:px-6 sm:pb-6">

              <div className="flex items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:bg-white hover:shadow-sm">

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                    <HiOutlineComputerDesktop size={22} />
                  </div>

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                      <h3 className="font-bold text-slate-900">
                        System Notifications
                      </h3>

                      {systemNotifications && (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                          Enabled
                        </span>
                      )}

                    </div>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Receive notifications about important
                      system activity.
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={handleSystemToggle}
                  disabled={saving}
                  aria-label="Toggle system notifications"
                  className={`relative h-8 w-14 shrink-0 rounded-full p-1 transition ${
                    systemNotifications
                      ? "bg-blue-600"
                      : "bg-slate-300"
                  } ${
                    saving
                      ? "cursor-not-allowed opacity-60"
                      : ""
                  }`}
                >

                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                      systemNotifications
                        ? "translate-x-6"
                        : "translate-x-0"
                    }`}
                  />

                </button>

              </div>

            </div>

            {/* Saving indicator */}

            {saving && (
              <div className="border-t border-blue-100 bg-blue-50 px-6 py-3">

                <p className="text-xs font-semibold text-blue-600">
                  Saving your notification preferences...
                </p>

              </div>
            )}

          </section>

          {/* =================================================
              SECURITY
          ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-6">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <HiOutlineShieldCheck size={25} />
                </div>

                <div>

                  <h2 className="text-xl font-black text-slate-900">
                    Security
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Protect your account.
                  </p>

                </div>

              </div>

            </div>

            <div className="p-6">

              {/* Password */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                    <HiOutlineLockClosed size={21} />
                  </div>

                  <div>

                    <p className="font-bold text-slate-900">
                      Password
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Keep your account secure
                    </p>

                  </div>

                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl bg-white px-4 py-3">

                  <div className="flex items-center gap-2">

                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                    <span className="text-sm font-semibold text-emerald-600">
                      Protected
                    </span>

                  </div>

                  <HiOutlineShieldCheck
                    size={19}
                    className="text-emerald-500"
                  />

                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/profile")
                  }
                  className="mt-4 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >

                  <span>
                    Manage password
                  </span>

                  <HiOutlineChevronRight size={18} />

                </button>

              </div>

              {/* Security note */}

              <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">

                <div className="flex gap-3">

                  <HiOutlineShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />

                  <p className="text-xs leading-5 text-amber-700">
                    Use a strong password and never share
                    your login credentials with anyone.
                  </p>

                </div>

              </div>

            </div>

          </section>

        </div>

        {/* =================================================
            PREFERENCES SUMMARY
        ================================================= */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                <HiOutlineCog6Tooth size={24} />
              </div>

              <div>

                <h2 className="font-black text-slate-900">
                  Preferences
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your settings are automatically saved to
                  your account.
                </p>

              </div>

            </div>

            <div className="flex flex-wrap gap-3">

              <div className="rounded-xl bg-slate-50 px-4 py-2.5">

                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p
                  className={`mt-1 text-sm font-bold ${
                    emailNotifications
                      ? "text-emerald-600"
                      : "text-slate-400"
                  }`}
                >
                  {emailNotifications
                    ? "Enabled"
                    : "Disabled"}
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 px-4 py-2.5">

                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  System
                </p>

                <p
                  className={`mt-1 text-sm font-bold ${
                    systemNotifications
                      ? "text-emerald-600"
                      : "text-slate-400"
                  }`}
                >
                  {systemNotifications
                    ? "Enabled"
                    : "Disabled"}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Settings;