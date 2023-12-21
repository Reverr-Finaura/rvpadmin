import React, { useState, useEffect } from "react";
import Navbar from "../../components/NewContactComponents/Navbar";
import style from "./newcontact.module.css";
import Sidebar from "../../components/NewContactComponents/Sidebar";
import MsgToUser from "../../components/contactComponent/MsgToUser";
import MsgtoUsers from "../../components/contactComponent/MsgtoUsers";
import TempToUser from "../../components/contactComponent/TempToUser";
import TemptoUsers from "../../components/contactComponent/TemptoUsers";
import AddUser from "../../components/contactComponent/AddUser";
import CSVAdduser from "../../components/contactComponent/CsvAdduser";
import NewChatSection from "../../components/contactComponent/NewChatSection";
import EditUser from "../../components/contactComponent/EditUser";
import AddAgent from "../../components/contactComponent/AddAgent";
import ManageAgent from "../../components/contactComponent/ManageAgent";
import { useLocation } from "react-router-dom";
import CommonNav from "../../components/commonNav/CommonNav";
import { logout } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NewContact = () => {
  const [section, setSection] = useState(1);
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAgentLogout = () => {
    dispatch(logout());
    navigate("/agentSignIn");
  };

  const handleAdminLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      {user.isAgent && <CommonNav handleLogout={handleAgentLogout} />}
      {user.isAdmin && <Navbar handleLogout={handleAdminLogout} />}
      <div className={style.main}>
        <div className={style.left}>
          <Sidebar section={section} setSection={setSection} />
        </div>
        <div className={style.right}>
          {section === 1 && <MsgToUser />}
          {section === 2 && <MsgtoUsers />}
          {section === 3 && <TempToUser />}
          {section === 4 && <TemptoUsers />}
          {section === 6 && <AddUser />}
          {section === 7 && <CSVAdduser />}
          {section === 8 && <NewChatSection />}
          {section === 9 && <EditUser />}
          {section === 10 && <AddAgent />}
          {section === 11 && <ManageAgent />}
        </div>
      </div>
    </>
  );
};

export default NewContact;
