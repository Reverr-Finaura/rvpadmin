import React, { useEffect, useState } from "react";
import "./contactComp.css";
import Select from "react-select";
import { database, getAllMessage } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const MsgToUser = () => {
  const [message, setMessage] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [singleChat, setSingleChat] = useState(null);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUserMsg = async () => {
      try {
        const user = await getAllMessage();
        setUsers(user);
      } catch (error) {
        new Error(error);
      }
    };
    getUserMsg();
  }, []);

  useEffect(() => {
    if (selectedData) {
      const getSinglemsg = async () => {
        const docRef = doc(database, "WhatsappMessages", selectedData?.id);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          setSingleChat({ ...docSnapshot.data(), id: docSnapshot.id });
        }
      };
      getSinglemsg();
    }
  }, [selectedData]);

  // const lastMessage = singleChat?.messages[singleChat?.messages.length - 1];
  // const messageDate = new Date(
  //   lastMessage?.date?.seconds * 1000 + lastMessage?.date?.nanoseconds / 1e6
  // );
  // const currentDate = new Date();
  // const timeDifferenceInHours = messageDate
  //   ? Math.ceil(Math.abs(currentDate - messageDate) / (1000 * 60 * 60))
  //   : null;

  function isWithin24Hours(singleChat) {
    const lastMessage = singleChat?.messages?.[singleChat?.messages.length - 1];
    if (!lastMessage) {
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
  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!selectedData) {
      return;
    }
    const data = {
      text: message,
      countryCode: selectedData.id.slice(0, -10),
      number: selectedData.id.slice(-10),
    };
    const within24Hours = isWithin24Hours(singleChat);
    if (within24Hours) {
      try {
        const res = await fetch("https://server.reverr.io/sendwacustommsg   ", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        console.log(res);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.log("can't send message because 24 hours is not completed");
    }
    setTimeout(() => {
      setMessage("");
      setSelectedData(null);
    }, 1000);
  };

  return (
    <div className='form-container'>
      <h3>Send Message to single user</h3>
      <form onSubmit={submit}>
        <div className='input-feilds'>
          <label>Select user</label>
          <Select
            isClearable
            className='basic-single'
            classNamePrefix='select'
            name='user'
            options={users}
            onChange={handleSelectChange}
            value={selectedData}
            getOptionLabel={(option) =>
              `+` + option.id + (option.name ? ` (${option.name})` : "")
            }
            getOptionValue={(option) => option.id}
          />
        </div>
        <div className='input-feilds'>
          <label>Message</label>
          <textarea
            rows={10}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <button>Send Message</button>
      </form>
    </div>
  );
};

export default MsgToUser;
