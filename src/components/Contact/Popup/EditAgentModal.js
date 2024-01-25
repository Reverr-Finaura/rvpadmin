import { Dialog, useMediaQuery, useTheme } from "@mui/material";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { database } from "../../../firebase/firebase";
import ReactSelect from "react-select";
import { MdModeEdit } from "react-icons/md";
import close from "../../../utils/Image/Close.png";
import style from "./popup.module.css";
import { selectStyles2, selectStyles3 } from "../../../utils";

const EditAgentModal = ({ docId, docName, docChatAssigned }) => {
  const editAgentsChats = useSelector((state) => state.contact.editAgentsChats);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleClickOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };
  const handleClose = (e) => {
    e.preventDefault();
    setOpen(false);
  };
  const [name, setName] = React.useState(docName);
  const [loadings, setLoadings] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState(docChatAssigned);
  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Fill all fields");
      return;
    }
    setLoadings(true);
    const data = {
      name: name,
      isAgent: true,
      assignedChats: selectedData.map((item) => ({
        number: item.number,
        name: item.name,
        chatRef: doc(database, "WhatsappMessages", item.id || item.number),
      })),
      notification: selectedData.map((item) => ({
        text: `${item.name} (+${
          item.number.slice(0, -10) + "-" + item.number.slice(-10)
        }) Chat is assigned to you`,
        path: "admin.reverr.io/contact",
        number: item.number,
        timestamp: new Date(),
        read: false,
      })),
    };
    console.log(data);
    try {
      await updateDoc(doc(database, "Agents", docId), {
        ...data,
        notification: arrayUnion(...data.notification),
      });
      toast.success("User has been successfully added");
    } catch (error) {
      console.error(error);
    } finally {
      setLoadings(false);
    }
    handleClose();
  };

  return (
    <React.Fragment>
      <MdModeEdit onClick={handleClickOpen}></MdModeEdit>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby='responsive-dialog-title'
      >
        <div className={style.modalform}>
          <div className={style.modalheading}>
            <h3>Edit Agent</h3>
            <img
              src={close}
              onClick={handleClose}
              alt='close'
              className={style.closeModal}
            />
          </div>
          <form onSubmit={submit}>
            <div className={style.inputField}>
              <label>Name</label>
              <input
                type='type'
                placeholder='Enter a Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={style.inputField} style={{ height: "150px" }}>
              <label>Assigned user</label>
              <ReactSelect
                isMulti
                name='colors'
                options={editAgentsChats}
                className='basic-multi-select'
                classNamePrefix='select'
                onChange={handleSelectChange}
                value={selectedData}
                styles={selectStyles3}
                getOptionLabel={(option) =>
                  `+` + option.number + (option.name ? ` (${option.name})` : "")
                }
                getOptionValue={(option) => option.id || option.number}
              />
            </div>
            <div className={style.formbutton}>
              <button disabled={loadings}>Edit</button>
            </div>
          </form>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default EditAgentModal;
