import React, { useEffect, useState } from "react";
import Select from "react-select";
import { database, getAllMessage, uploadMedia } from "../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";

const TemptoUsers = () => {
  const [users, setUsers] = useState([]);
  const [imageLink, setImageLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [fileName, setFileName] = useState(null);
  const getUserMsg = async () => {
    try {
      const user = await getAllMessage();
      setUsers(user);
    } catch (error) {
      new Error(error);
    }
  };
  useEffect(() => {
    getUserMsg();
  }, []);

  const [tags, setTags] = useState({});
  const [selectedTags, setSelectedTags] = useState();

  const handleTagSelectChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
    const filteredUser = users.filter((user) => {
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

  // useEffect(() => {
  //   if (selectedTags) {
  //     const filteredUsers = users.filter((user) => {
  //       const userTags = user?.userTags || [];
  //       return userTags.includes(selectedTags.label);
  //     });
  //     setUsers(filteredUsers);
  //   } else {
  //     getUserMsg();
  //   }
  // }, [selectedTags]);

  const [selectTrue, setSelectedTrue] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [selectedData, setSelectedData] = useState([]);

  const handleFileChange = async (e) => {
    if (e.target.files) {
      try {
        setLoading(true);
        const file = e.target.files[0];
        setFileName(e.target.value);
        const link = await uploadMedia(file, "WhatsappTemplateImages");
        console.log(link);
        setImageLink(link);
        setLoading(false);
        toast.success("Image uploaded!");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
  };
  const Reset = () => {
    setImageLink(null);
    setBtnDisable(false);
    setFileName("");
    setTemplateName("");
    setSelectedData([]);
    setSelectedTrue(false);
  };

  // let checked = [];
  // for (let i = 0; i < selectedData.length; i++) {
  //   const lastMessage =
  //     selectedData[i]?.messages[selectedData[i]?.messages.length - 1];
  //   const messageDate = new Date(
  //     lastMessage?.date?.seconds * 1000 + lastMessage?.date?.nanoseconds / 1e6
  //   );
  //   const currentDate = new Date();
  //   const timeDifferenceInHours =
  //     (currentDate - messageDate) / (1000 * 60 * 60);
  //   if (timeDifferenceInHours >= 24) {
  //     checked.push(true);
  //   } else {
  //     checked.push(false);
  //   }
  // }
  const getCodeAndNumber = () => {
    const codes = selectedData.map((item) => item.id.slice(0, -10));
    const numbers = selectedData.map((item) => item.id.slice(-10));
    const filteredCodes = [];
    const filteredNumbers = [];
    // for (let i = 0; i < checked.length; i++) {
    //   if (checked[i] !== false) {
    //     filteredCodes.push(codes[i]);
    //     filteredNumbers.push(numbers[i]);
    //   }
    // }
    return {
      codes,
      numbers,
    };
  };
  const selectAllUsers = () => {
    if (!selectTrue) {
      setSelectedData(users);
    } else {
      setSelectedData([]);
    }
    setSelectedTrue(!selectTrue);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) {
      toast.error("Uploading image please wait...");
    } else {
      if (!selectedData) {
        return;
      }
      const { codes, numbers } = getCodeAndNumber();
      var data;
      if (imageLink != null) {
        data = {
          templateName: templateName,
          countryCodes: codes,
          numbers: numbers,
          image: imageLink,
        };
      } else {
        data = {
          templateName: templateName,
          countryCodes: codes,
          numbers: numbers,
        };
      }
      setBtnDisable(true);
      // console.log(data)
      toast.success("Sending Template To users");
      try {
        if (imageLink != null) {
          const res = await fetch("https://server.reverr.io/sendwamutmimg", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          // console.log(res);
          Reset();
          toast.success("Template send!");
        } else {
          const res = await fetch("https://server.reverr.io/sendwamutm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          // console.log(res);
          Reset();
          toast.success("Template send!");
        }
      } catch (error) {
        Reset();
        console.error("Error sending message:", error);
      }
      // setTimeout(() => {
      //   setSelectedTrue(false);
      //   setTemplateName("");
      //   setSelectedData([]);
      // }, 1000);
    }
    // if (!selectedData) {
    //   return;
    // }
    // const { codes, numbers } = getCodeAndNumber();
    // const data = {
    //   templateName: templateName,
    //   countryCodes: codes,
    //   numbers: numbers,
    // };
    // try {
    //   const res = await fetch("https://server.reverr.io/sendwamutm", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(data),
    //   });
    //   console.log(res);
    // } catch (error) {
    //   console.error("Error sending message:", error);
    // }
    // setTimeout(() => {
    //   setSelectedTrue(false);
    //   setTemplateName("");
    // }, 1000);
  };
  return (
    <div className='form-container'>
      <h3>Send Template to single user</h3>
      <form onSubmit={submit}>
        <div className='input-feilds'>
          <div className='input-feilds'>
            <label>Select User Tags</label>
            <Select
              name='tags'
              isClearable
              isMulti
              className='basic-multi-select'
              classNamePrefix='select'
              options={tags.initialTags}
              onChange={handleTagSelectChange}
              value={selectedTags}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.label}
            />
          </div>
          <label>Select Mutiple user</label>
          <Select
            isMulti
            name='colors'
            options={users}
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
          Select All Users
          <button type='button' onClick={selectAllUsers}>
            {selectTrue === true
              ? "All user selected"
              : "All user not selected"}
          </button>
        </div>
        <div className='input-feilds'>
          <label>Template</label>
          <textarea
            rows={10}
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          ></textarea>
          <input type='file' value={fileName} onChange={handleFileChange} />
        </div>
        <button disabled={btnDisable}>Send Message</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default TemptoUsers;

//hello_world
