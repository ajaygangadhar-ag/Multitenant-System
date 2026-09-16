import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import {
  HiOutlineBuildingOffice2,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineLockClosed,
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

import {
  HiEye,
  HiEyeOff,
} from "react-icons/hi";

import {
  registerOrganization,
} from "../../services/authService";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

 const [formData, setFormData] = useState({
        companyName: "",
        companyEmail: "",
        phone: "",
        address: "",
        adminEmployeeId: "",
        adminName: "",
        adminEmail: "",
        adminPassword: "",
        confirmPassword: "",
        });

  // ===============================
  // HANDLE INPUT
  // ===============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // REGISTER ORGANIZATION
  // ===============================

  const handleRegister = async () => {
    const {
        companyName,
        companyEmail,
        phone,
        address,
        adminEmployeeId,
        adminName,
        adminEmail,
        adminPassword,
        confirmPassword,
        } = formData;

    // Required fields
    if (
      !companyName ||
      !companyEmail ||
      !phone ||
      !address ||
      !adminEmployeeId ||
      !adminName ||
      !adminEmail ||
      !adminPassword ||
      !confirmPassword
    ) {
      toast.error(
        "Please fill in all required fields"
      );
      return;
    }

    // Password match
    if (
      adminPassword !== confirmPassword
    ) {
      toast.error(
        "Passwords do not match"
      );
      return;
    }

    // Password length
    if (adminPassword.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    try {
      setLoading(true);

      const data =
        await registerOrganization({
          companyName,
          companyEmail,
          phone,
          address,
          adminEmployeeId,
          adminName,
          adminEmail,
          adminPassword,
        });

      toast.success(
        data.message ||
          "Organization registered successfully"
      );

      // Go back to Login
      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (error) {
      toast.error(
        error.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950" />

      {/* BLUE GLOW */}

      <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-blue-500/30 blur-[150px]" />

      {/* VIOLET GLOW */}

      <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-violet-600/30 blur-[150px]" />

      {/* CYAN GLOW */}

      <div className="absolute left-[40%] top-[20%] h-[300px] w-[300px] rounded-full bg-cyan-400/10 blur-[120px]" />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center p-5">

        <div className="flex min-h-[calc(100vh-40px)] w-full max-w-[1250px] overflow-hidden rounded-[32px] border border-white/10 bg-white shadow-2xl">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -80,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="relative hidden w-[48%] overflow-hidden lg:flex"
          >

            {/* LEFT BACKGROUND */}

            <div className="absolute inset-0 bg-gradient-to-br from-[#06152F] via-[#123F8C] to-[#6426B8]" />

            {/* GRID */}

            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                backgroundSize: "45px 45px",
              }}
            />

            {/* GLOW CIRCLES */}

            <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />

            <div className="absolute -bottom-32 -right-20 h-[450px] w-[450px] rounded-full bg-violet-400/20 blur-3xl" />

            {/* FLOATING CIRCLES */}

            <div className="absolute right-16 top-20 h-28 w-28 rounded-full border border-cyan-300/20 bg-cyan-300/5 backdrop-blur-xl" />

            <div className="absolute bottom-28 left-16 h-20 w-20 rounded-full border border-violet-300/20 bg-violet-300/5 backdrop-blur-xl" />

            {/* LEFT CONTENT */}

            <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-14">

              {/* BRAND */}

              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-2xl backdrop-blur-xl">

                  <HiOutlineBuildingOffice2
                    size={32}
                  />

                </div>

                <div>

                  <h2 className="text-2xl font-black tracking-wide text-white">
                    MULTITENANT
                  </h2>

                  <p className="mt-1 text-xs font-bold uppercase tracking-[4px] text-cyan-300">
                    Management Platform
                  </p>

                </div>

              </div>

              {/* HERO */}

              <div className="max-w-xl">

                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/10 px-4 py-2 backdrop-blur-xl">

                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300" />

                  <span className="text-xs font-bold uppercase tracking-[2px] text-cyan-200">
                    Organization Onboarding
                  </span>

                </div>

                <h1 className="text-4xl font-black leading-[1.08] text-white xl:text-6xl">

                  Build your

                  <br />

                  <span className="bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-transparent">
                    organization.
                  </span>

                </h1>

                <p className="mt-7 max-w-xl text-lg leading-8 text-blue-100/75">
                  Create your organization and
                  set up your Tenant Administrator
                  in one secure and powerful
                  multitenant workspace.
                </p>

                {/* FEATURE CARDS */}

                <div className="mt-10 space-y-4">

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300">

                        <HiOutlineBuildingOffice2
                          size={25}
                        />

                      </div>

                      <div>

                        <h3 className="font-bold text-white">
                          Create Organization
                        </h3>

                        <p className="mt-1 text-sm text-blue-100/60">
                          Set up your company workspace
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-400/15 text-violet-300">

                        <HiOutlineShieldCheck
                          size={25}
                        />

                      </div>

                      <div>

                        <h3 className="font-bold text-white">
                          Tenant Admin
                        </h3>

                        <p className="mt-1 text-sm text-blue-100/60">
                          Your first administrator account
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="flex justify-between text-xs text-blue-100/50">

                <span>
                  © 2026 Multitenant Platform
                </span>

                <span>
                  Secure • Scalable • Simple
                </span>

              </div>

            </div>

          </motion.div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 80,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.15,
            }}
            className="flex w-full items-center justify-center bg-white px-7 py-10 sm:px-10 lg:w-[52%] lg:px-12 xl:px-14"
          >

            <div className="w-full max-w-[560px]">

              {/* MOBILE LOGO */}

              <div className="mb-7 flex items-center gap-3 lg:hidden">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white">

                  <HiOutlineBuildingOffice2
                    size={25}
                  />

                </div>

                <div>

                  <p className="font-black text-slate-900">
                    MULTITENANT
                  </p>

                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-blue-600">
                    Management Platform
                  </p>

                </div>

              </div>

              {/* HEADER */}

              <div className="mb-7">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-xl shadow-blue-600/20">

                  <HiOutlineBuildingOffice2
                    size={27}
                  />

                </div>

                <p className="mt-5 text-xs font-black uppercase tracking-[3px] text-blue-600">
                  Organization Registration
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 xl:text-4xl">
                  Create your workspace.
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Register your organization and
                  create your Tenant Administrator.
                </p>

              </div>

              {/* FORM */}

              <div className="space-y-5">

                {/* ORGANIZATION DETAILS */}

                <div>

                  <h3 className="mb-3 text-sm font-black uppercase tracking-[2px] text-slate-700">
                    Organization Details
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    {/* COMPANY NAME */}

                    <div className="sm:col-span-2">

                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Company Name
                      </label>

                      <div className="relative">

                        <HiOutlineBuildingOffice2
                          size={20}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          name="companyName"
                          placeholder="ABC Technologies"
                          value={formData.companyName}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                      </div>

                    </div>

                    {/* COMPANY EMAIL */}

                    <div>

                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Company Email
                      </label>

                      <div className="relative">

                        <HiOutlineEnvelope
                          size={20}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="email"
                          name="companyEmail"
                          placeholder="company@example.com"
                          value={formData.companyEmail}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                      </div>

                    </div>

                    {/* PHONE */}

                    <div>

                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Phone
                      </label>

                      <div className="relative">

                        <HiOutlinePhone
                          size={20}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="tel"
                          name="phone"
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                      </div>

                    </div>

                    {/* ADDRESS */}

                    <div className="sm:col-span-2">

                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Address
                      </label>

                      <div className="relative">

                        <HiOutlineMapPin
                          size={20}
                          className="absolute left-4 top-4 text-slate-400"
                        />

                        <textarea
                          name="address"
                          placeholder="Enter organization address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="2"
                          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                      </div>

                    </div>

                  </div>

                </div>

                {/* ADMIN DETAILS */}

                <div className="border-t border-slate-100 pt-5">

                  <h3 className="mb-3 text-sm font-black uppercase tracking-[2px] text-slate-700">
                    Tenant Administrator
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    {/* EMPLOYEE NUMBER */}

                    <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Employee Number
                    </label>

                    <div className="relative">

                        <HiOutlineUser
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                        type="text"
                        name="adminEmployeeId"
                        placeholder="ADM001"
                        value={formData.adminEmployeeId}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                    </div>

                    </div>

                    {/* ADMIN NAME */}

                    <div>

                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Admin Name
                      </label>

                      <div className="relative">

                        <HiOutlineUser
                          size={20}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          name="adminName"
                          placeholder="Your name"
                          value={formData.adminName}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                      </div>

                    </div>

                    {/* ADMIN EMAIL */}

                    <div>

                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Admin Email
                      </label>

                      <div className="relative">

                        <HiOutlineEnvelope
                          size={20}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="email"
                          name="adminEmail"
                          placeholder="admin@example.com"
                          value={formData.adminEmail}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                      </div>

                    </div>

                    {/* PASSWORD */}

                    <div>

                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Password
                      </label>

                      <div className="relative">

                        <HiOutlineLockClosed
                          size={20}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          name="adminPassword"
                          placeholder="Create password"
                          value={formData.adminPassword}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-11 text-sm text-slate-900 outline-none transition hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
                        >
                          {showPassword ? (
                            <HiEyeOff size={20} />
                          ) : (
                            <HiEye size={20} />
                          )}
                        </button>

                      </div>

                    </div>

                    {/* CONFIRM PASSWORD */}

                    <div>

                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Confirm Password
                      </label>

                      <div className="relative">

                        <HiOutlineLockClosed
                          size={20}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={
                            formData.confirmPassword
                          }
                          onChange={handleChange}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter"
                            ) {
                              handleRegister();
                            }
                          }}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-11 text-sm text-slate-900 outline-none transition hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              !showConfirmPassword
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
                        >
                          {showConfirmPassword ? (
                            <HiEyeOff size={20} />
                          ) : (
                            <HiEye size={20} />
                          )}
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

                {/* REGISTER BUTTON */}

                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-4 font-bold text-white shadow-xl shadow-blue-600/25 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-600/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Creating Organization..."
                    : "Create Organization"}

                  {!loading && (
                    <HiOutlineArrowRight
                      size={20}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}
                </button>

                {/* LOGIN LINK */}

                <div className="pt-1 text-center">

                  <span className="text-sm text-slate-500">
                    Already have an account?{" "}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/")
                    }
                    className="text-sm font-bold text-blue-600 transition hover:text-violet-600"
                  >
                    Sign in
                  </button>

                </div>

                {/* SECURITY */}

                <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-400">

                  <HiOutlineShieldCheck
                    size={16}
                    className="text-emerald-500"
                  />

                  Secure organization registration

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

    </div>
  );
}

export default Register;