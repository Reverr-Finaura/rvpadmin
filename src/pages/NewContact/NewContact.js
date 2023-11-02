import React, { useState } from "react";
import Navbar from "../../components/NewContactComponents/Navbar";
import style from "./newcontact.module.css";
import Sidebar from "../../components/NewContactComponents/Sidebar";
import MsgToUser from "../../components/contactComponent/MsgToUser";
import MsgtoUsers from "../../components/contactComponent/MsgtoUsers";
import TempToUser from "../../components/contactComponent/TempToUser";
import TemptoUsers from "../../components/contactComponent/TemptoUsers";
import ChatSection from "../../components/contactComponent/ChatSection";
import AddUser from "../../components/contactComponent/AddUser";
import CSVAdduser from "../../components/contactComponent/CsvAdduser";
import NewChatSection from "../../components/contactComponent/NewChatSection";

const NewContact = () => {
  const [section, setSection] = useState(1);
  return (
    <>
      <Navbar />
      <div className={style.main}>
        <div className={style.left}>
          <Sidebar section={section} setSection={setSection} />
        </div>
        <div className={style.right}>
          {section === 1 && <MsgToUser />}
          {section === 2 && <MsgtoUsers />}
          {section === 3 && <TempToUser />}
          {section === 4 && <TemptoUsers />}
          {section === 5 && <ChatSection />}
          {section === 6 && <AddUser />}
          {section === 7 && <CSVAdduser />}
          {section === 8 && <NewChatSection />}
        </div>
      </div>
    </>
  );
};

export default NewContact;
