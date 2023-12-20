import { Menu, MenuItem } from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { database } from "../../firebase/firebase";
import { useSelector } from "react-redux";
import style from "../NewContactComponents/style.module.css";
import moment from "moment";

const NotificationSection = ({
  anchorElUser,
  handleCloseUserMenu,
  notifydata,
  setUnreadCount,
}) => {
  const user = useSelector((state) => state.user.user);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notfidoc = await getDoc(doc(database, "Agents", user.email));
        if (notfidoc.exists()) {
          const notifications = notfidoc.data().notification;
          for (const notification of notifications) {
            console.log(notification);
            if (notification.read === false) {
              await updateDoc(doc(database, "Agents", user.email), {
                notification: notifications.map((n, index) =>
                  n[index] === notification[index] ? { ...n, read: true } : n
                ),
              });
            }
          }
          setUnreadCount(0);
        }
      } catch (error) {
        console.error("An error occurred while fetching the document:", error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <Menu
      sx={{ mt: "45px", p: "20px" }}
      id='menu-appbar'
      anchorEl={anchorElUser}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorElUser)}
      onClose={handleCloseUserMenu}
      className={style.notificationbox}
    >
      <div className={style.notificationheader}>
        <h2>Notification</h2>
        <button onClick={handleCloseUserMenu}>Close</button>
      </div>
      <div className={style.notificationlist}>
        {notifydata.map((setting, index) => {
          const date = new Date(
            setting.timestamp.seconds * 1000 +
              setting.timestamp.nanoseconds / 1e6
          ).toString();
          return (
            <MenuItem
              key={index}
              style={{ width: "100%" }}
              className={style.notifybox}
            >
              <p className={style.info}>{setting.text}</p>
              <p className={style.info} style={{ fontSize: "12px" }}>
                {moment(date).format("LLL")}
              </p>
            </MenuItem>
          );
        })}
      </div>
    </Menu>
  );
};

export default NotificationSection;
