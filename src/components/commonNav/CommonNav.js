import React, { useState } from "react";
import style from "../NewContactComponents/style.module.css";
import Notication from "../NewContactComponents/Notication";

const CommonNav = ({ handleLogout }) => {
  // console.log(userName);
  const [shownotification, setShowNotifications] = useState(false);
  return (
    <div className={style.nav}>
      <div className={style.navCon}>
        <button
          className={style.notification}
          onClick={() => setShowNotifications(!shownotification)}
        >
          Notification
          {shownotification && (
            <Notication
              handleClose={() => setShowNotifications(!shownotification)}
            />
          )}
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default CommonNav;
