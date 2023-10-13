import React, { useEffect, useState } from "react";
import "./contactComp.css";
import Select from "react-select";
import { database, getMessage } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const TempToUser = () => {
  const [templateName, setTemplateName] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [users, setUsers] = useState([]);
  const [singleChat, setSingleChat] = useState(null);
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

  const lastMessage = singleChat?.messages[singleChat?.messages.length - 1];
  const messageDate = new Date(
    lastMessage?.date?.seconds * 1000 + lastMessage?.date?.nanoseconds / 1e6
  );
  const currentDate = new Date();
  const timeDifferenceInHours = (currentDate - messageDate) / (1000 * 60 * 60);
  console.log(timeDifferenceInHours);
  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!selectedData) {
      return;
    }
    const data = {
      templateName: templateName,
      countryCode: selectedData.id.slice(0, -10),
      number: selectedData.id.slice(-10),
    };
    if (timeDifferenceInHours >= 24) {
      try {
        const res = await fetch("https://server.reverr.io/sendwatemplatemsg", {
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
      setTemplateName("");
      setSelectedData(null);
    }, 1000);
  };
  return (
    <div className='form-container'>
      <h3>Send Template to Mutiple user</h3>
      <form onSubmit={submit}>
        <div className='input-feilds'>
          <label>Select user</label>
          <Select
            className='basic-single'
            classNamePrefix='select'
            name='user'
            options={users}
            onChange={handleSelectChange} // Handle selection changes
            value={selectedData}
            getOptionLabel={(option) => option.id}
            getOptionValue={(option) => option.id}
          />
        </div>
        <div className='input-feilds'>
          <label>Template</label>
          <textarea
            rows={10}
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          ></textarea>
        </div>
        <button>Send Message</button>
      </form>
    </div>
  );
};

export default TempToUser;
