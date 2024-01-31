import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import Select from "react-select";
import { useSelector } from "react-redux";
import { selectStyles } from "../../../utils";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";

const MessageToUsers = () => {
  const user = useSelector((state) => state.user.user);
  const adminChats = useSelector((state) => state.contact.allAdminChats);
  const agentsChats = useSelector((state) => state.contact.allAgentsChats);
  const [message, setMessage] = useState("");
  const [selectTrue, setSelectedTrue] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [loadings, setLoadings] = React.useState(false);
  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
  };
  function isWithin24HoursMultiple(selectedData) {
    let checked = [];
    for (let i = 0; i < selectedData.length; i++) {
      const value = isWithin24Hours(selectedData[i]);
      checked.push({ value: value, number: selectedData[i].number });
    }
    return checked;
  }
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

  const [tags, setTags] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagSelectChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
    const selectuser = user.isAdmin ? adminChats : agentsChats;
    const filteredUser = selectuser.filter((user) => {
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
      setSelectedData(user.isAdmin ? adminChats : agentsChats);
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
    const checkedValue = isWithin24HoursMultiple(selectedData);
    for (let i = 0; i < checkedValue.length; i++) {
      if (checkedValue[i].value !== false) {
        filteredCodes.push(codes[i]);
        filteredNumbers.push(numbers[i]);
      } else {
        toast.error("Can't send message to " + checkedValue[i].number);
      }
    }
    return {
      codes: filteredCodes,
      numbers: filteredNumbers,
    };
  };
  const submit = async (e) => {
    e.preventDefault();
    setLoadings(true);
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
      await fetch("https://server.reverr.io/sendwamucm ", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoadings(false);
      setTimeout(() => {
        setSelectedTrue(false);
        setMessage("");
        setSelectedData([]);
      }, 1000);
    }
  };
  return (
    <div className={style.container}>
      <div className={style.heading}>
        <h3>Send Message to Multiple Users</h3>
      </div>
      <form onSubmit={submit}>
        <div className={style.inputField}>
          <label>Select User Tags</label>
          <Select
            name="tags"
            isMulti
            isClearable
            classNamePrefix="select"
            styles={selectStyles}
            options={tags.initialTags}
            onChange={handleTagSelectChange}
            value={selectedTags}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.label}
          />
        </div>
        <div className={style.inputField}>
          <label>Select Mutiple user</label>
          <Select
            isMulti
            name="colors"
            options={user.isAdmin ? adminChats : agentsChats}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleSelectChange}
            styles={selectStyles}
            value={selectedData}
            getOptionLabel={(option) =>
              `+` + option.id + (option.name ? ` (${option.name})` : "")
            }
            getOptionValue={(option) => option.id}
          />
        </div>
        <div className={style.inputField}>
          <button type="button" onClick={selectAllUsers}>
            {selectTrue === true ? "Deselect All user" : "Select All user"}
          </button>
        </div>
        <div className={style.inputField}>
          <label>Message</label>
          <textarea
            rows={8}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <div className={style.formbutton}>
          <button disabled={loadings}>Send Message</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default MessageToUsers;
