import React, { useState } from "react";
import style from "./Sidebar.module.css";
import userIcon from "../../../utils/Image/Sidebar/2 User.png";
import menu from "../../../utils/Image/Sidebar/Menu.png";

const sideBarList = [
  {
    section: 1,
    icon: userIcon,
    name: "Send Message To Single User",
  },
  {
    section: 2,
    icon: userIcon,
    name: "Send Message To Multiple Users",
  },
  {
    section: 3,
    icon: userIcon,
    name: "Send Template To Single User",
  },
  {
    section: 4,
    icon: userIcon,
    name: "Send Template To Multiple Users ",
  },
  {
    section: 7,
    icon: userIcon,
    name: "Chat With User",
  },
  {
    section: 5,
    icon: userIcon,
    name: "Add User",
  },
  {
    section: 6,
    icon: userIcon,
    name: "Add CSV User",
  },
  {
    section: 8,
    icon: userIcon,
    name: "Edit User",
  },
  {
    section: 9,
    icon: userIcon,
    name: "Create Agent ",
  },
  {
    section: 10,
    icon: userIcon,
    name: "Manage Agent",
  },
  {
    section: 11,
    icon: userIcon,
    name: "Feedback",
  },
];

const Sidebar = ({ section, setSection }) => {
  const [sideBarOpen, setSidebarOpen] = useState(true);
  return (
    <div
      className={style.sideBarWrapper}
      style={{
        width: `${sideBarOpen ? "88px" : "296px"}`,
        padding: `${sideBarOpen ? "14px 22px" : "14px 28px"}`,
      }}
    >
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
                  <img src={sideBar.icon} alt={sideBar.name} />
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
                  <img src={sideBar.icon} alt={sideBar.name} />
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
  );
};

export default Sidebar;
