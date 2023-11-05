import React, { useEffect, useState } from "react";
import "./contactComp.css";
import { database, getMessage } from "../../firebase/firebase";
import MsgView from "./msgview";
import { doc, updateDoc } from "firebase/firestore";
import Toggle from "react-toggle";

const NewChatSection = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [toogle, setToggle] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [list, setList] = useState([]);

  const [currMessages, setCurrMessages] = useState([]);
  useEffect(() => {
    const getUserMsg = async () => {
      try {
        const user = await getMessage();
        setUsers(user);
      } catch (error) {
        new Error(error);
      }
    };
    getUserMsg();
  }, []);
  const handleSelectChange = (selectedOptions) => {
    setCurrMessages(selectedOptions.messages);
    setSelectedData(selectedOptions);
  };
  const submit = async (e) => {
    if (e?.key === "Enter" || e === "Send") {
      const data = {
        text: message,
        countryCode: selectedData.id.slice(0, -10),
        number: selectedData.id.slice(-10),
      };
      console.log(data);
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
  useEffect(() => {
    setToggle(selectedData?.stop);
  }, [selectedData]);

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
      let search = [...users];
      if (inputSearch) {
        search = search.filter(
          (item) =>
            item.id.toLowerCase().search(inputSearch.toLowerCase().trim()) !==
            -1
        );
      }
      setList(search);
    };
    searchFun();
  }, [inputSearch, users]);

  return (
    <>
      <h3>User Chat Section</h3>
      <div className='newChat-wrapper'>
        <div className='new-chat-box'>
          <div className='chatlist'>
            <div className='chatserach'>
              <label>Search User</label>
              <input
                type='number'
                value={inputSearch}
                placeholder='Enter the User number to search'
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
                  <p>
                    {selectedData.name ? ` ${selectedData.name}  ` : ""}
                    {`(+${
                      selectedData.id.slice(0, -10) +
                      "-" +
                      selectedData.id.slice(-10)
                    })`}
                  </p>
                  <label>
                    <Toggle
                      checked={toogle}
                      icons={false}
                      onChange={handleToggleChange}
                    />
                  </label>
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
                  />
                  <button
                    onClick={() => submit("Send")}
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
