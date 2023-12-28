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

  // useEffect(() => {
  //   if (chatnumber) {
  //     const getChat = async () => {
  //       const chat = await getDoc(
  //         doc(database, "WhatsappMessages", chatnumber)
  //       );
  //       if (chat.exists()) {
  //         const selectedOptions = { ...chat.data(), id: chat.id };
  //         setCurrMessages(selectedOptions.messages);
  //         setSelectedData(selectedOptions);
  //         setToggle(selectedOptions.stop);
  //       }
  //     };
  //     getChat();
  //   }
  // }, [chatnumber]);

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
  console.log(selectedData);

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
        search = [...adminChats];
      }
      if (user.isAgent) {
        search = [...agentsChats];
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
  }, [adminChats, agentsChats, inputSearch, user.isAdmin, user.isAgent]);

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
                  <p>{user.name ? `${user.name}` : ""}</p>
                  <span>
                    {user.id &&
                      `+${user.id.slice(0, -10) + "-" + user.id.slice(-10)}`}
                  </span>
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
                          color: `${toogle ? "green" : "red"} `,
                        }}
                      >
                        {toogle ? " Start Chat" : "End Chat"}
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
