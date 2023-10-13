import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./contact.css";
import MsgtoUsers from "../../components/contactComponent/MsgtoUsers";
import MsgToUser from "../../components/contactComponent/MsgToUser";
import TemptoUsers from "../../components/contactComponent/TemptoUsers";
import TempToUser from "../../components/contactComponent/TempToUser";
import ChatSection from "../../components/contactComponent/ChatSection";

const Contact = () => {
  const [section, setSection] = useState(1);
  return (
    <>
      <div className='Contact_MainContainer'>
        <div className='Contact_Container'>
          <div className='L_contact_Container'>
            <h1 style={{ color: "grey" }}>Admin</h1>
            <Link to='/dashboard'>
              <button>Dashboard</button>
            </Link>
            <Link to='/webinar'>
              <button>Webinar</button>
            </Link>
            <Link style={{ marginTop: "1rem" }} to='/create-deal'>
              <button>Create Deal</button>
            </Link>
            <Link style={{ marginTop: "1rem" }} to='/pptTemplate'>
              <button>Upload PPT Templates</button>
            </Link>
            <Link style={{ marginTop: "1rem" }} to='/update-mentor'>
              <button>update mentor details</button>
            </Link>
            <Link style={{ marginTop: "1rem" }} to='/view-mentors'>
              <button>View all mentors</button>
            </Link>
            <Link style={{ marginTop: "1rem" }} to='/documentTemplate'>
              <button>Upload Document Templates</button>
            </Link>
            <Link to='/contact'>
              <button>WhatsApp CRM</button>
            </Link>
          </div>
          <div className='R_contact_Container'>
            <div className='R_contact_button_section'>
              <button
                onClick={() => setSection(1)}
                style={{
                  backgroundColor: `${section === 1 ? "green " : ""}`,
                }}
              >
                Send Msg to single user
              </button>
              <button
                onClick={() => setSection(2)}
                style={{
                  backgroundColor: `${section === 2 ? "green " : ""}`,
                }}
              >
                Send Msg to Mutiple user
              </button>
              <button
                onClick={() => setSection(3)}
                style={{
                  backgroundColor: `${section === 3 ? "green " : ""}`,
                }}
              >
                Send template to single user
              </button>
              <button
                onClick={() => setSection(4)}
                style={{
                  backgroundColor: `${section === 4 ? "green " : ""}`,
                }}
              >
                Send template to Mutiple user
              </button>
              <button
                onClick={() => setSection(5)}
                style={{
                  backgroundColor: `${section === 5 ? "green " : ""}`,
                }}
              >
                Chat with user
              </button>
            </div>
            <div>
              {section === 1 && <MsgToUser />}
              {section === 2 && <MsgtoUsers />}
              {section === 3 && <TempToUser />}
              {section === 4 && <TemptoUsers />}
              {section === 5 && <ChatSection />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
