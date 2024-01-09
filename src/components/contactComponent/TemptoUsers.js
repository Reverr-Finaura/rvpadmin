import React, { useEffect, useState } from "react";
import Select from "react-select";
import { database, uploadMedia } from "../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

const TemptoUsers = () => {
  const user = useSelector((state) => state.user.user);
  const adminChats = useSelector((state) => state.contact.allAdminChats);
  const agentsChats = useSelector((state) => state.contact.allAgentsChats);
  const [imageLink, setImageLink] = useState(null);
  const [videoLink, setVideoLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [tags, setTags] = useState({});
  const [selectedTags, setSelectedTags] = useState();

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

  const [selectTrue, setSelectedTrue] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [selectedData, setSelectedData] = useState([]);

  const handleFileChange = async (e) => {
    if (e.target.files) {
      try {
        setLoading(true);
        const fileURL = e.target.files[0];
        const checkFileType = fileURL.type;
        if (checkFileType.startsWith("image/")) {
          const link = await uploadMedia(fileURL, "WhatsappTemplateImages");
          setImageLink(link);
          setVideoLink(null);
        } else if (checkFileType.startsWith("video/")) {
          const link = await uploadMedia(fileURL, "WhatsappTemplateImages");
          setVideoLink(link);
          setImageLink(null);
        }
        setFileName(e.target.value);
        setLoading(false);
        toast.success("Media uploaded!");
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
    setVideoLink(null);
  };
  const getCodeAndNumber = () => {
    const codes = selectedData.map((item) => item.id.slice(0, -10));
    const numbers = selectedData.map((item) => item.id.slice(-10));
    return {
      codes,
      numbers,
    };
  };
  const selectAllUsers = () => {
    if (!selectTrue) {
      setSelectedData(user.isAdmin ? adminChats : agentsChats);
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
      if (videoLink !== null) {
        data = {
          templateName: templateName,
          countryCode: codes,
          numbers: numbers,
          video: videoLink,
        };
      } else if (imageLink != null) {
        data = {
          templateName: templateName,
          countryCode: codes,
          numbers: numbers,
          image: imageLink,
        };
      } else {
        data = {
          templateName: templateName,
          countryCode: codes,
          numbers: numbers,
        };
      }
      setBtnDisable(true);
      toast.success("Sending Template To users");
      try {
        if (videoLink != null && imageLink === null) {
          await fetch("https://server.reverr.io/sendwamutmvideo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          Reset();
          toast.success("Template send!");
        } else if (imageLink != null && videoLink === null) {
          await fetch("https://server.reverr.io/sendwamutmimg", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          Reset();
          toast.success("Template send!");
        } else {
          await fetch("https://server.reverr.io/sendwamutm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          Reset();
          toast.success("Template send!");
        }
      } catch (error) {
        Reset();
        console.error("Error sending message:", error);
      }
    }
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
            options={user.isAdmin ? adminChats : agentsChats}
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
