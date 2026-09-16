import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();

  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRoleAccess, setHasRoleAccess] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      // =====================================================
      // AUTHENTICATION CHECK
      // =====================================================

      if (token && token.trim() !== "") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setHasRoleAccess(false);
        setIsChecking(false);
        return;
      }

      // =====================================================
      // ROLE CHECK
      // =====================================================

      if (allowedRoles.length === 0) {
        setHasRoleAccess(true);
      } else {
        try {
          const user = JSON.parse(storedUser || "{}");

          const userRole = user.role;

          setHasRoleAccess(
            allowedRoles.includes(userRole)
          );
        } catch (error) {
          console.error(
            "Unable to read user role:",
            error
          );

          setHasRoleAccess(false);
        }
      }

      setIsChecking(false);
    };

    checkAuth();

    // Check again when Chrome restores a page
    // with Back/Forward
    window.addEventListener("pageshow", checkAuth);

    return () => {
      window.removeEventListener("pageshow", checkAuth);
    };
  }, [allowedRoles]);

  // =====================================================
  // CHECKING
  // =====================================================

  if (isChecking) {
    return null;
  }

  // =====================================================
  // NOT AUTHENTICATED
  // =====================================================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // =====================================================
  // AUTHENTICATED BUT WRONG ROLE
  // =====================================================

  if (!hasRoleAccess) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // =====================================================
  // ACCESS GRANTED
  // =====================================================

  return children;
}

export default ProtectedRoute;