import React, { useEffect, useState } from "react";
import style from "./Contact.module.css";
import Navbar from "../../components/Contact/Navbar/Navbar";
import Sidebar from "../../components/Contact/Sidebar/Sidebar";
import MessageToUser from "../../components/Contact/AllComponents/MessageToUser";
import MessageToUsers from "../../components/Contact/AllComponents/MessageToUsers";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/userSlice";
import {
  setAdminChats,
  setAgentChats,
  setAllAgent,
  setEditAgentsChats,
  setFeedBack,
} from "../../redux/contactSlice";
import {
  database,
  getAllAgents,
  getAllMessage,
  getAllfeedBack,
  getMessage,
} from "../../firebase/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import TemplateToUser from "../../components/Contact/AllComponents/TemplateToUser";
import TemplateToUsers from "../../components/Contact/AllComponents/TemplateToUsers";
import AddUser from "../../components/Contact/AllComponents/AddUser";
import EditUser from "../../components/Contact/AllComponents/EditUser";
import AddAgent from "../../components/Contact/AllComponents/AddAgent";
import ManageAgent from "../../components/Contact/AllComponents/ManageAgent";
import ManageFeedback from "../../components/Contact/AllComponents/ManageFeedback";
import AddCSVuser from "../../components/Contact/AllComponents/AddCSVuser";
import ChatWithUser from "../../components/Contact/AllComponents/ChatWithUser";

const Contact = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [section, setSection] = useState(1);
  const { state } = useLocation();

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
    let unsubscribeFeedback;
    unsubscribeFeedback = getAllfeedBack((userdata) => {
      dispatch(setFeedBack(userdata));
    });

    return () => {
      if (unsubscribeFeedback) {
        unsubscribeFeedback();
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
      <Navbar />
      <div className={style.main}>
        <div className={style.left}>
          <Sidebar
            section={section}
            setSection={setSection}
            handleAdminLogout={handleAdminLogout}
            handleAgentLogout={handleAgentLogout}
          />
        </div>
        <div className={style.right}>
          {section === 1 && <MessageToUser />}
          {section === 2 && <MessageToUsers />}
          {section === 3 && <TemplateToUser />}
          {section === 4 && <TemplateToUsers />}
          {section === 5 && <AddUser />}
          {section === 6 && <AddCSVuser />}
          {section === 7 && (
            <ChatWithUser
              chatnumber={state && state?.chatnumber ? state?.chatnumber : null}
            />
          )}
          {section === 8 && <EditUser />}
          {section === 9 && <AddAgent />}
          {section === 10 && <ManageAgent />}
          {section === 11 && <ManageFeedback />}
        </div>
      </div>
    </>
  );
};

export default Contact;
