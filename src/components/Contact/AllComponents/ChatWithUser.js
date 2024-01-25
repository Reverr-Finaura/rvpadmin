import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { database } from "../../../firebase/firebase";
import { useSelector } from "react-redux";
import style from "./chat.module.css";
import sendIcon from "../../../utils/Image/Send.png";
import searchIcon from "../../../utils/Image/Search.png";
import MessageView from "./MessageView";
import Toggle from "react-toggle";
import AssignedModal from "../Popup/AssignedModal";
import { ToastContainer, toast } from "react-toastify";

const ChatWithUser = ({ chatnumber }) => {
  const user = useSelector((state) => state.user.user);
  const adminChats = useSelector((state) => state.contact.allAdminChats);
  const agentsChats = useSelector((state) => state.contact.allAgentsChats);
  const [message, setMessage] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [toogle, setToggle] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [list, setList] = useState([]);
  const [currMessages, setCurrMessages] = useState([]);
  const [sortedMsg, setSortedMsg] = useState([]);

  useEffect(() => {
    const sortMsg = () => {
      const msg = user.isAdmin ? [...adminChats] : [...agentsChats];
      const sortedChats = [...msg].sort((a, b) => {
        const lastMessageA = a?.messages?.[a?.messages.length - 1];
        const lastMessageB = b?.messages?.[b?.messages.length - 1];
        if (!lastMessageA && !lastMessageB) {
          return 0;
        } else if (!lastMessageA) {
          return 1;
        } else if (!lastMessageB) {
          return -1;
        }
        const dateA = new Date(
          lastMessageA.date.seconds * 1000 + lastMessageA.date.nanoseconds / 1e6
        );
        const dateB = new Date(
          lastMessageB.date.seconds * 1000 + lastMessageB.date.nanoseconds / 1e6
        );
        return dateB - dateA;
      });
      if (sortedChats.length > 0) {
        setSortedMsg(sortedChats);
      }
    };
    sortMsg();
  }, [adminChats, agentsChats, user.isAdmin]);

  useEffect(() => {
    if (chatnumber) {
      const selectedOptions = user.isAdmin
        ? adminChats.filter((chat) => chat.id === chatnumber)[0]
        : agentsChats.filter((chat) => chat.id === chatnumber)[0];
      setCurrMessages(selectedOptions.messages);
      setSelectedData(selectedOptions);
      setToggle(selectedOptions.stop);
    }
  }, [adminChats, agentsChats, chatnumber, user.isAdmin]);

  const handleSelectChange = (selectedOptions) => {
    setCurrMessages(selectedOptions.messages);
    setSelectedData(selectedOptions);
    setToggle(selectedOptions.stop);
  };
  const submit = async (e) => {
    if (e?.key === "Enter" || e === "Send") {
      if (!selectedData) {
        return;
      }
      const data = {
        text: message,
        countryCode: selectedData.id.slice(0, -10),
        number: selectedData.id.slice(-10),
      };
      setMessage("");
      const within24Hours = isWithin24Hours(selectedData);
      if (within24Hours) {
        try {
          await fetch("https://server.reverr.io/sendwacustommsg", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          toast.success("Success sent");
        } catch (error) {
          toast.error("can't send message because 24 hours is not completed");
          console.error(error);
          throw error;
        }
      }
    }
  };
  function isWithin24Hours(singleChat) {
    if (singleChat?.messages.length === 0) {
      return true;
    }
    let lastMessage;
    const lengthOfMessages = singleChat?.messages.length;
    for (let i = lengthOfMessages - 1; i >= 0; i--) {
      if (singleChat?.messages[i].usermessage !== null) {
        lastMessage = singleChat?.messages[i];
        break;
      }
    }
    if (lastMessage === undefined) {
      return false;
    }
    const messageDate = new Date(
      lastMessage.date.seconds * 1000 + lastMessage.date.nanoseconds / 1e6
    );
    const currentDate = new Date();
    const timeDifferenceInHours = Math.ceil(
      Math.abs(currentDate - messageDate) / (1000 * 60 * 60)
    );
    return timeDifferenceInHours < 24;
  }

  const handleToggleChange = async (e) => {
    e.preventDefault();
    var temp = !toogle;
    setToggle(!toogle);
    try {
      await updateDoc(doc(database, "WhatsappMessages", selectedData?.id), {
        stop: temp,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const searchFun = () => {
      let search;
      if (user.isAdmin) {
        search = [...sortedMsg];
      }
      if (user.isAgent) {
        search = [...sortedMsg];
      }
      if (inputSearch) {
        const lowerCaseSearch = inputSearch.toLowerCase().trim();
        search = search.filter((item) => {
          const id = item.id || "";
          const name = item.name || "";
          return (
            id.toLowerCase().includes(lowerCaseSearch) ||
            name.toLowerCase().includes(lowerCaseSearch)
          );
        });
      }
      setList(search);
    };
    searchFun();
  }, [
    adminChats,
    agentsChats,
    inputSearch,
    sortedMsg,
    user.isAdmin,
    user.isAgent,
  ]);
  return (
    <div className={style.chatWrapper}>
      <div className={style.chatLeft}>
        <div className={style.rightSideHeader}>
          <h5>Conversations with Customers</h5>
        </div>
        <div className={style.chatList}>
          <div className={style.chatserach}>
            <div className={style.contactHeading}>
              <p>Contacts</p>
              <p className={style.number}>
                {list.length > 0 ? list.length : 0}
              </p>
            </div>
            <div className={style.serachbox}>
              <img src={searchIcon} alt='serach' />
              <input
                type='text'
                value={inputSearch}
                placeholder='Search'
                onChange={(e) => setInputSearch(e.target.value)}
              />
            </div>
          </div>
          {list &&
            list.map((user, index) => {
              return (
                <div
                  key={index}
                  className={style.contactListItem}
                  onClick={() => handleSelectChange(user)}
                  style={{
                    backgroundColor:
                      selectedData?.id === user?.id ? "#F7F7FC" : "",
                  }}
                >
                  <p>{user.name ? `${user.name}` : ""}</p>
                  {user?.messages && user?.messages?.length > 0 ? (
                    <p>
                      {user?.messages &&
                      user?.messages[user?.messages?.length - 1]
                        ?.usermessage === null ? (
                        <span>
                          {user?.messages &&
                            user?.messages[user?.messages?.length - 1]
                              .message &&
                            user?.messages[user?.messages?.length - 1].message
                              .text &&
                            user?.messages[user?.messages?.length - 1].message
                              .text.body &&
                            `${user?.messages[
                              user?.messages?.length - 1
                            ].message.text.body.substring(0, 20)}...`}

                          {user?.messages[user?.messages?.length - 1].message &&
                            user?.messages[user?.messages?.length - 1].message
                              .template &&
                            `${
                              "Template name : " +
                              user?.messages[user?.messages?.length - 1].message
                                .template.name
                            }`}
                        </span>
                      ) : (
                        <span>
                          {user?.messages[user?.messages?.length - 1]
                            .usermessage !== undefined &&
                            user?.messages[user?.messages?.length - 1]
                              .usermessage !== null &&
                            `${user?.messages[
                              user?.messages?.length - 1
                            ].usermessage.substring(0, 20)}...
                            `}
                          {user?.messages &&
                            user?.messages[user?.messages?.length - 1]
                              .message &&
                            user?.messages[user?.messages?.length - 1].message
                              .text &&
                            user?.messages[user?.messages?.length - 1].message
                              .text.body &&
                            `${user?.messages[
                              user?.messages?.length - 1
                            ].message.text.body.substring(0, 25)}...`}
                        </span>
                      )}
                    </p>
                  ) : (
                    <p>
                      <span>No messages from user Side</span>
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      </div>
      <div className={style.chatRight}>
        <div
          className={style.rightSideHeader}
          style={{ visibility: `${selectedData !== null ? " " : "hidden"}` }}
        >
          {user.isAdmin && selectedData !== null && (
            <AssignedModal
              selectedChatId={selectedData.id}
              selectedChatName={selectedData.name}
              selectedChatAssigned={selectedData?.chatAssigned}
            />
          )}
          <div className={style.endChat}>
            <p>{toogle ? " END CHAT" : "START CHAT"}</p>
            <Toggle
              checked={toogle}
              icons={false}
              onChange={handleToggleChange}
            />
          </div>
        </div>
        <div className={style.chatMessage}>
          {selectedData !== null ? (
            <>
              <div className={style.chatHeader}>
                <div className={style.chatHeaderleft}>
                  <div className={style.chatHeaderleftContent}>
                    <p style={{ width: "100%", margin: 0 }}>
                      {selectedData.name ? ` ${selectedData.name}  ` : ""}{" "}
                      {`(${
                        selectedData.userType
                          ? selectedData.userType.toUpperCase()
                          : ""
                      })`}
                    </p>
                    <span style={{ fontSize: "12px" }}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='12'
                        height='13'
                        viewBox='0 0 12 13'
                        fill='none'
                      >
                        <circle cx='6' cy='6.5' r='6' fill='#F7F7FC' />
                        <circle cx='6' cy='6.5' r='4' fill='#5570F1' />
                      </svg>
                      {`(+${
                        selectedData.id.slice(0, -10) +
                        "-" +
                        selectedData.id.slice(-10)
                      })`}
                    </span>
                  </div>
                </div>
                <div className={style.chatHeaderleft}>
                  {selectedData.chatAssigned &&
                    selectedData.chatAssigned.isAssigned && (
                      <p>
                        Assigned To{" "}
                        <span>
                          {" "}
                          {selectedData.chatAssigned.assignedTo.name}
                        </span>
                      </p>
                    )}
                </div>
              </div>
              <MessageView
                currMessages={currMessages}
                setCurrMessages={setCurrMessages}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
              />
              <div className={style.chatbuttonContainer}>
                <div className={style.chatbuttonbox}>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Your message'
                    disabled={!toogle}
                  />
                  <button
                    className={style.chatbuttonSend}
                    onClick={() => submit("Send")}
                    disabled={!toogle}
                  >
                    Send <img src={sendIcon} alt='' />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>"Please select any Chat"</p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChatWithUser;
