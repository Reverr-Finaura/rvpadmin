import React, { useEffect, useState } from "react";
import "./contactComp.css";
import Select from "react-select";
import { database, getMessage, uploadMedia } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

const TempToUser = () => {
  const [templateName, setTemplateName] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [users, setUsers] = useState([]);
  const [singleChat, setSingleChat] = useState(null);
  const [imageLink, setImageLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [fileName, setFileName] = useState(null);

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

  // const lastMessage = singleChat?.messages[singleChat?.messages.length - 1];
  // const messageDate = new Date(
  //   lastMessage?.date?.seconds * 1000 + lastMessage?.date?.nanoseconds / 1e6
  // );
  // const currentDate = new Date();
  // const timeDifferenceInHours = (currentDate - messageDate) / (1000 * 60 * 60);
  // console.log(timeDifferenceInHours);
  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
  };

  const Reset = () => {
    setImageLink(null);
    setBtnDisable(false);
    setFileName("");
    setTemplateName("");
    setSelectedData(null);
  };
  const submit = async (e) => {
    e.preventDefault();

    if (loading) {
      toast.error("Uploading image please wait...");
    } else {
      if (!selectedData) {
        return;
      }
      var data;
      if (imageLink != null) {
        data = {
          templateName: templateName,
          countryCode: selectedData.id.slice(0, -10),
          number: selectedData.id.slice(-10),
          image: imageLink,
        };
      } else {
        data = {
          templateName: templateName,
          countryCode: selectedData.id.slice(0, -10),
          number: selectedData.id.slice(-10),
        };
      }
      setBtnDisable(true);
      // console.log(data)
      toast.success("Sending Template To users");
      try {
        if (imageLink != null) {
          const res = await fetch(
            "https://server.reverr.io/sendwatemplatemsgimg",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }
          );
          // console.log(res);
          Reset();
          toast.success("Template send!");
        } else {
          const res = await fetch(
            "https://server.reverr.io/sendwatemplatemsg",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }
          );
          // console.log(res);
          toast.success("Template send!");
          Reset();
        }
      } catch (error) {
        console.error("Error sending message:", error);
        Reset();
      }

      // setTimeout(() => {
      //   setTemplateName("");
      //   setSelectedData(null);
      // }, 1000);
    }
  };
  return (
    <div className='form-container'>
      <h3>Send Template to Mutiple user</h3>
      <form onSubmit={submit}>
        <div className='input-feilds'>
          <label>Select user</label>
          <Select
            isClearable
            className='basic-single'
            classNamePrefix='select'
            name='user'
            options={users}
            onChange={handleSelectChange} // Handle selection changes
            value={selectedData}
            getOptionLabel={(option) =>
              `+` + option.id + (option.name ? ` (${option.name})` : "")
            }
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
          <input type='file' value={fileName} onChange={handleFileChange} />
        </div>
        <button disabled={btnDisable}>Send Message</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default TempToUser;
