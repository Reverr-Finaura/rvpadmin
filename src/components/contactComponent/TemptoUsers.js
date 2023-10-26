import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getMessage, uploadMedia } from "../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";

const TemptoUsers = () => {
  const [users, setUsers] = useState([]);
  const [imageLink, setImageLink] = useState(null);
  const [loading, setLoading] = useState(false);
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
  const [selectTrue, setSelectedTrue] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [selectedData, setSelectedData] = useState([]);

  const handleFileChange = async(e)=>{
    if (e.target.files) {
      try {
        setLoading(true)
        const file = e.target.files[0];
        const link = await uploadMedia(file, "WhatsappTemplateImages")
        console.log(link)
        setImageLink(link)
        setLoading(false)
        toast.success("Image uplaoded!")
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
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
    setSelectedData(users);
    setSelectedTrue(!selectTrue);
  };

  const submit = async (e) => {
    e.preventDefault();
    if(loading){
      toast.error("Uploading image please wait...")
    }else{
    if (!selectedData) {
      return;
    }
    const { codes, numbers } = getCodeAndNumber();
    var data;
    if(imageLink!=null){
      data = {
       templateName: templateName,
       countryCodes: codes,
       numbers: numbers,
       image:imageLink
     };
   }else{
      data = {
      templateName: templateName,
      countryCodes: codes,
      numbers: numbers,
    };
    }
    try {
      if(imageLink!=null){
        const res = await fetch("https://server.reverr.io/sendwamutmimg", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        console.log(res);
        setImageLink(null)
        toast.success("Template send!")
      }else{
      const res = await fetch("https://server.reverr.io/sendwamutm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(res);
      toast.success("Template send!")
    }
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setTimeout(() => {
      setSelectedTrue(false);
      setTemplateName("");
      setSelectedData([]);
    }, 1000);
    }
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
            getOptionLabel={(option) =>
              `+` + option.id + (option.name ? ` (${option.name})` : "")
            }
            getOptionValue={(option) => option.id}
          />
        </div>
        <div className='input-feilds'>
          Select All Users
          <button type="button" onClick={selectAllUsers}>
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
          <input type='file' onChange={handleFileChange}/>
        </div>
        <button>Send Message</button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default TemptoUsers;

//hello_world
