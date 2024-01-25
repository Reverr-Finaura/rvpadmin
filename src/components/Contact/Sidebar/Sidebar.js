import React, { useState } from "react";
import style from "./Sidebar.module.css";
import signleUserIcon from "../../../utils/Image/Sidebar/SingleUser.png";
import signleUserActiveIcon from "../../../utils/Image/Sidebar/SingleUserActive.png";
import signleTemplateIcon from "../../../utils/Image/Sidebar/singleTemplate.png";
import signleTemplateActiveIcon from "../../../utils/Image/Sidebar/singleTemplateActive.png";
import multiplyUserIcon from "../../../utils/Image/Sidebar/2 User.png";
import multiplyUserActiveIcon from "../../../utils/Image/Sidebar/2 UserActive.png";
import multiplyTemplateIcon from "../../../utils/Image/Sidebar/multiplyTemplate.png";
import multiplyTemplateActiveIcon from "../../../utils/Image/Sidebar/multiplyTemplateActive.png";
import addUserIcon from "../../../utils/Image/Sidebar/adduser.png";
import addUserActiveIcon from "../../../utils/Image/Sidebar/adduserActive.png";
import addCSVUserIcon from "../../../utils/Image/Sidebar/addCSVuser.png";
import addCSVUserActiveIcon from "../../../utils/Image/Sidebar/addCSVuserActive.png";
import editUserIcon from "../../../utils/Image/Sidebar/edituser.png";
import editUserActiveIcon from "../../../utils/Image/Sidebar/edituserActive.png";
import createUserAgentIcon from "../../../utils/Image/Sidebar/createagent.png";
import createUserAgentActiveIcon from "../../../utils/Image/Sidebar/createagentActive.png";
import manageAgentIcon from "../../../utils/Image/Sidebar/manageAgent.png";
import manageAgentActiveIcon from "../../../utils/Image/Sidebar/manageAgentActive.png";
import feedbackIcon from "../../../utils/Image/Sidebar/feedback.png";
import feedbackActiveIcon from "../../../utils/Image/Sidebar/feedbackActive.png";
import chatIcon from "../../../utils/Image/Sidebar/Chat.png";
import chatActiveIcon from "../../../utils/Image/Sidebar/ChatActive.png";
import menu from "../../../utils/Image/Sidebar/Menu.png";
import logoutIcon from "../../../utils/Image/Logout.png";
import { useSelector } from "react-redux";

const sideBarList = [
  {
    section: 1,
    icon: signleUserIcon,
    name: "Message To Single User",
    activeIcon: signleUserActiveIcon,
  },
  {
    section: 2,
    icon: multiplyUserIcon,
    name: "Message To Multiple Users",
    activeIcon: multiplyUserActiveIcon,
  },
  {
    section: 3,
    icon: signleTemplateIcon,
    name: "Template To Single User",
    activeIcon: signleTemplateActiveIcon,
  },
  {
    section: 4,
    icon: multiplyTemplateIcon,
    name: "Template To Multiple Users ",
    activeIcon: multiplyTemplateActiveIcon,
  },
  {
    section: 7,
    icon: chatIcon,
    name: "Chat With User",
    activeIcon: chatActiveIcon,
  },
  {
    section: 5,
    icon: addUserIcon,
    name: "Add User",
    activeIcon: addUserActiveIcon,
  },
  {
    section: 6,
    icon: addCSVUserIcon,
    name: "Add CSV User",
    activeIcon: addCSVUserActiveIcon,
  },
  {
    section: 8,
    icon: editUserIcon,
    name: "Edit User",
    activeIcon: editUserActiveIcon,
  },
  {
    section: 9,
    icon: createUserAgentIcon,
    name: "Create Agent ",
    activeIcon: createUserAgentActiveIcon,
  },
  {
    section: 10,
    icon: manageAgentIcon,
    name: "Manage Agent",
    activeIcon: manageAgentActiveIcon,
  },
  {
    section: 11,
    icon: feedbackIcon,
    name: "Feedback",
    activeIcon: feedbackActiveIcon,
  },
];

const Sidebar = ({
  section,
  setSection,
  handleAdminLogout,
  handleAgentLogout,
}) => {
  const user = useSelector((state) => state.user.user);
  const [sideBarOpen, setSidebarOpen] = useState(true);
  return (
    <div
      className={style.sideBarWrapper}
      style={{
        width: `${sideBarOpen ? "88px" : "296px"}`,
        padding: `${sideBarOpen ? "14px 22px" : "14px 28px"}`,
      }}
    >
      <div className={style.sidebarMenuContainer}>
        <div
          className={style.sideBarMenuItemfalse}
          onClick={() => setSidebarOpen(!sideBarOpen)}
        >
          <div className={style.sidebarContant}>
            <img src={menu} alt={"handle"} />
          </div>
        </div>
        {sideBarOpen ? (
          <>
            {sideBarList.map((sideBar) => {
              return (
                <div
                  key={sideBar.section}
                  className={style.sideBarMenuItemtrue}
                  onClick={() => setSection(sideBar.section)}
                  style={{
                    backgroundColor: `${
                      section === sideBar.section ? "#5570F1 " : ""
                    }`,
                  }}
                >
                  <div className={style.sidebarContant}>
                    <img
                      src={
                        section === sideBar.section
                          ? sideBar.activeIcon
                          : sideBar.icon
                      }
                      alt={sideBar.name}
                    />
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <>
            {sideBarList.map((sideBar) => {
              return (
                <div
                  key={sideBar.section}
                  className={style.sideBarMenuItemfalse}
                  onClick={() => setSection(sideBar.section)}
                  style={{
                    backgroundColor: `${
                      section === sideBar.section ? "#5570F1 " : ""
                    }`,
                  }}
                >
                  <div className={style.sidebarContant}>
                    <img
                      src={
                        section === sideBar.section
                          ? sideBar.activeIcon
                          : sideBar.icon
                      }
                      alt={sideBar.name}
                    />
                    <p
                      style={{
                        color: `${
                          section === sideBar.section ? "#fff" : "#53545C"
                        }`,
                      }}
                    >
                      {sideBar.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
      <div>
        {sideBarOpen ? (
          <div
            className={style.sideBarMenuItemtrue}
            onClick={() => {
              user.isAdmin ? handleAdminLogout() : handleAgentLogout();
            }}
          >
            <div className={style.sidebarContant}>
              <img src={logoutIcon} alt={"handle"} />
            </div>
          </div>
        ) : (
          <div
            className={style.sideBarMenuItemfalse}
            onClick={() => {
              user.isAdmin ? handleAdminLogout() : handleAgentLogout();
            }}
          >
            <div className={style.sidebarContant}>
              <img src={logoutIcon} alt={"logout"} />
              <p
                style={{
                  color: "var(--Action-Red, #CC5F5F)",
                  fontSize: "12px",
                }}
              >
                Logout
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
