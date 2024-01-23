import React from "react";
import logo from "../../../utils/Image/Logo.png";
import logoutIcon from "../../../utils/Image/Logout.png";
import notification from "../../../utils/Image/notification.png";
import style from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const navBarlist = [
  { link: "/dashboard", name: "Dashboard" },
  { link: "/webinar", name: "Webinar" },
  { link: "/create-deal", name: "Create Deal" },
  { link: "/pptTemplate", name: "Upload PPT Templates" },
  { link: "/update-mentor", name: "Update mentor details" },
  { link: "/view-mentors", name: "View all mentors" },
  { link: "/documentTemplate", name: "Upload Document Templates" },
  { link: "/designContact", name: "WhatsApp CRM" },
];
const Navbar = ({ handleAdminLogout, handleAgentLogout }) => {
  const user = useSelector((state) => state.user.user);
  return (
    <div className={style.navbarWrapper}>
      <div className={style.navbarContainer}>
        <div className={style.navbarLogo}>
          <img src={logo} alt='logo' />
        </div>
        <div className={style.navMenu}>
          {navBarlist.map((navBar, indexedDB) => {
            return (
              <NavLink
                to={navBar.link}
                style={{ textDecoration: "none" }}
                key={indexedDB}
              >
                <p className={style.navMenuName}>{navBar.name}</p>
              </NavLink>
            );
          })}
        </div>
        <div className={style.navbarProfile}>
          <div className={style.notificationsection}>
            <img
              src={notification}
              alt='notification'
              className={style.notification}
            />
          </div>
          <div className={style.vertical}></div>
          <div className={style.notificationsection}>
            <img
              src={logoutIcon}
              alt='profile'
              className={style.notification}
              style={{ backgroundColor: "transparent" }}
              onClick={() => {
                user.isAdmin ? handleAdminLogout() : handleAgentLogout();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
