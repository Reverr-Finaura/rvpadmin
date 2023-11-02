import React from "react";
import style from "./style.module.css";

const Sidebar = ({ section, setSection }) => {
  return (
    <div className={style.sidemain}>
      <div className={style.sidemainmenu}>
        <p
          onClick={() => setSection(1)}
          style={{
            backgroundColor: `${section === 1 ? "green " : ""}`,
          }}
          className={style.optionitem}
        >
          Send Msg to single user
        </p>
        <p
          onClick={() => setSection(2)}
          style={{
            backgroundColor: `${section === 2 ? "green " : ""}`,
          }}
          className={style.optionitem}
        >
          Send Msg to Mutiple user
        </p>
        <p
          onClick={() => setSection(3)}
          style={{
            backgroundColor: `${section === 3 ? "green " : ""}`,
          }}
          className={style.optionitem}
        >
          Send template to single user
        </p>
        <p
          onClick={() => setSection(4)}
          style={{
            backgroundColor: `${section === 4 ? "green " : ""}`,
          }}
          className={style.optionitem}
        >
          Send template to Mutiple user
        </p>
        <p
          onClick={() => setSection(5)}
          style={{
            backgroundColor: `${section === 5 ? "green " : ""}`,
          }}
          className={style.optionitem}
        >
          Chat with user
        </p>
        <p
          onClick={() => setSection(6)}
          style={{
            backgroundColor: `${section === 6 ? "green " : ""}`,
          }}
          className={style.optionitem}
        >
          Add user
        </p>
        <p
          onClick={() => setSection(7)}
          style={{
            backgroundColor: `${section === 7 ? "green " : ""}`,
          }}
          className={style.optionitem}
        >
          CSV Add user
        </p>
        <p
          onClick={() => setSection(8)}
          style={{
            backgroundColor: `${section === 8 ? "green " : ""}`,
          }}
          className={style.optionitem}
        >
          New Chat User
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
