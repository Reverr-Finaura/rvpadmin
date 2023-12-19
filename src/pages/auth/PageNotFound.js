import React from "react";
import { useNavigate } from "react-router-dom";
import "./PageNotFound.css";

const PageNotFound = () => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate("/");
  };
  return (
    <div className="new-container">
      <h1>Page Not Found!!</h1>
      <button onClick={handleBackClick} className="back-btn">
        <a href="/">Back</a>
      </button>
    </div>
  );
};

export default PageNotFound;
