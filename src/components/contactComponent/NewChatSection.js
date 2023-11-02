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
    const data = {
      text: message,
      countryCode: selectedData.id.slice(0, -10),
      number: selectedData.id.slice(-10),
    };
    console.log(data);
    if (selectedData) {
      const res = await fetch("https://server.reverr.io/sendwacustommsg   ", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(res);
    }
    setMessage("");
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
                      selectedData?.name === user?.name ? "green" : "",
                    color:
                      selectedData?.name === user?.name ? "white" : "black",
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
                  />
                  <button onClick={submit}>Send Message</button>
                </div>
              </>
            ) : (
              "Please select a any Chat"
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewChatSection;
