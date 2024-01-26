import SignIn from "../pages/auth/SignIn";
import AgentSignIn from "../pages/auth/AgentSignIn";
import CreateDeal from "../pages/createDeal/CreateDeal";
import Dashboard from "../pages/dashboard/Dashboard";
import Mentor from "../pages/mentordetails/Mentor";
import ViewMentors from "../pages/mentordetails/ViewMentors";
import UploadBlogs from "../pages/Upload Blogs/UploadBlogs";
import UploadDocument from "../pages/Upload Document/UploadDocument";
import UploadPPT from "../pages/Upload PPT/UploadPPT";
import Webinar from "../pages/webinar/Webinar";
import { Navigate } from "react-router-dom";
import { AdminProtectRoutes, AgentProtectRoutes } from "./ProtectedRoute";
import Contact from "../pages/Contact/Contact";

const { Routes, Route } = require("react-router-dom");

const AppRoute = () => {
  return (
    <Routes>
      <Route path='/' element={<SignIn />} />
      <Route path='/agentSignIn' element={<AgentSignIn />} />
      <Route
        path='/dashboard'
        element={
          <AdminProtectRoutes>
            <Dashboard />
          </AdminProtectRoutes>
        }
      />
      <Route
        path='/update-mentor'
        element={
          <AdminProtectRoutes>
            <Mentor />
          </AdminProtectRoutes>
        }
      />
      <Route
        path='/view-mentors'
        element={
          <AdminProtectRoutes>
            <ViewMentors />
          </AdminProtectRoutes>
        }
      />
      <Route
        path='/webinar'
        element={
          <AdminProtectRoutes>
            <Webinar />
          </AdminProtectRoutes>
        }
      />
      <Route
        path='/create-deal'
        element={
          <AdminProtectRoutes>
            <CreateDeal />
          </AdminProtectRoutes>
        }
      />
      <Route
        path='/pptTemplate'
        element={
          <AdminProtectRoutes>
            <UploadPPT />
          </AdminProtectRoutes>
        }
      />
      <Route
        path='/documentTemplate'
        element={
          <AdminProtectRoutes>
            <UploadDocument />
          </AdminProtectRoutes>
        }
      ></Route>
      <Route
        path='/uploadBlogs'
        element={
          <AdminProtectRoutes>
            <UploadBlogs />
          </AdminProtectRoutes>
        }
      ></Route>
      <Route
        path='/contact'
        element={
          <AgentProtectRoutes>
            <Contact />
          </AgentProtectRoutes>
        }
      ></Route>
      <Route
        path='*'
        element={
          <AgentProtectRoutes>
            <Navigate to='/' />
          </AgentProtectRoutes>
        }
      />
    </Routes>
  );
};

export default AppRoute;
