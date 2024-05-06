import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProtectedRoute() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token) navigate("/login");
  }, [user?.token, navigate]);

  if (user?.token) return <Outlet />;
}

export default ProtectedRoute;
