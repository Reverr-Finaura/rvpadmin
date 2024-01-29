import React, { useEffect, useState } from "react";
import logo from "../../../utils/Image/Logo.png";
import notification from "../../../utils/Image/notification.png";
import style from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { database } from "../../../firebase/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Box, IconButton } from "@mui/material";
import NotificationSection from "./NotificationSection";

const navBarlist = [
  { link: "/dashboard", name: "Dashboard" },
  { link: "/webinar", name: "Webinar" },
  { link: "/create-deal", name: "Create Deal" },
  { link: "/pptTemplate", name: "Upload PPT Templates" },
  { link: "/update-mentor", name: "Update mentor details" },
  { link: "/view-mentors", name: "View all mentors" },
  { link: "/documentTemplate", name: "Upload Document Templates" },
  { link: "/contact", name: "WhatsApp CRM" },
];
const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [notifydata, setNotifyData] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const Agentref = collection(database, "Agents");
  useEffect(() => {
    const agentQuery = query(Agentref, where("email", "==", user.email));
    const unsubscribe = onSnapshot(agentQuery, (snapshot) => {
      let tempCount = 0;
      let msgs = [];
      snapshot.forEach((doc) => {
        const notificationData = doc.data().notification;
        if (notificationData) {
          notificationData.forEach((notification) => {
            msgs.push(notification);
            if (!notification.read) {
              tempCount++;
            }
          });
        }
      });
      setNotifyData(msgs);
      setUnreadCount(tempCount);
    });

    return () => unsubscribe();
  }, [Agentref, user]);
  return (
    <div className={style.navbarWrapper}>
      <div className={style.navbarContainer}>
        <div className={style.navbarLogo}>
          <img src={logo} alt='logo' />
        </div>
        {user.isAdmin && (
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
        )}
        <div
          className={style.navbarProfile}
          style={{ visibility: user.isAdmin ? "hidden" : "" }}
        >
          <Box sx={{ flexGrow: 0 }} className={style.notificationsection}>
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{ p: 0 }}
              style={{ width: "fit-content", position: "relative" }}
            >
              <img
                src={notification}
                alt='notification'
                className={style.notification}
              />
              <span
                style={{
                  position: "absolute",
                  fontSize: "14px",
                  top: "5px",
                  left: "35px",
                  color: "red",
                }}
              >
                {unreadCount > 0 ? unreadCount : ""}
              </span>
            </IconButton>
            <NotificationSection
              anchorElUser={anchorElUser}
              handleCloseUserMenu={handleCloseUserMenu}
              notifydata={notifydata}
              setUnreadCount={setUnreadCount}
              setNotifyData={setNotifyData}
            />
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
