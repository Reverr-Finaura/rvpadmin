import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import React, { useEffect, useState } from "react";
import { database, getAllAgentsForLogin } from "../../firebase/firebase";
import { toast } from "react-toastify";
import Select from "react-select";
import "./contactComp.css";
import { arrayUnion, doc, getDoc, writeBatch } from "firebase/firestore";
import { useSelector } from "react-redux";

const ChatAssignedModal = ({
  selectedChatId,
  selectedChatName,
  selectedChatAssigned,
}) => {
  const user = useSelector((state) => state.user.user);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [agentslist, setAgentslist] = useState([]);
  const [selectedData, setSelectedData] = useState({
    name: selectedChatAssigned?.assignedTo?.name || " ",
    email: selectedChatAssigned?.assignedTo?.email || " ",
  });
  const [isAlreadyAssigned, setIsAlreadyAssigned] = useState(
    !!selectedChatAssigned?.isAssigned
  );
  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedData("");
    setIsAlreadyAssigned(!!selectedChatAssigned?.isAssigned);
  };

  useEffect(() => {
    const getAgents = async () => {
      try {
        const res = await getAllAgentsForLogin();
        if (res.length > 0) {
          setAgentslist(res);
        }
      } catch (error) {
        toast.error(error);
      }
    };

    getAgents();
  }, []);
  const assignHandler = async (e) => {
    e.preventDefault();

    if (!user.isAdmin) {
      toast.error("You're not an Admin");
      setSelectedData();
      handleClose();
      return;
    }

    const agentsDocRef = doc(database, "Agents", selectedData.email);
    const chatDocRef = doc(database, "WhatsappMessages", selectedChatId);

    const data = {
      number: selectedChatId,
      name: selectedChatName,
      chatRef: chatDocRef,
    };

    const notifyData = {
      text: `${selectedChatName} (+${
        selectedChatId.slice(0, -10) + "-" + selectedChatId.slice(-10)
      }) Chat is assigned to you`,
      path: "admin.reverr.io/contact",
      timestamp: new Date(),
      read: false,
    };

    const chatAssigned = {
      isAssigned: true,
      assignedTo: {
        email: selectedData.email,
        name: selectedData.name,
      },
    };
    try {
      const [agentsDocumentSnapshot, chatDocumentSnapshot] = await Promise.all([
        getDoc(agentsDocRef),
        getDoc(chatDocRef),
      ]);
      if (agentsDocumentSnapshot.exists() && chatDocumentSnapshot.exists()) {
        const assignedDoc = agentsDocumentSnapshot.data();
        // const chatDoc = chatDocumentSnapshot.data();
        const isDataAssigned = (assignedDoc.assignedChats || []).some(
          (chat) => chat.number === data.number
        );
        // const isAssigned = (chatDoc.chatAssigned || {}).isAssigned || false;
        if (!isDataAssigned) {
          const batch = writeBatch(database);

          batch.update(agentsDocRef, {
            assignedChats: arrayUnion(data),
            notification: arrayUnion(notifyData),
          });

          batch.update(chatDocRef, {
            chatAssigned: chatAssigned,
          });

          await batch.commit();
          toast.success("Successfully assigned");
        } else {
          toast.error("Alreaedy Assigned");
        }
      } else {
        toast.error("Agents document does not exist");
      }
    } catch (error) {
      console.error("Error updating assignedChat document:", error);
    }
    setSelectedData("");
    setIsAlreadyAssigned(false);
    handleClose();
  };

  return (
    <React.Fragment>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {selectedChatAssigned && selectedChatAssigned.isAssigned && (
          <span style={{ fontSize: "14px" }}>Already Assigned</span>
        )}
        <button onClick={handleClickOpen}>Assign To</button>
      </div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby='responsive-dialog-title'
      >
        {isAlreadyAssigned ? (
          <div className='edit-fotm '>
            <div className='manage-header'>
              <h3>Agent that Assigned</h3>
              <button onClick={handleClose}>Close</button>
            </div>
            <div>
              <p>Already Assigned</p>
              <button onClick={() => setIsAlreadyAssigned(false)}>
                Change Assigned Agnet
              </button>
            </div>
          </div>
        ) : (
          <div className='edit-fotm'>
            <div className='manage-header'>
              <h3>Add Agent Form</h3>
              <button onClick={handleClose}>Close</button>
            </div>
            <form onSubmit={assignHandler}>
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
        )}
      </Dialog>
    </React.Fragment>
  );
};

export default ChatAssignedModal;
