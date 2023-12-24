import React, { useEffect, useState } from "react";
import "./contactComp.css";
import Select from "react-select";
import { database, getMessage } from "../../firebase/firebase";
import { useSelector } from "react-redux";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const MsgToUser = () => {
  const user = useSelector((state) => state.user.user);
  const [message, setMessage] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [users, setUsers] = useState([]);
  const [agentsChat, setAgentsChat] = useState([]);
  useEffect(() => {
    const unsubscribeMessage = getMessage((userdata) => {
      setUsers(userdata);
    });
    const unsubscribeAgentsChat = onSnapshot(
      doc(database, "Agents", user.email),
      (snapshot) => {
        if (snapshot.exists()) {
          const assignedChats = snapshot.data().assignedChats || [];
          const fetchChatsPromises = assignedChats.map(async (item) => {
            try {
              const chatDocRef = doc(database, "WhatsappMessages", item.number);
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

              setAgentsChat(successfulChats);
            })
            .catch((error) => {
              console.error("Error fetching chats:", error);
            });
        }
      }
    );
    return () => {
      unsubscribeMessage();
      unsubscribeAgentsChat();
    };
  }, [user.email]);

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
    return timeDifferenceInHours > 24;
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
    const within24Hours = isWithin24Hours(selectedData);
    if (within24Hours) {
      try {
        const res = await fetch("https://server.reverr.io/sendwacustommsg   ", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        console.log(res);
      } catch (error) {
        console.log(within24Hours);
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
            options={user.isAdmin ? users : agentsChat}
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
