import React, { useEffect, useState } from "react";
import style from "../NewContactComponents/style.module.css";
import { useSelector } from "react-redux";
import { Box, IconButton } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { IoIosNotifications } from "react-icons/io";
import NotificationSection from "./NotificationSection";
import { database } from "../../firebase/firebase";

const CommonNav = ({ handleLogout }) => {
  const user = useSelector((state) => state.user.user);
  console.log(user);
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
    if (user && user.isAgent) {
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
    }
  }, [user]);

  return (
    <div className={style.nav}>
      <div className={style.navCon} style={{ justifyContent: "space-between" }}>
        <h3>Hi Agent {user.email.split("@")[0]}</h3>
        <div style={{ display: "flex", gap: "20px" }}>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{ p: 0 }}
              style={{ width: "fit-content", position: "relative" }}
            >
              <IoIosNotifications />{" "}
              <span
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "16px",
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
            />
          </Box>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default CommonNav;
