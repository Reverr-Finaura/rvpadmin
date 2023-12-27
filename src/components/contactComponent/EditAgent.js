import * as React from "react";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { database } from "../../firebase/firebase";
import "./contactComp.css";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { MdModeEdit } from "react-icons/md";
import Select from "react-select";
import { useSelector } from "react-redux";

const EditAgent = ({ docId, docName, docChatAssigned }) => {
  const editAgentsChats = useSelector((state) => state.contact.editAgentsChats);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
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
      setLoadings(false);
    } catch (error) {
      setLoadings(false);
      console.error(error);
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
        <div className='edit-fotm'>
          <div className='manage-header'>
            <h3>Edit Agent Form</h3>
            <button onClick={handleClose}>Close</button>
          </div>
          <form onSubmit={submit}>
            <div className='input-feilds'>
              <label>Name</label>
              <input
                type='type'
                placeholder='Enter a Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='input-feilds'>
              <label>Assigned user</label>
              <Select
                isMulti
                name='colors'
                options={editAgentsChats}
                className='basic-multi-select'
                classNamePrefix='select'
                onChange={handleSelectChange}
                value={selectedData}
                getOptionLabel={(option) =>
                  `+` + option.number + (option.name ? ` (${option.name})` : "")
                }
                getOptionValue={(option) => option.id || option.number}
              />
            </div>
            <div className='input-feilds'>
              <button disabled={loadings}>Edit Agent</button>
            </div>
          </form>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default EditAgent;
