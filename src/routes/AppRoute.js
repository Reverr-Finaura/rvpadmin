import SignIn from "../pages/auth/SignIn";
import Contact from "../pages/contact/Contact";
import CreateDeal from "../pages/createDeal/CreateDeal";
import Dashboard from "../pages/dashboard/Dashboard";
import Mentor from "../pages/mentordetails/Mentor";
import ViewMentors from "../pages/mentordetails/ViewMentors";
import UploadBlogs from "../pages/Upload Blogs/UploadBlogs";
import UploadDocument from "../pages/Upload Document/UploadDocument";
import UploadPPT from "../pages/Upload PPT/UploadPPT";
import Webinar from "../pages/webinar/Webinar";
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
        path="/update-mentor"
        element={
          <ProtectedRoute>
            <Mentor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/view-mentors"
        element={
          <ProtectedRoute>
            <ViewMentors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/webinar"
        element={
          <ProtectedRoute>
            <Webinar />
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
      <Route
        path="/pptTemplate"
        element={
          <ProtectedRoute>
            <UploadPPT />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documentTemplate"
        element={
          <ProtectedRoute>
            <UploadDocument />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/uploadBlogs"
        element={
          <ProtectedRoute>
            <UploadBlogs />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        }
      ></Route>
    </Routes>
  );
};

export default AppRoute;
