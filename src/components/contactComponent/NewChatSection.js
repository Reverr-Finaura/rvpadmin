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
    e.preventDefault();
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

  return (
    <>
      <h3>User Chat Section</h3>
      <div className='newChat-wrapper'>
        <div className='new-chat-box'>
          <div className='chatlist'>
            {users.map((user) => {
              return (
                <div
                  key={user.id}
                  className='numberitem'
                  onClick={() => handleSelectChange(user)}
                  style={{
                    backgroundColor:
                      selectedData?.id === user?.id ? "green" : "",
                    color: selectedData?.id === user?.id ? "white" : "black",
                  }}
                >
                  <p>{user.name ? `${user.name}` : ""}</p>
                  <span>{`+${
                    user.id.slice(0, -10) + "-" + user.id.slice(-10)
                  }`}</span>
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
                  <button onClick={() => submit("Send")}>Send Message</button>
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
                <p>"Please select a any Chat"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewChatSection;