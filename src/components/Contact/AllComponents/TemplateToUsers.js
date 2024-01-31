import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { database, uploadMedia } from "../../../firebase/firebase";
import style from "./style.module.css";
import Select from "react-select";
import { selectStyles } from "../../../utils";
import uploadicon from "../../../utils/Image/upload.png";

const TemplateToUsers = () => {
  const user = useSelector((state) => state.user.user);
  const adminChats = useSelector((state) => state.contact.allAdminChats);
  const agentsChats = useSelector((state) => state.contact.allAgentsChats);
  const [imageLink, setImageLink] = useState(null);
  const [videoLink, setVideoLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [filename, setFilename] = useState(null);
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
        setFilename(fileURL.name);
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
        toast.success("Media uploaded!");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
  };
  const Reset = () => {
    setImageLink(null);
    setBtnDisable(false);
    setFilename("");
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
    setLoading(true);
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
          countryCodes: codes,
          numbers: numbers,
          video: videoLink,
        };
      } else if (imageLink != null) {
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
      toast.success("Sending Template To users");
      try {
        if (videoLink != null && imageLink === null) {
          await fetch("https://server.reverr.io/sendwamutmvideo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          toast.success("Template send!");
        } else if (imageLink != null && videoLink === null) {
          await fetch("https://server.reverr.io/sendwamutmimg", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          toast.success("Template send!");
        } else {
          await fetch("https://server.reverr.io/sendwamutm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          toast.success("Template send!");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        Reset();
        setBtnDisable(false);
        setLoading(false);
      }
    }
  };
  return (
    <div className={style.container}>
      <div className={style.heading}>
        <h3>Send Template to Multiple Users</h3>
      </div>
      <form>
        <div className={style.inputField}>
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
            styles={selectStyles}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.label}
          />
        </div>
        <div className={style.inputField}>
          <label>Select Mutiple user</label>
          <Select
            isMulti
            name='colors'
            options={user.isAdmin ? adminChats : agentsChats}
            className='basic-multi-select'
            classNamePrefix='select'
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
          <button type='button' onClick={selectAllUsers}>
            {selectTrue === true
              ? "All user are selected"
              : "All user are not selected"}
          </button>
        </div>
        <div className={style.inputField}>
          <label>Template</label>
          <textarea
            rows={8}
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          ></textarea>
        </div>
        <div className={style.inputField}>
          <label htmlFor='templateUser' className={style.fileUpload}>
            <div className={style.fileuploadContent}>
              <img src={uploadicon} alt='' />
              <p> Upload file {filename && `: ${filename.substring(0, 20)}`}</p>
            </div>
          </label>
          <input
            type='file'
            onChange={handleFileChange}
            id='templateUser'
            style={{ display: "none" }}
          />
        </div>
        <div className={style.formbutton}>
          <button disabled={btnDisable} onClick={submit}>
            Send Template
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default TemplateToUsers;
