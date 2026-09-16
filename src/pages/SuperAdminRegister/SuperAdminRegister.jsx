import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function SuperAdminRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    registrationKey: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showRegistrationKey, setShowRegistrationKey] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.registrationKey
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/superadmin-register",
        formData
      );

      setMessage(
        response.data.message ||
          "SuperAdmin registered successfully."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        registrationKey: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to register SuperAdmin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">

          {/* Header */}

          <div className="text-center mb-8">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">

              <span className="text-3xl">
                👑
              </span>

            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              SuperAdmin Registration
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create the system administrator account
            </p>

          </div>


          {/* Success Message */}

          {message && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}


          {/* Error Message */}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}


          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* Email */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* Password */}

            <div>

  <label className="mb-2 block text-sm font-semibold text-slate-700">
    Password
  </label>

  <div className="relative">

    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Enter password"
      minLength={6}
      required
      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
    />

    <button
        type="button"
        onClick={() =>
            setShowPassword(!showPassword)
        }
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
        >
        {showPassword ? "🙈" : "👁️"}
        </button>

  </div>

</div>


            {/* Registration Key */}

            <div>

  <label className="mb-2 block text-sm font-semibold text-slate-700">
    SuperAdmin Registration Key
  </label>

  <div className="relative">

    <input
      type={
        showRegistrationKey
          ? "text"
          : "password"
      }
      name="registrationKey"
      value={formData.registrationKey}
      onChange={handleChange}
      placeholder="Enter registration key"
      required
      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
    />

   <button
        type="button"
        onClick={() =>
            setShowRegistrationKey(
            !showRegistrationKey
            )
        }
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
        >
        {showRegistrationKey ? "🙈" : "👁️"}
        </button>

  </div>

</div>


            {/* Register Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating SuperAdmin..."
                : "Register SuperAdmin"}
            </button>

          </form>


          {/* Back to Login */}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 w-full text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default SuperAdminRegister;