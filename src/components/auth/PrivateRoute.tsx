
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

interface PrivateRouteProps {
  element: JSX.Element;
  adminOnly?: boolean;
}

const PrivateRoute = ({ element, adminOnly = false }: PrivateRouteProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="loader"></div>
    </div>;
  }

  if (!isAuthenticated) {
    toast.error("Please login to access this page");
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

export default PrivateRoute;
