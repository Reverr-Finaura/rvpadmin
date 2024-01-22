import React, { useState } from "react";
import style from "./style.module.css";
import Select from "react-select";
import { useSelector } from "react-redux";
import { selectStyles } from "../../../utils";
import { toast } from "react-toastify";
import { uploadMedia } from "../../../firebase/firebase";

const TemplateToUser = () => {
  const user = useSelector((state) => state.user.user);
  const adminChats = useSelector((state) => state.contact.allAdminChats);
  const agentsChats = useSelector((state) => state.contact.allAgentsChats);
  const [templateName, setTemplateName] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [imageLink, setImageLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [videoLink, setVideoLink] = useState(null);
  const [filename, setFilename] = useState(null);

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
    setFilename("");
    setTemplateName("");
    setSelectedData(null);
    setVideoLink(null);
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
      if (videoLink !== null) {
        data = {
          templateName: templateName,
          countryCode: selectedData.id.slice(0, -10),
          number: selectedData.id.slice(-10),
          video: videoLink,
        };
      } else if (imageLink != null) {
        console.log(imageLink);
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
      toast.success("Sending Template To users");
      try {
        if (videoLink != null && imageLink === null) {
          await fetch("https://server.reverr.io/sendwatemplatemsgvideo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          Reset();
          toast.success("Template send!");
        } else if (imageLink != null && videoLink === null) {
          const res = await fetch(
            "https://server.reverr.io/sendwatemplatemsgimg",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }
          );
          console.log(res);
          Reset();
          toast.success("Template send!");
        } else {
          await fetch("https://server.reverr.io/sendwatemplatemsg", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          toast.success("Template send!");
          Reset();
        }
      } catch (error) {
        console.error("Error sending message:", error);
        Reset();
      }
    }
  };
  return (
    <div className={style.container}>
      <div className={style.heading}>
        <h3>Send Template to single user</h3>
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
              <button>Select file</button>
              <p> Upload file {filename && `: ${filename}`}</p>
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
          <button disabled={btnDisable}>Send Message</button>
        </div>
      </form>
    </div>
  );
};

export default TemplateToUser;
