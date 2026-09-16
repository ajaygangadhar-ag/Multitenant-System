import { Routes, Route, Navigate } from "react-router-dom";

import PublicRoute from "./components/PublicRoute";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Users from "./pages/Users/Users";
import Tenants from "./pages/Tenants/Tenants";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import ActivityLogs from "./pages/ActivityLogs/ActivityLogs";

import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import SuperAdminRegister from "./pages/SuperAdminRegister/SuperAdminRegister";

import ProtectedRoute from "./components/ProtectedRoute";


// =====================================================
// SUPERADMIN ONLY ROUTE
// =====================================================

function SuperAdminRoute({ children }) {
  const token = localStorage.getItem("token");

  // No token → go to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    // Get JWT payload
    const payload = JSON.parse(
      atob(
        token
          .split(".")[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    // Only SuperAdmin can access
    if (payload.role !== "SuperAdmin") {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  } catch (error) {
    console.error("Invalid token:", error);

    localStorage.removeItem("token");

    return <Navigate to="/" replace />;
  }
}


// =====================================================
// APP
// =====================================================

function App() {
  return (
    <Routes>

      {/* =================================================
          LOGIN
      ================================================= */}

      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />


      {/* =================================================
          SUPERADMIN REGISTRATION
      ================================================= */}

      <Route
        path="/superadmin-register"
        element={
          <PublicRoute>
            <SuperAdminRegister />
          </PublicRoute>
        }
      />


      {/* =================================================
          FORGOT PASSWORD
      ================================================= */}

      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />


      {/* =================================================
          RESET PASSWORD
      ================================================= */}

      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />


      {/* =================================================
          ORGANIZATION REGISTRATION
      ================================================= */}

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />


      {/* =================================================
          DASHBOARD
      ================================================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      {/* =================================================
          PROFILE
      ================================================= */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />


      {/* =================================================
          USERS
      ================================================= */}

      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["SuperAdmin", "TenantAdmin"]}>
            <Users />
          </ProtectedRoute>
        }
      />


      {/* =================================================
          TENANTS
          SUPERADMIN ONLY
      ================================================= */}
          
          <Route
            path="/tenants"
            element={
              <ProtectedRoute allowedRoles={["SuperAdmin"]}>
                <Tenants />
              </ProtectedRoute>
            }
          />


      {/* =================================================
          ACTIVITY LOGS
      ================================================= */}

      <Route
        path="/activity-logs"
        element={
          <ProtectedRoute>
            <ActivityLogs />
          </ProtectedRoute>
        }
      />


      {/* =================================================
          SETTINGS
      ================================================= */}

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />


      {/* =================================================
          UNKNOWN URL
      ================================================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;