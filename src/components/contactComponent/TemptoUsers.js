import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getMessage } from "../../firebase/firebase";

const TemptoUsers = () => {
  const [users, setUsers] = useState([]);
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
  const [templateName, setTemplateName] = useState("");
  const [selectedData, setSelectedData] = useState([]);

  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
  };

  let checked = [];
  for (let i = 0; i < selectedData.length; i++) {
    const lastMessage =
      selectedData[i]?.messages[selectedData[i]?.messages.length - 1];
    const messageDate = new Date(
      lastMessage?.date?.seconds * 1000 + lastMessage?.date?.nanoseconds / 1e6
    );
    const currentDate = new Date();
    const timeDifferenceInHours =
      (currentDate - messageDate) / (1000 * 60 * 60);
    if (timeDifferenceInHours >= 24) {
      checked.push(true);
    } else {
      checked.push(false);
    }
  }
  const getCodeAndNumber = () => {
    const codes = selectedData.map((item) => item.id.slice(0, -10));
    const numbers = selectedData.map((item) => item.id.slice(-10));
    const filteredCodes = [];
    const filteredNumbers = [];
    for (let i = 0; i < checked.length; i++) {
      if (checked[i] !== false) {
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
      templateName: templateName,
      countryCodes: codes,
      numbers: numbers,
    };
    try {
      const res = await fetch("https://server.reverr.io/sendwamutm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(res);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setTimeout(() => {
      setTemplateName("");
      setSelectedData([]);
    }, 1000);
  };
  return (
    <div className='form-container'>
      <h3>Send Template to single user</h3>
      <form onSubmit={submit}>
        <div className='input-feilds'>
          <label>Select Mutiple user</label>
          <Select
            isMulti
            name='colors'
            options={users}
            className='basic-multi-select'
            classNamePrefix='select'
            onChange={handleSelectChange}
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

export default TemptoUsers;

//hello_world
