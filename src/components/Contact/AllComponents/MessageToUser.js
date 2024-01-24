import React, { useState } from "react";
import style from "./style.module.css";
import Select from "react-select";
import { useSelector } from "react-redux";
import { selectStyles } from "../../../utils";
import { ToastContainer, toast } from "react-toastify";

const MessageToUser = () => {
  const user = useSelector((state) => state.user.user);
  const adminChats = useSelector((state) => state.contact.allAdminChats);
  const agentsChats = useSelector((state) => state.contact.allAgentsChats);
  const [message, setMessage] = useState("");
  const [selectedData, setSelectedData] = useState(null);

  function isWithin24Hours(singleChat) {
    if (singleChat?.messages.length === 0) {
      return true;
    }
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
        toast.success("Successfully send");
        console.log(res);
      } catch (error) {
        toast.error("Error sending message");
        console.error("Error sending message:", error);
      }
    } else {
      toast.error("can't send message because 24 hours is not completed");
      console.log("can't send message because 24 hours is not completed");
    }
    setTimeout(() => {
      setMessage("");
      setSelectedData(null);
    }, 1000);
  };
  return (
    <div className={style.container}>
      <div className={style.heading}>
        <h3>Send Message to single user</h3>
      </div>
      <form onSubmit={submit}>
        <div className={style.inputField}>
          <label>Select user</label>
          <Select
            isClearable
            className='basic-single'
            classNamePrefix='select'
            name='user'
            options={user.isAdmin ? adminChats : agentsChats}
            onChange={handleSelectChange}
            value={selectedData}
            styles={selectStyles}
            getOptionLabel={(option) =>
              `+` + option.id + (option.name ? ` (${option.name})` : "")
            }
            getOptionValue={(option) => option.id}
          />
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
          <button>Send Message</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default MessageToUser;
