import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import React, { useEffect, useState } from "react";
import { database, getAllAgents } from "../../firebase/firebase";
import { toast } from "react-toastify";
import Select from "react-select";
import "./contactComp.css";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

const ChatAssignedModal = ({ selectedChat }) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [agentslist, setAgentslist] = useState([]);
  const [selectedData, setSelectedData] = useState("");
  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
  };
  useEffect(() => {
    const getAgents = async () => {
      try {
        const res = await getAllAgents();
        if (res.length > 0) {
          setAgentslist(res);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    getAgents();
  }, []);
  let dummy = "ashutoshagent@gmail.com";
  let isAdmin = true;
  const assignHandleer = async (e) => {
    e.preventDefault();
    const chatRef = doc(database, "WhatsappMessages", selectedChat.id);
    const data = {
      number: selectedChat.id,
      chatRef: chatRef,
    };
    const notifyData = {
      text: `${selectedChat.name} ${selectedChat.id} Chat is assigned to ${dummy}`,
      chatInfo: data,
      path: "admin.reverr/contact",
      timestamp: new Date(),
      read: false,
    };
    if (isAdmin) {
      try {
        const agentsDocumentRef = doc(database, "Agents", dummy);
        const agentsDocumentSnapshot = await getDoc(agentsDocumentRef);

        if (agentsDocumentSnapshot.exists()) {
          const assignedDoc = agentsDocumentSnapshot.data();
          const isDataAssigned = assignedDoc.assignedChats
            ? assignedDoc.assignedChats.some(
                (chat) => chat.number === data.number
              )
            : false;

          if (!isDataAssigned) {
            await updateDoc(agentsDocumentRef, {
              assignedChats: arrayUnion(data),
              notification: arrayUnion(notifyData),
            });
          }
        } else {
          console.error("Agents document does not exist");
        }
      } catch (error) {
        console.error("Error updating assignedChat document:", error);
      }
    } else {
      toast.error("Your not a Admin");
    }
    setSelectedData("");
    handleClose();
  };

  return (
    <React.Fragment>
      <button onClick={handleClickOpen}>Assign To</button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby='responsive-dialog-title'
      >
        <div className='edit-fotm'>
          <div className='manage-header'>
            <h3>Add Agent Form</h3>
            <button onClick={handleClose}>Close</button>
          </div>
          <form onSubmit={assignHandleer}>
            <div className='input-feilds'>
              <label>Select user</label>
              <Select
                isClearable
                className='basic-single'
                classNamePrefix='select'
                name='edituser'
                options={agentslist}
                onChange={handleSelectChange}
                value={selectedData}
                getOptionLabel={(option) =>
                  option.name ? ` ${option.name}` : ""
                }
                getOptionValue={(option) => option.email}
              />
            </div>
            <div className='input-feilds'>
              <button>Assigned</button>
            </div>
          </form>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default ChatAssignedModal;
