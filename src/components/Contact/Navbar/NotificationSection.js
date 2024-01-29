import { Menu, MenuItem } from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import { database } from "../../../firebase/firebase";
import style from "./Navbar.module.css";
import close from "../../../utils/Image/Close.png";

const NotificationSection = ({
  anchorElUser,
  handleCloseUserMenu,
  notifydata,
  setUnreadCount,
  setNotifyData,
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

  const deleteNotifications = async (index) => {
    try {
      const newNotifications = notifydata.filter(
        (notification, i) => i !== index
      );
      await updateDoc(doc(database, "Agents", user.email), {
        notification: newNotifications.reverse(),
      });
      setNotifyData(newNotifications);
    } catch (error) {
      console.error("An error occurred while updating the document:", error);
    }
  };

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
        <h3>Notification</h3>
        <img src={close} onClick={handleCloseUserMenu} alt='close' />
      </div>
      <div className={style.notificationlist}>
        {notifydata.reverse().map((setting, index) => {
          const date = new Date(
            setting.timestamp.seconds * 1000 +
              setting.timestamp.nanoseconds / 1e6
          ).toString();
          const goChat = {
            chatnumber: setting.number,
            section: 7,
          };
          return (
            <MenuItem key={index} className={style.notifybox}>
              <Link
                to='/contact'
                state={goChat}
                className={style.content}
                style={{ textDecoration: "none", margin: 0 }}
              >
                <p className={style.info}>{setting.text}</p>
                <p className={style.date}>{moment(date).format("LLL")}</p>
              </Link>
              <div className={style.cross}>
                <img
                  src={close}
                  onClick={() => deleteNotifications(index)}
                  alt='close'
                />
              </div>
            </MenuItem>
          );
        })}
      </div>
    </Menu>
  );
};

export default NotificationSection;
