import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import { loginUser } from "../../services/authService";

import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineBuildingOffice2,
  HiOutlineShieldCheck,
  HiOutlineUsers,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineUserGroup,
  HiOutlineGlobeAlt,
  HiOutlineBolt,
  HiOutlineDocumentCheck,
  HiOutlineAcademicCap,
  HiOutlineCommandLine,
} from "react-icons/hi2";

import {
  HiEye,
  HiEyeOff,
} from "react-icons/hi";


function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(formData);

      // Store authentication data
      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      toast.success(data.message);

      navigate("/dashboard");

    } catch (error) {
      toast.error(
        error.message || "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // FEATURES
  // =====================================================

  const features = [
    {
      icon: HiOutlineShieldCheck,
      title: "Secure Access",
      description:
        "Protect your organization with secure authentication and role-based access control.",
    },
    {
      icon: HiOutlineUsers,
      title: "Multi-Tenant",
      description:
        "Manage multiple organizations independently from one centralized platform.",
    },
    {
      icon: HiOutlineUserGroup,
      title: "User Management",
      description:
        "Create, manage and organize users with simple administrative controls.",
    },
    {
      icon: HiOutlineBuildingOffice2,
      title: "Organization Management",
      description:
        "Keep every organization and its users securely separated and organized.",
    },
    {
      icon: HiOutlineChartBar,
      title: "Powerful Dashboard",
      description:
        "Get a clear overview of users, activity and organization information.",
    },
    {
      icon: HiOutlineCog6Tooth,
      title: "Easy Administration",
      description:
        "Manage profiles, settings, notifications and security from one workspace.",
    },
  ];


  // =====================================================
  // BENEFITS
  // =====================================================

  const benefits = [
    "Centralized organization management",
    "Secure authentication and authorization",
    "Role-based access control",
    "Tenant-level data isolation",
    "User activity monitoring",
    "Simple and modern administration",
  ];


  // =====================================================
  // HOW IT WORKS
  // =====================================================

  const steps = [
    {
      number: "01",
      icon: HiOutlineBuildingOffice2,
      title: "Create Organization",
      description:
        "Create your organization and establish your secure workspace.",
    },
    {
      number: "02",
      icon: HiOutlineUsers,
      title: "Add Users",
      description:
        "Add employees and users to your organization.",
    },
    {
      number: "03",
      icon: HiOutlineShieldCheck,
      title: "Assign Roles",
      description:
        "Give users the appropriate access level and permissions.",
    },
    {
      number: "04",
      icon: HiOutlineCommandLine,
      title: "Manage Workspace",
      description:
        "Monitor activity and manage your organization from one place.",
    },
  ];


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">


      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

          {/* LOGO */}

          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">

              <HiOutlineBuildingOffice2
                size={23}
              />

            </div>


            <div className="text-left">

              <h2 className="text-lg font-black tracking-tight text-slate-900">
                MULTITENANT
              </h2>

              <p className="text-[9px] font-bold uppercase tracking-[2.5px] text-blue-600">
                Management Platform
              </p>

            </div>

          </button>


          {/* NAV LINKS */}

          <div className="hidden items-center gap-8 md:flex">

            <a
              href="#features"
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              How It Works
            </a>

            <a
              href="#security"
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              Security
            </a>

          </div>


          {/* NAV BUTTON */}

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("login")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Sign In
          </button>

        </div>

      </nav>



      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">

        {/* Background decorations */}

        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />

        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />


        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">


          {/* LEFT HERO */}

          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >

            {/* Badge */}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 shadow-sm">

              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-bold uppercase tracking-[2px] text-blue-700">
                Enterprise Workspace
              </span>

            </div>


            <h1 className="max-w-2xl text-5xl font-black leading-[1.05] tracking-tight text-slate-950 md:text-6xl lg:text-7xl">

              One platform.

              <br />

              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Infinite possibilities.
              </span>

            </h1>


            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">

              Securely manage organizations, users,
              roles and permissions from one powerful
              multitenant management workspace.

            </p>


            {/* HERO BUTTONS */}

            <div className="mt-9 flex flex-wrap gap-4">

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("login")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="group flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
              >

                Get Started

                <HiOutlineArrowRight
                  size={19}
                  className="transition-transform group-hover:translate-x-1"
                />

              </button>


              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:text-blue-600"
              >
                Explore Features
              </button>

            </div>


            {/* HERO TRUST */}

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">

              <div className="flex items-center gap-2">
                <HiOutlineCheckCircle
                  className="text-emerald-500"
                  size={19}
                />
                Secure authentication
              </div>

              <div className="flex items-center gap-2">
                <HiOutlineCheckCircle
                  className="text-emerald-500"
                  size={19}
                />
                Role-based access
              </div>

              <div className="flex items-center gap-2">
                <HiOutlineCheckCircle
                  className="text-emerald-500"
                  size={19}
                />
                Multi-tenant ready
              </div>

            </div>

          </motion.div>



          {/* RIGHT LOGIN CARD */}

          <motion.div
            id="login"
            initial={{
              opacity: 0,
              x: 40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
            className="scroll-mt-28"
          >

            <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-200/70 sm:p-9">


              {/* LOGIN ICON */}

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">

                <HiOutlineShieldCheck
                  size={28}
                />

              </div>


              <p className="text-xs font-black uppercase tracking-[3px] text-blue-600">
                Secure Login
              </p>


              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                Welcome back.
              </h2>


              <p className="mt-3 leading-6 text-slate-500">
                Sign in to continue to your
                organization workspace.
              </p>


              {/* FORM */}

              <div className="mt-8 space-y-5">


                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">

                    <HiOutlineEnvelope
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
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
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleLogin();
                        }
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
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


                {/* OPTIONS */}

                <div className="flex items-center justify-between">

                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">

                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded accent-blue-600"
                    />

                    Remember me

                  </label>


                  <button
                    type="button"
                    onClick={() =>
                      navigate("/forgot-password")
                    }
                    className="text-sm font-bold text-blue-600 transition hover:text-indigo-600"
                  >
                    Forgot password?
                  </button>

                </div>


                {/* LOGIN BUTTON */}

                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading
                    ? "Signing In..."
                    : "Sign In"}

                  {!loading && (
                    <HiOutlineArrowRight
                      size={20}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}

                </button>


                {/* REGISTER */}

                <div className="pt-1 text-center">

                  <span className="text-sm text-slate-500">
                    Don't have an organization yet?{" "}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/register")
                    }
                    className="text-sm font-bold text-blue-600 hover:text-indigo-600"
                  >
                    Create an account
                  </button>

                </div>


                {/* SECURITY */}

                <div className="flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">

                  <HiOutlineShieldCheck
                    size={16}
                    className="text-emerald-500"
                  />

                  Protected enterprise connection

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </section>



      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="border-y border-slate-200 bg-white">

        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-slate-200 md:grid-cols-4">

          <div className="px-6 py-9 text-center">

            <p className="text-3xl font-black text-blue-600">
              500+
            </p>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Organizations
            </p>

          </div>


          <div className="px-6 py-9 text-center">

            <p className="text-3xl font-black text-indigo-600">
              25K+
            </p>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Users
            </p>

          </div>


          <div className="px-6 py-9 text-center">

            <p className="text-3xl font-black text-violet-600">
              99.9%
            </p>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Uptime
            </p>

          </div>


          <div className="px-6 py-9 text-center">

            <p className="text-3xl font-black text-emerald-600">
              24/7
            </p>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Availability
            </p>

          </div>

        </div>

      </section>



      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        id="features"
        className="scroll-mt-20 bg-slate-50 px-6 py-24 lg:px-8"
      >

        <div className="mx-auto max-w-7xl">


          {/* HEADER */}

          <div className="mx-auto max-w-2xl text-center">

            <span className="text-xs font-black uppercase tracking-[3px] text-blue-600">
              Powerful Features
            </span>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Everything you need.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              A complete workspace designed to make
              organization and user management simple,
              secure and efficient.
            </p>

          </div>


          {/* FEATURE GRID */}

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {features.map((feature, index) => {

              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                  }}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100"
                >

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

                    <Icon size={27} />

                  </div>


                  <h3 className="mt-6 text-xl font-black text-slate-900">
                    {feature.title}
                  </h3>


                  <p className="mt-3 leading-7 text-slate-500">
                    {feature.description}
                  </p>


                  <div className="mt-5 flex items-center gap-2 text-sm font-bold text-blue-600">

                    Learn more

                    <HiOutlineArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />

                  </div>

                </motion.div>
              );

            })}

          </div>

        </div>

      </section>



      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}

      <section
        id="security"
        className="scroll-mt-20 bg-white px-6 py-24 lg:px-8"
      >

        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">


          {/* LEFT */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
          >

            <span className="text-xs font-black uppercase tracking-[3px] text-blue-600">
              Why Choose Us
            </span>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Built for modern organizations.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
              Keep your organization, users and
              administrative operations organized in one
              secure and easy-to-use platform.
            </p>


            <div className="mt-8 space-y-4">

              {benefits.map((benefit) => (

                <div
                  key={benefit}
                  className="flex items-center gap-3"
                >

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">

                    <HiOutlineCheckCircle
                      size={18}
                    />

                  </div>

                  <span className="font-semibold text-slate-700">
                    {benefit}
                  </span>

                </div>

              ))}

            </div>

          </motion.div>



          {/* RIGHT SECURITY CARD */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
            className="relative"
          >

            <div className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 shadow-xl shadow-blue-100">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-md">

                <HiOutlineShieldCheck
                  size={34}
                />

              </div>


              <h3 className="mt-7 text-2xl font-black text-slate-950">
                Security at every level.
              </h3>


              <p className="mt-4 leading-7 text-slate-500">
                Protect your workspace with secure
                authentication, controlled access and
                organization-level separation.
              </p>


              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-slate-200 bg-white p-5">

                  <HiOutlineLockClosed
                    size={23}
                    className="text-blue-600"
                  />

                  <h4 className="mt-3 font-bold text-slate-900">
                    Secure Login
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Protected account access
                  </p>

                </div>


                <div className="rounded-2xl border border-slate-200 bg-white p-5">

                  <HiOutlineUsers
                    size={23}
                    className="text-indigo-600"
                  />

                  <h4 className="mt-3 font-bold text-slate-900">
                    Role Control
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Controlled permissions
                  </p>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </section>



      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        id="how-it-works"
        className="scroll-mt-20 bg-slate-50 px-6 py-24 lg:px-8"
      >

        <div className="mx-auto max-w-7xl">


          <div className="mx-auto max-w-2xl text-center">

            <span className="text-xs font-black uppercase tracking-[3px] text-blue-600">
              Simple Workflow
            </span>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              How it works.
            </h2>

            <p className="mt-5 text-lg text-slate-500">
              Get your organization workspace running
              in just a few simple steps.
            </p>

          </div>


          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {steps.map((step, index) => {

              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-sm font-black text-blue-600">
                      {step.number}
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                      <Icon size={24} />

                    </div>

                  </div>


                  <h3 className="mt-6 text-lg font-black text-slate-900">
                    {step.title}
                  </h3>


                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>


                  {index !== steps.length - 1 && (
                    <div className="absolute -right-4 top-1/2 hidden h-px w-8 bg-blue-200 lg:block" />
                  )}

                </motion.div>
              );

            })}

          </div>

        </div>

      </section>



      {/* =====================================================
          PLATFORM HIGHLIGHTS
      ===================================================== */}

      <section className="bg-white px-6 py-24 lg:px-8">

        <div className="mx-auto max-w-7xl">


          <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-8 md:p-12">

            <div className="grid items-center gap-10 lg:grid-cols-3">


              <div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">

                  <HiOutlineBolt
                    size={27}
                  />

                </div>

                <h2 className="mt-6 text-3xl font-black text-slate-950">
                  One workspace.
                  <br />
                  Complete control.
                </h2>

              </div>


              <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <HiOutlineGlobeAlt
                    size={25}
                    className="text-blue-600"
                  />

                  <h3 className="mt-4 font-black text-slate-900">
                    Centralized Management
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Manage your entire organization from
                    one centralized workspace.
                  </p>

                </div>


                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <HiOutlineDocumentCheck
                    size={25}
                    className="text-indigo-600"
                  />

                  <h3 className="mt-4 font-black text-slate-900">
                    Activity Monitoring
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Keep track of important activities
                    across your workspace.
                  </p>

                </div>


                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <HiOutlineAcademicCap
                    size={25}
                    className="text-violet-600"
                  />

                  <h3 className="mt-4 font-black text-slate-900">
                    Easy to Use
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Designed with a clean interface that
                    makes administration simple.
                  </p>

                </div>


                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <HiOutlineChartBar
                    size={25}
                    className="text-emerald-600"
                  />

                  <h3 className="mt-4 font-black text-slate-900">
                    Clear Insights
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    View important organization information
                    at a glance.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* =====================================================
          CALL TO ACTION
      ===================================================== */}

      <section className="px-6 py-20 lg:px-8">

        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-16 text-center shadow-2xl shadow-indigo-200 md:px-16">

          <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Ready to manage smarter?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Create your organization workspace and
            start managing users, roles and permissions
            from one powerful platform.
          </p>


          <div className="mt-8 flex flex-wrap justify-center gap-4">

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
              className="group flex items-center gap-3 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 shadow-lg transition hover:-translate-y-1"
            >

              Create an Organization

              <HiOutlineArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />

            </button>


            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("login")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              Sign In
            </button>

          </div>

        </div>

      </section>



      {/* =====================================================
          STATIC FOOTER
      ===================================================== */}

      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">


          {/* TOP FOOTER */}

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">


            {/* BRAND */}

            <div className="lg:col-span-2">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">

                  <HiOutlineBuildingOffice2
                    size={23}
                  />

                </div>


                <div>

                  <h3 className="font-black tracking-tight text-slate-900">
                    MULTITENANT
                  </h3>

                  <p className="text-[9px] font-bold uppercase tracking-[2px] text-blue-600">
                    Management Platform
                  </p>

                </div>

              </div>


              <p className="mt-6 max-w-sm leading-7 text-slate-500">
                A modern multitenant user management
                platform designed to help organizations
                securely manage users, roles and
                administration.
              </p>


              <div className="mt-6 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <HiOutlineShieldCheck size={18} />
                </div>

                <span className="text-sm font-semibold text-slate-500">
                  Secure • Scalable • Simple
                </span>

              </div>

            </div>


            {/* PRODUCT */}

            <div>

              <h4 className="font-black text-slate-900">
                Product
              </h4>

              <div className="mt-5 space-y-3">

                <a
                  href="#features"
                  className="block text-sm text-slate-500 transition hover:text-blue-600"
                >
                  Features
                </a>

                <a
                  href="#how-it-works"
                  className="block text-sm text-slate-500 transition hover:text-blue-600"
                >
                  How It Works
                </a>

                <a
                  href="#security"
                  className="block text-sm text-slate-500 transition hover:text-blue-600"
                >
                  Security
                </a>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/register")
                  }
                  className="block text-sm text-slate-500 transition hover:text-blue-600"
                >
                  Create Organization
                </button>

              </div>

            </div>


            {/* PLATFORM */}

            <div>

              <h4 className="font-black text-slate-900">
                Platform
              </h4>

              <div className="mt-5 space-y-3">

                <span className="block text-sm text-slate-500">
                  User Management
                </span>

                <span className="block text-sm text-slate-500">
                  Role Management
                </span>

                <span className="block text-sm text-slate-500">
                  Activity Logs
                </span>

                <span className="block text-sm text-slate-500">
                  Organization Management
                </span>

              </div>

            </div>


            {/* COMPANY */}

            <div>

              <h4 className="font-black text-slate-900">
                Company
              </h4>

              <div className="mt-5 space-y-3">

                <span className="block text-sm text-slate-500">
                  About Platform
                </span>

                <span className="block text-sm text-slate-500">
                  Documentation
                </span>

                <span className="block text-sm text-slate-500">
                  Support
                </span>

                <span className="block text-sm text-slate-500">
                  Contact
                </span>

              </div>

            </div>

          </div>


          {/* FOOTER BOTTOM */}

          <div className="mt-14 flex flex-col gap-5 border-t border-slate-200 pt-7 md:flex-row md:items-center md:justify-between">

            <p className="text-sm text-slate-400">
              © 2026 Multitenant Management Platform.
              All rights reserved.
            </p>


            <div className="flex flex-wrap gap-6">

              <button
                type="button"
                className="text-sm text-slate-400 transition hover:text-blue-600"
              >
                Privacy Policy
              </button>

              <button
                type="button"
                className="text-sm text-slate-400 transition hover:text-blue-600"
              >
                Terms of Service
              </button>

              <button
                type="button"
                className="text-sm text-slate-400 transition hover:text-blue-600"
              >
                Security
              </button>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}


export default Login;