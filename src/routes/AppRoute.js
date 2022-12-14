import SignIn from "../pages/auth/SignIn";
import CreateDeal from "../pages/createDeal/CreateDeal";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

const { Routes, Route } = require("react-router-dom");

const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-deal"
        element={
          <ProtectedRoute>
            <CreateDeal />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoute;
