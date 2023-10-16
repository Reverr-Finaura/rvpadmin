import React, { useEffect, useRef, useState } from "react";
import { database, getMessage } from "../../firebase/firebase";
import "./contactComp.css";
import ReactSelect from "react-select";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import MsgView from "./msgview";

const ChatSection = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [toogle, setToggle] = useState(false);

  const [currMessages, setCurrMessages] = useState([]);

  useEffect(() => {
    var tempData;
    const getUserMsg = async () => {
      try {
        const user = await getMessage();
        setUsers(user);
        tempData = user;
        // console.log(tempData);
      } catch (error) {
        new Error(error);
      }
    };
    getUserMsg();
  }, []);

  const handleSelectChange = (selectedOptions) => {
    setCurrMessages(selectedOptions.messages)
    // currmessages = selectedOptions.messages;
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
  // const [singleChat, setSingleChat] = useState(null);
  // useEffect(() => {
  //   if (selectedData) {
  //     const getSinglemsg = async () => {
  //       const docRef = doc(database, "WhatsappMessages", selectedData?.id);
  //       const docSnapshot = await getDoc(docRef);

  //       if (docSnapshot.exists()) {
  //         setSingleChat({ ...docSnapshot.data(), id: docSnapshot.id });
  //       }
  //       console.log("new Msg", singleChat);
  //     };

  //     getSinglemsg();
  //   }
  // }, [selectedData]);

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
      <div className='input-feilds'>
        <label>Select user</label>
        <ReactSelect
          className='basic-single'
          classNamePrefix='select'
          name='usersMessage'
          options={users}
          onChange={handleSelectChange}
          value={selectedData}
          getOptionLabel={(option) => option.id}
          getOptionValue={(option) => option.id}
        />
      </div>
      {selectedData !== null && (
        <>
          <div className='chatConatiner'>
            <div className='chatheader'>
              <h3>Chat Box</h3>
              <div>
                <label>
                  <Toggle
                    checked={toogle}
                    icons={false}
                    onChange={handleToggleChange}
                  />
                </label>
              </div>
            </div>
            <div className='mainChat'>
              <div className='chatlist'>
                <h4>Number</h4>
                {`+${
                  selectedData.id.slice(0, -10) +
                  "-" +
                  selectedData.id.slice(-10)
                }`}
              </div>
              <div className='chatcontent'>
                {selectedData!==null &&
                <MsgView currMessages={currMessages} setCurrMessages={setCurrMessages} selectedData={selectedData} setSelectedData={setSelectedData}/>
                }
                <div className='chat-btn'>
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className='sendMessage'
                  />
                  <button onClick={submit}>Send Message</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatSection;

// useEffect(() => {
//   console.log(selectedData, "Selected data");
//   if (
//     selectedData === null ||
//     selectedData === undefined ||
//     selectedData === ""
//   ) {
//     setCurrentUser(null);
//     console.log("Current user", null);
//   } else {
//     setCurrentUser(users.filter((user) => user.id === selectedData.id));
//     console.log(users.filter((user) => user.id === selectedData.id));
//   }
// }, [selectedData, users]);

// const docRef = database.collection("WhatsappMessages").doc(selectedData?.id);
// console.log(docRef);
// useEffect(() => {
//   const getSinglemsg = async () => {
//     await getDoc(doc(database, "WhatsappMessages", selectedData?.id)).then(
//       (doc) => {
//         doc.exists() && console.log(doc.data());
//       }
//     );
//   };
//   getSinglemsg();
// }, [selectedData]);
