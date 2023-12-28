import React, { useEffect, useState } from "react";
import Navbar from "../../components/NewContactComponents/Navbar";
import style from "./newcontact.module.css";
import Sidebar from "../../components/NewContactComponents/Sidebar";
import MsgToUser from "../../components/contactComponent/MsgToUser";
import MsgtoUsers from "../../components/contactComponent/MsgtoUsers";
import TempToUser from "../../components/contactComponent/TempToUser";
import TemptoUsers from "../../components/contactComponent/TemptoUsers";
import AddUser from "../../components/contactComponent/AddUser";
import CSVAdduser from "../../components/contactComponent/CsvAdduser";
import NewChatSection from "../../components/contactComponent/NewChatSection";
import EditUser from "../../components/contactComponent/EditUser";
import AddAgent from "../../components/contactComponent/AddAgent";
import ManageAgent from "../../components/contactComponent/ManageAgent";
import CommonNav from "../../components/commonNav/CommonNav";
import { logout } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import {
  database,
  getAllAgents,
  getAllMessage,
  getMessage,
} from "../../firebase/firebase";
import {
  setAdminChats,
  setAgentChats,
  setAllAgent,
  setEditAgentsChats,
} from "../../redux/contactSlice";

const NewContact = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [section, setSection] = useState(1);
  const { state } = useLocation();
  console.log(state);

  const handleAgentLogout = () => {
    dispatch(logout());
    navigate("/agentSignIn");
  };

  const handleAdminLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    if (state !== null && state?.section) {
      setSection(state?.section);
    }
  }, [state, state?.section]);
  useEffect(() => {
    let unsubscribeMessage;
    let unsubscribeAgentsChat;

    if (user.isAdmin) {
      unsubscribeMessage = getMessage((userdata) => {
        dispatch(setAdminChats(userdata));
      });
    }

    if (user.isAgent) {
      unsubscribeAgentsChat = onSnapshot(
        doc(database, "Agents", user.email),
        (snapshot) => {
          if (snapshot.exists()) {
            const assignedChats = snapshot.data().assignedChats || [];
            const fetchChatsPromises = assignedChats.map(async (item) => {
              try {
                const chatDocRef = doc(
                  database,
                  "WhatsappMessages",
                  item.number
                );
                const chatSnapshot = await getDoc(chatDocRef);
                return { ...chatSnapshot.data(), id: chatSnapshot.id };
              } catch (error) {
                console.error("Error fetching chat:", error);
                throw error;
              }
            });

            Promise.allSettled(fetchChatsPromises)
              .then((results) => {
                const successfulChats = results
                  .filter((result) => result.status === "fulfilled")
                  .map((result) => result.value);

                dispatch(setAgentChats(successfulChats));
              })
              .catch((error) => {
                console.error("Error fetching chats:", error);
              });
          }
        }
      );
    }

    return () => {
      if (unsubscribeMessage) {
        unsubscribeMessage();
      }
      if (unsubscribeAgentsChat) {
        unsubscribeAgentsChat();
      }
    };
  }, []);
  useEffect(() => {
    let unsubscribeMessage;
    if (user.isAdmin) {
      unsubscribeMessage = getAllAgents((userdata) => {
        dispatch(setAllAgent(userdata));
      });
    }
    return () => {
      if (unsubscribeMessage) {
        unsubscribeMessage();
      }
    };
  }, []);

  useEffect(() => {
    const getUserMsg = async () => {
      try {
        const user = await getAllMessage();
        dispatch(
          setEditAgentsChats(
            user.map((userMsg) => ({
              id: userMsg.number,
              number: userMsg.number,
              name: userMsg.name,
            }))
          )
        );
      } catch (error) {
        new Error(error);
      }
    };
    if (user.isAdmin) {
      getUserMsg();
    }
  }, [user.isAdmin]);

  return (
    <>
      {user.isAgent && <CommonNav handleLogout={handleAgentLogout} />}
      {user.isAdmin && <Navbar handleLogout={handleAdminLogout} />}
      <div className={style.main}>
        <div className={style.left}>
          <Sidebar section={section} setSection={setSection} />
        </div>
        <div className={style.right}>
          {section === 1 && <MsgToUser />}
          {section === 2 && <MsgtoUsers />}
          {section === 3 && <TempToUser />}
          {section === 4 && <TemptoUsers />}
          {section === 6 && <AddUser />}
          {section === 7 && <CSVAdduser />}
          {section === 8 && (
            <NewChatSection
              chatnumber={state && state?.chatnumber ? state?.chatnumber : null}
            />
          )}
          {section === 9 && <EditUser />}
          {section === 10 && <AddAgent />}
          {section === 11 && <ManageAgent />}
        </div>
      </div>
    </>
  );
};

export default NewContact;
