import React, { useEffect, useState } from "react";
import "./contactComp.css";
import { database } from "../../firebase/firebase";
import MsgView from "./msgview";
import { doc, updateDoc } from "firebase/firestore";
import Toggle from "react-toggle";
import ChatAssignedModal from "./ChatAssignedModal";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

const NewChatSection = ({ chatnumber }) => {
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
  console.log(sortedMsg);

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
      const data = {
        text: message,
        countryCode: selectedData.id.slice(0, -10),
        number: selectedData.id.slice(-10),
      };
      if (selectedData) {
        const res = await fetch("https://server.reverr.io/sendwacustommsg", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        console.log(res);
      }
      setMessage("");
    }
  };

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
  function splittheParagraph(text) {
    const words = text.split(" ");
    const limitedText = words.slice(0, 9).join(" ");
    return limitedText;
  }

  return (
    <>
      <ToastContainer />
      <h3>User Chat Section</h3>
      <div className='newChat-wrapper'>
        <div className='new-chat-box'>
          <div className='chatlist'>
            <div className='chatserach'>
              <label>Search User</label>
              <input
                type='text'
                value={inputSearch}
                placeholder='Search the User with name & number'
                onChange={(e) => setInputSearch(e.target.value)}
              />
            </div>
            {list.map((user, index) => {
              return (
                <div
                  key={index}
                  className='numberitem'
                  onClick={() => handleSelectChange(user)}
                  style={{
                    backgroundColor:
                      selectedData?.id === user?.id ? "green" : "",
                    color: selectedData?.id === user?.id ? "white" : "black",
                  }}
                >
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      color: selectedData?.id === user?.id ? "white" : "black",
                    }}
                  >
                    {user.name ? `${user.name}` : ""}
                    <span style={{ fontSize: "10px" }}>
                      {user.id &&
                        `(+${
                          user.id.slice(0, -10) + "-" + user.id.slice(-10)
                        })`}
                    </span>
                  </p>
                  {user?.messages?.length > 0 ? (
                    <p
                      style={{
                        color:
                          selectedData?.id === user?.id ? "white" : "green",
                        fontSize: "10px",
                      }}
                    >
                      {user?.messages[user?.messages?.length - 1]
                        ?.usermessage === null ? (
                        <span>
                          {user?.messages[user?.messages?.length - 1].message &&
                            user?.messages[user?.messages?.length - 1].message
                              .text &&
                            user?.messages[user?.messages?.length - 1].message
                              .text.body &&
                            `${splittheParagraph(
                              user?.messages[user?.messages?.length - 1].message
                                .text.body
                            )}`}

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
                          {user?.messages[user?.messages?.length - 1].message &&
                            user?.messages[user?.messages?.length - 1].message
                              .text &&
                            user?.messages[user?.messages?.length - 1].message
                              .text.body &&
                            `${splittheParagraph(
                              user?.messages[user?.messages?.length - 1].message
                                .text.body
                            )}`}
                        </span>
                      )}
                    </p>
                  ) : (
                    <span
                      style={{
                        color:
                          selectedData?.id === user?.id ? "white" : "green",
                        fontSize: "10px",
                      }}
                    >
                      No messages from user Side
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className='chat-body'>
            {selectedData !== null ? (
              <>
                <div className='cat-bodyuper'>
                  <div className='chat-actions'>
                    <div>
                      <p style={{ width: "100%", margin: 0 }}>
                        {selectedData.name ? ` ${selectedData.name}  ` : ""}
                      </p>
                      <span style={{ fontSize: "12px" }}>
                        {`(+${
                          selectedData.id.slice(0, -10) +
                          "-" +
                          selectedData.id.slice(-10)
                        })`}
                      </span>
                    </div>
                    {user.isAdmin && (
                      <ChatAssignedModal
                        selectedChatId={selectedData.id}
                        selectedChatName={selectedData.name}
                        selectedChatAssigned={selectedData?.chatAssigned}
                      />
                    )}
                  </div>
                  <div className='chat-actions'>
                    <p>
                      <span
                        style={{
                          color: `${toogle ? "red" : "green"} `,
                        }}
                      >
                        {toogle ? " End Chat" : "Start Chat"}
                      </span>
                    </p>
                    <Toggle
                      checked={toogle}
                      icons={false}
                      onChange={handleToggleChange}
                    />
                  </div>
                </div>
                <MsgView
                  currMessages={currMessages}
                  setCurrMessages={setCurrMessages}
                  selectedData={selectedData}
                  setSelectedData={setSelectedData}
                />
                <div className='chat-btn'>
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className='sendMessage'
                    onKeyUp={submit}
                    disabled={!toogle}
                  />
                  <button
                    onClick={() => submit("Send")}
                    disabled={!toogle}
                    style={{
                      backgroundColor: "green",
                      color: "white",
                    }}
                  >
                    Send
                  </button>
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
      </div>
    </>
  );
};

export default NewChatSection;
