import { useEffect, useState } from "react";
import { changePassword } from "../../services/authService";

import {
  getMyProfile,
  uploadProfileImage,
  updateMyProfile,
} from "../../services/userService";

import {
  HiEye,
  HiEyeOff,
} from "react-icons/hi";

import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineBuildingOffice2,
  HiOutlineBriefcase,
  HiOutlineIdentification,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlinePencilSquare,
  HiOutlineCheckCircle,
  HiOutlineCamera,
} from "react-icons/hi2";


const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://multitenant-system2.vercel.app");

function Profile() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Profile image
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Edit profile
  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changingPassword, setChangingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [showChangePassword, setShowChangePassword] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");


  // ================= SUCCESS =================

  const showSuccess = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 2500);
  };


  // ================= LOAD PROFILE =================

  useEffect(() => {

    const loadProfile = async () => {

      try {

        setLoading(true);
        setError("");

        const data = await getMyProfile();

        setUser(data.user);

      } catch (err) {

        console.error(
          "Profile loading error:",
          err
        );

        setError(
          err.message ||
          "Unable to load profile."
        );

      } finally {

        setLoading(false);

      }

    };

    loadProfile();

  }, []);


  // ================= IMAGE UPLOAD =================

  const handleImageUpload = async () => {

    if (!selectedImage || !user?._id) {
      return;
    }

    try {

      setUploadingImage(true);
      setError("");

      const formData = new FormData();

      formData.append(
        "profileImage",
        selectedImage
      );

      const data = await uploadProfileImage(
        user._id,
        formData
      );

      setUser((prev) => ({
        ...prev,
        profileImage: data.profileImage,
      }));

      setSelectedImage(null);

      showSuccess(
        "Profile photo updated successfully"
      );

    } catch (err) {

      console.error(
        "Profile image upload error:",
        err
      );

      setError(
        err.message ||
        "Unable to upload profile image."
      );

    } finally {

      setUploadingImage(false);

    }

  };


  // ================= UPDATE PROFILE ================= 

const handleProfileUpdate = async (e) => {

  e.preventDefault();

  try {

    setSavingProfile(true);
    setError("");

    const profileData = {
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      department: user.department,
      designation: user.designation,
    };

    const data = await updateMyProfile(
      profileData
    );

    setUser(data.user);

    setEditing(false);

    showSuccess(
      "Profile updated successfully"
    );

  } catch (err) {

    console.error(
      "Profile update error:",
      err
    );

    setError(
      err.message ||
      "Unable to update profile."
    );

  } finally {

    setSavingProfile(false);

  }
};


  // ================= CHANGE PASSWORD =================

  const handleChangePassword = async (e) => {

    e.preventDefault();

    setError("");

    if (
      newPassword !==
      confirmPassword
    ) {

      setError(
        "New password and confirm password do not match."
      );

      return;
    }

    if (newPassword.length < 6) {

      setError(
        "New password must be at least 6 characters."
      );

      return;
    }

    try {

      setChangingPassword(true);

      const data = await changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setShowChangePassword(false);

      showSuccess(
        data.message ||
        "Password changed successfully"
      );

    } catch (err) {

      console.error(
        "Change password error:",
        err
      );

      setError(
        err.message ||
        "Unable to change password."
      );

    } finally {

      setChangingPassword(false);

    }

  };


  // ================= LOADING =================

  if (loading) {

    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-100">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your profile...
          </p>

        </div>

      </div>
    );

  }


  // ================= ERROR =================

  if (error && !user) {

    return (
      <div className="min-h-[60vh] bg-slate-100 p-10 text-center">

        <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-sm">

          <p className="font-medium text-red-600">
            {error}
          </p>

        </div>

      </div>
    );

  }


  return (

    <div className="min-h-screen w-full bg-slate-100 p-5 text-slate-900 sm:p-6 lg:p-8">

      {/* ================= SUCCESS POPUP ================= */}

      {successMessage && (
        <div className="fixed right-5 top-5 z-[100]">
          <div className="flex min-w-[300px] items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <HiOutlineCheckCircle size={23} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Success</p>
              <p className="mt-1 text-sm text-emerald-600">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= PAGE HEADER ================= */}

      <div className="mx-auto mb-7 max-w-[1500px]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[2.5px] text-blue-600">
              Account
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              My Profile
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
              Manage your personal information, profile picture, and account security.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-bold text-emerald-700">
              {user?.status || "Active"}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-auto mb-6 max-w-[1500px] rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {user && (
        <div className="mx-auto max-w-[1500px] space-y-6">

          {/* ================= PROFILE HERO ================= */}

          <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-blue-900 to-blue-600">
              <div className="absolute -right-10 -top-28 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
              <div className="absolute bottom-[-120px] left-[45%] h-72 w-72 rounded-full bg-indigo-300/15 blur-3xl" />
              <div className="absolute right-8 top-8 hidden h-28 w-28 rounded-full border border-white/10 sm:block" />

              <div className="relative flex flex-col gap-7 px-6 pb-8 pt-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-9">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="relative shrink-0 self-start sm:self-auto">
                    <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-blue-100 shadow-2xl sm:h-32 sm:w-32">
                      {selectedImage ? (
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Profile Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : user.profileImage ? (
                        <img
                          src={`${BACKEND_URL}${user.profileImage}`}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-blue-100 text-5xl font-black text-blue-700">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-white bg-emerald-500" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="break-words text-3xl font-black tracking-tight text-white sm:text-4xl">
                        {user.name}
                      </h2>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-indigo-700 shadow-sm">
                        {user.role || "User"}
                      </span>
                    </div>

                    <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium text-white/90">
                      <HiOutlineEnvelope size={18} />
                      <span className="break-all">{user.email}</span>
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                        {user.designation || "Team Member"}
                      </span>
                      <span className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                        {user.department || "Organization"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-lg transition hover:bg-slate-50">
                    <HiOutlineCamera size={19} />
                    {uploadingImage
                      ? "Uploading..."
                      : user.profileImage
                        ? "Change Photo"
                        : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImage}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setSelectedImage(file);
                      }}
                    />
                  </label>

                  {selectedImage && (
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={uploadingImage}
                      className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg transition hover:bg-cyan-300 disabled:opacity-50"
                    >
                      {uploadingImage ? "Uploading..." : "Upload Photo"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ================= PROFILE SUMMARY ================= */}
            <div className="grid grid-cols-1 divide-y divide-slate-200 bg-white sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
              <SummaryItem
                icon={<HiOutlineBuildingOffice2 size={21} />}
                label="Organization"
                value={user.tenantId?.companyName || "All Tenants"}
                iconStyle="bg-blue-50 text-blue-600"
              />
              <SummaryItem
                icon={<HiOutlineShieldCheck size={21} />}
                label="Role"
                value={user.role || "User"}
                iconStyle="bg-indigo-50 text-indigo-600"
              />
              <SummaryItem
                icon={<HiOutlineBriefcase size={21} />}
                label="Department"
                value={user.department || "Not provided"}
                iconStyle="bg-violet-50 text-violet-600"
              />
              <SummaryItem
                icon={<HiOutlineCheckCircle size={21} />}
                label="Account Status"
                value={user.status || "Active"}
                valueStyle="text-emerald-600"
                iconStyle="bg-emerald-50 text-emerald-600"
              />
            </div>
          </section>

          {/* ================= MAIN CONTENT ================= */}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

            {/* PERSONAL INFORMATION */}
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[2px] text-blue-600">
                    Account Details
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-slate-900">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your account and organization information.
                  </p>
                </div>

                {!editing && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                  >
                    <HiOutlinePencilSquare size={18} />
                    Edit Profile
                  </button>
                )}
              </div>

              {!editing ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                  <InfoCard icon={<HiOutlineIdentification size={22} />} label="Employee ID" value={user.employeeId || "Not provided"} iconStyle="bg-blue-50 text-blue-600" />
                  <InfoCard icon={<HiOutlineEnvelope size={22} />} label="Email" value={user.email || "Not provided"} iconStyle="bg-indigo-50 text-indigo-600" />
                  <InfoCard icon={<HiOutlinePhone size={22} />} label="Phone" value={user.phone || "Not provided"} iconStyle="bg-emerald-50 text-emerald-600" />
                  <InfoCard icon={<HiOutlineBuildingOffice2 size={22} />} label="Department" value={user.department || "Not provided"} iconStyle="bg-orange-50 text-orange-600" />
                  <InfoCard icon={<HiOutlineBriefcase size={22} />} label="Designation" value={user.designation || "Not provided"} iconStyle="bg-violet-50 text-violet-600" />
                  <InfoCard icon={<HiOutlineShieldCheck size={22} />} label="Role" value={user.role || "User"} iconStyle="bg-indigo-50 text-indigo-600" />
                  <InfoCard icon={<HiOutlineBuildingOffice2 size={22} />} label="Organization" value={user.tenantId?.companyName || "All Tenants"} iconStyle="bg-cyan-50 text-cyan-600" />
                  <InfoCard icon={<HiOutlineCheckCircle size={22} />} label="Status" value={user.status || "Active"} valueStyle="text-emerald-600" iconStyle="bg-emerald-50 text-emerald-600" />
                </div>
              ) : (
                <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormInput label="Employee ID" value={user.employeeId || ""} onChange={(e) => setUser({ ...user, employeeId: e.target.value })} />
                  <FormInput label="Full Name" value={user.name || ""} required onChange={(e) => setUser({ ...user, name: e.target.value })} />
                  <FormInput label="Email" type="email" value={user.email || ""} required onChange={(e) => setUser({ ...user, email: e.target.value })} />
                  <FormInput label="Phone" value={user.phone || ""} onChange={(e) => setUser({ ...user, phone: e.target.value })} />
                  <FormInput label="Department" value={user.department || ""} onChange={(e) => setUser({ ...user, department: e.target.value })} />
                  <FormInput label="Designation" value={user.designation || ""} onChange={(e) => setUser({ ...user, designation: e.target.value })} />

                  <div className="flex justify-end gap-3 md:col-span-2">
                    <button type="button" onClick={() => setEditing(false)} className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50">
                      Cancel
                    </button>
                    <button type="submit" disabled={savingProfile} className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50">
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* SECURITY / QUICK SUMMARY */}
            <aside className="space-y-6">
              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <HiOutlineLockClosed size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[2px] text-blue-600">Security</p>
                    <h2 className="mt-1 text-xl font-black text-slate-900">Account Security</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Keep your account protected with a strong password.</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Password</p>
                      <p className="mt-1 text-xs text-slate-500">Your password is protected.</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-emerald-600 shadow-sm">
                      Protected
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowChangePassword((prev) => !prev)}
                  className="mt-4 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/40"
                >
                  <span>{showChangePassword ? "Hide password form" : "Change password"}</span>
                  <span className="text-xl text-slate-400">{showChangePassword ? "−" : "+"}</span>
                </button>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <HiOutlineIdentification size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Account Overview</h3>
                    <p className="text-sm text-slate-500">Quick account information</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <OverviewRow label="Employee ID" value={user.employeeId || "Not provided"} />
                  <OverviewRow label="Designation" value={user.designation || "Not provided"} />
                  <OverviewRow label="Organization" value={user.tenantId?.companyName || "All Tenants"} />
                  <OverviewRow label="Status" value={user.status || "Active"} valueStyle="text-emerald-600" />
                </div>
              </section>
            </aside>
          </div>

          {/* ================= PASSWORD FORM ================= */}

          {showChangePassword && (
            <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <HiOutlineLockClosed size={21} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Change Password</h3>
                    <p className="text-sm text-slate-500">Update your password securely.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <form onSubmit={handleChangePassword}>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <PasswordInput label="Current Password" value={currentPassword} show={showCurrentPassword} setShow={setShowCurrentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" />
                    <PasswordInput label="New Password" value={newPassword} show={showNewPassword} setShow={setShowNewPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
                    <PasswordInput label="Confirm Password" value={confirmPassword} show={showConfirmPassword} setShow={setShowConfirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
                  </div>

                  <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-600">
                    Your current password will be verified before the new password is saved.
                  </div>

                  <div className="mt-6 flex flex-wrap justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowChangePassword(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setShowCurrentPassword(false);
                        setShowNewPassword(false);
                        setShowConfirmPassword(false);
                        setError("");
                      }}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button type="submit" disabled={changingPassword} className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50">
                      {changingPassword ? "Changing..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}


/* =========================================================
   PROFILE SUMMARY ITEM
========================================================= */

function SummaryItem({
  icon,
  label,
  value,
  iconStyle,
  valueStyle = "text-slate-900",
}) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 sm:px-5 lg:px-6">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">{label}</p>
        <p className={`mt-1 truncate text-sm font-bold ${valueStyle}`} title={value}>{value}</p>
      </div>
    </div>
  );
}


/* =========================================================
   OVERVIEW ROW
========================================================= */

function OverviewRow({
  label,
  value,
  valueStyle = "text-slate-800",
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <span className={`max-w-[58%] truncate text-right text-sm font-bold ${valueStyle}`} title={value}>{value}</span>
    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  icon,
  label,
  value,
  iconStyle,
  valueStyle = "text-slate-800",
}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-white hover:shadow-md">

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 break-words font-semibold ${valueStyle}`}
      >
        {value}
      </p>

    </div>

  );

}


/* =========================================================
   FORM INPUT
========================================================= */

function FormInput({
  label,
  type = "text",
  value,
  onChange,
  required = false,
}) {

  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
      />

    </div>

  );

}


/* =========================================================
   PASSWORD INPUT
========================================================= */

function PasswordInput({
  label,
  value,
  show,
  setShow,
  onChange,
  placeholder,
}) {

  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <input
          type={
            show
              ? "text"
              : "password"
          }
          value={value}
          onChange={onChange}
          required
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />


        <button
          type="button"
          onClick={() =>
            setShow(
              (prev) => !prev
            )
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
        >

          {show ? (
            <HiEyeOff size={20} />
          ) : (
            <HiEye size={20} />
          )}

        </button>

      </div>

    </div>

  );

}


export default Profile;