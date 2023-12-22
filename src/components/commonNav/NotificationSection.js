import { Menu, MenuItem } from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useCallback, useEffect } from "react";
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
  const fetchNotifications = useCallback(async () => {
    try {
      const notfidoc = await getDoc(doc(database, "Agents", user.email));
      if (notfidoc.exists()) {
        const notifications = notfidoc.data().notification;
        for (const notification of notifications) {
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
  }, [setUnreadCount, user.email]);

  useEffect(() => {
    if (anchorElUser) {
      fetchNotifications();
    }
  }, [anchorElUser, fetchNotifications]);

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
        {notifydata.reverse().map((setting, index) => {
          const date = new Date(
            setting.timestamp.seconds * 1000 +
              setting.timestamp.nanoseconds / 1e6
          ).toString();
          return (
            <MenuItem
              key={index}
              style={{
                width: "100%",
                backgroundColor: "rgba(255, 255, 0, 0.05)",
              }}
              className={style.notifybox}
            >
              <p className={style.info} style={{ fontSize: "14px", margin: 0 }}>
                {setting.text}
                <br />
                {/* <a
                  href={setting.path}
                  target='_blank'
                  style={{ fontSize: "10px", color: "green", margin: 0 }}
                  rel='noreferrer'
                >
                  Go to Chat
                </a> */}
              </p>

              <p
                className={style.info}
                style={{ fontSize: "12px", color: "green", margin: 0 }}
              >
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
