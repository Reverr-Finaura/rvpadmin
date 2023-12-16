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
          Chat with User
        </p>
        <p
          onClick={() => setSection(9)}
          style={{
            backgroundColor: `${section === 9 ? "green " : ""}`,
          }}
          className={style.optionitem}
        >
          Edit User
        </p>
        <p
          onClick={() => setSection(10)}
          style={{
            backgroundColor: `${section === 10 ? "green " : ""}`,
          }}
          className={style.optionitem}
        >
          Add Agent
        </p>
        <p
          onClick={() => setSection(11)}
          style={{
            backgroundColor: `${section === 11 ? "green " : ""}`,
          }}
          className={style.optionitem}
        >
          Manage Agents
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
