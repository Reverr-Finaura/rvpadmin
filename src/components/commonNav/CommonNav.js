import React from "react";
import "./CommonNav.css"; // Import the CSS file

const CommonNav = ({ userName, handleLogout }) => {
  // console.log(userName);
  return (
    <div className="navContainer">
      {" "}
      {/* Use className for classes in React */}
      {userName && <p>Welcome {userName}</p>}
      <button className="logoutButton" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default CommonNav;
