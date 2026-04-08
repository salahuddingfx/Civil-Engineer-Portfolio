import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("adminAccessToken");
  if (!token) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}
