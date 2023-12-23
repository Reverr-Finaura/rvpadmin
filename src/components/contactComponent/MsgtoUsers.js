import React, { useEffect, useState } from "react";
import "./contactComp.css";
import Select from "react-select";
import { database, getMessage } from "../../firebase/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useSelector } from "react-redux";

const MsgtoUsers = () => {
  const user = useSelector((state) => state.user.user);
  const [message, setMessage] = useState("");
  const [selectTrue, setSelectedTrue] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
  };
  function isWithin24Hours(selectedData) {
    let checked = [];
    for (let i = 0; i < selectedData.length; i++) {
      if (selectedData[i].messages) {
        const lastMessage =
          selectedData[i]?.messages[selectedData[i]?.messages.length - 1];
        const messageDate = new Date(
          lastMessage?.date?.seconds * 1000 +
            lastMessage?.date?.nanoseconds / 1e6
        );
        const currentDate = new Date();
        const timeDifferenceInHours = Math.ceil(
          Math.abs(currentDate - messageDate) / (1000 * 60 * 60)
        );
        if (timeDifferenceInHours > 24) {
          checked.push(true);
        } else {
          checked.push(false);
        }
      } else {
        checked.push(true);
      }
    }
    return checked;
  }
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

  const [tags, setTags] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagSelectChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
    const filteredUser = (users ?? agentsChat).filter((user) => {
      const userTags = user?.userTags || [];
      return userTags.some((userTag) =>
        selectedOptions.some((selectedTag) => selectedTag.label === userTag)
      );
    });
    setSelectedData(filteredUser);
  };

  useEffect(() => {
    const getTags = async () => {
      const result = await getDoc(doc(database, "meta", "tags"));
      if (result.exists()) {
        setTags(result.data());
      }
    };
    getTags();
  }, []);

  const selectAllUsers = () => {
    if (!selectTrue) {
      setSelectedData(user.isAdmin ? users : agentsChat);
    } else {
      setSelectedData([]);
    }
    setSelectedTrue(!selectTrue);
  };
  const getCodeAndNumber = () => {
    const codes = selectedData.map((item) => item.id.slice(0, -10));
    const numbers = selectedData.map((item) => item.id.slice(-10));
    const filteredCodes = [];
    const filteredNumbers = [];
    const checkedValue = isWithin24Hours(selectedData);
    for (let i = 0; i < checkedValue.length; i++) {
      if (checkedValue[i] !== false) {
        filteredCodes.push(codes[i]);
        filteredNumbers.push(numbers[i]);
      }
    }
    return {
      codes: filteredCodes,
      numbers: filteredNumbers,
    };
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!selectedData) {
      return;
    }
    const { codes, numbers } = getCodeAndNumber();
    const data = {
      text: message,
      countryCodes: codes,
      numbers: numbers,
    };
    try {
      const res = await fetch("https://server.reverr.io/sendwamucm ", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(res);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setTimeout(() => {
      setSelectedTrue(false);
      setMessage("");
      setSelectedData([]);
    }, 1000);
  };

  return (
    <div className='form-container'>
      <h3>Send Message to Mutiple user</h3>
      <form onSubmit={submit}>
        <div className='input-feilds'>
          <label>Select User Tags</label>
          <Select
            name='tags'
            isMulti
            isClearable
            classNamePrefix='select'
            options={tags.initialTags}
            onChange={handleTagSelectChange}
            value={selectedTags}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.label}
          />
        </div>
        <div className='input-feilds'>
          <label>Select Mutiple user</label>
          <Select
            isMulti
            name='colors'
            options={user.isAdmin ? users : agentsChat}
            className='basic-multi-select'
            classNamePrefix='select'
            onChange={handleSelectChange}
            value={selectedData}
            getOptionLabel={(option) =>
              `+` + option.id + (option.name ? ` (${option.name})` : "")
            }
            getOptionValue={(option) => option.id}
          />
        </div>
        <div className='input-feilds'>
          <label>Select All Users</label>
          <button type='button' onClick={selectAllUsers}>
            {selectTrue === true
              ? "All user are selected"
              : "All user are not selected"}
          </button>
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

export default MsgtoUsers;

// let checked = [];
// for (let i = 0; i < selectedData.length; i++) {
//   if (selectedData[i].messages) {
//     const lastMessage =
//       selectedData[i]?.messages[selectedData[i]?.messages.length - 1];
//     const messageDate = new Date(
//       lastMessage?.date?.seconds * 1000 + lastMessage?.date?.nanoseconds / 1e6
//     );
//     const currentDate = new Date();
//     const timeDifferenceInHours = Math.ceil(
//       Math.abs(currentDate - messageDate) / (1000 * 60 * 60)
//     );
//     if (timeDifferenceInHours < 24) {
//       checked.push(true);
//     } else {
//       checked.push(false);
//     }
//   } else {
//     checked.push(true);
//   }
// }
