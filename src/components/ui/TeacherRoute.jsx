// src/components/ui/TeacherRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function TeacherRoute({ children }) {
  const { user } = useAuth();

  // Si no está loggeado → fuera
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si NO es teacher → fuera
  if (user.role !== "teacher") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
