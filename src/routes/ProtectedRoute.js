import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const AdminProtectRoutes = ({ children }) => {
  const user = useSelector((state) => state.user);
  if (user) {
    const admin = user.user.isAdmin;
    return admin ? children : <Navigate to='/' />;
  }
};

export const AgentProtectRoutes = ({ children }) => {
  const user = useSelector((state) => state.user);
  if (user) {
    const admin = user.user.isAdmin || user.user.isAgent;
    return admin ? children : <Navigate to='/' />;
  }
};
