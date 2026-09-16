import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  // Already logged in → don't allow Login page
  if (token && token.trim() !== "") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;