import React from "react";
import { NavLink } from "react-router-dom";
import style from "./style.module.css";

const Navbar = () => {
  return (
    <div className={style.nav}>
      <div className={style.navCon}>
        <NavLink to='/dashboard' style={{ textDecoration: "none" }}>
          <p className={style.paranv}>Dashboard</p>
        </NavLink>
        <NavLink to='/webinar' style={{ textDecoration: "none" }}>
          <p className={style.paranv}>Webinar</p>
        </NavLink>
        <NavLink to='/create-deal' style={{ textDecoration: "none" }}>
          <p className={style.paranv}>Create Deal</p>
        </NavLink>
        <NavLink to='/pptTemplate' style={{ textDecoration: "none" }}>
          <p className={style.paranv}>Upload PPT Templates</p>
        </NavLink>
        <NavLink to='/update-mentor' style={{ textDecoration: "none" }}>
          <p className={style.paranv}>Update mentor details</p>
        </NavLink>
        <NavLink to='/view-mentors' style={{ textDecoration: "none" }}>
          <p className={style.paranv}>View all mentors</p>
        </NavLink>
        <NavLink to='/documentTemplate' style={{ textDecoration: "none" }}>
          <p className={style.paranv}>Upload Document Templates</p>
        </NavLink>
        <NavLink to='/contact2' style={{ textDecoration: "none" }}>
          <p className={style.paranv}>WhatsApp CRM</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
