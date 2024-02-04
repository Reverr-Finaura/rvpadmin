import { Dialog, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import style from "./popup.module.css";
import {
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { database, getAllAgentsForLogin } from "../../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import ReactSelect from "react-select";
import close from "../../../utils/Image/Close.png";

const AssignedModal = ({
  selectedChatId,
  selectedChatName,
  selectedChatAssigned,
}) => {
  const user = useSelector((state) => state.user.user);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [loadings, setLoadings] = React.useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [agentslist, setAgentslist] = useState([]);
  const [selectedData, setSelectedData] = useState({
    name:
      selectedChatAssigned && selectedChatAssigned.assignedTo
        ? selectedChatAssigned.assignedTo.name
        : " ",
    email:
      selectedChatAssigned && selectedChatAssigned.assignedTo
        ? selectedChatAssigned.assignedTo.email
        : " ",
  });
  const [isAlreadyAssigned, setIsAlreadyAssigned] = useState(
    selectedChatAssigned && selectedChatAssigned.isAssigned
  );

  useEffect(() => {
    setSelectedData({
      name:
        selectedChatAssigned && selectedChatAssigned.assignedTo
          ? selectedChatAssigned.assignedTo.name
          : " ",
      email:
        selectedChatAssigned && selectedChatAssigned.assignedTo
          ? selectedChatAssigned.assignedTo.email
          : " ",
    });
    setIsAlreadyAssigned(
      selectedChatAssigned && selectedChatAssigned.isAssigned
    );
  }, [selectedChatAssigned]);

  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedData({});
    setIsAlreadyAssigned(
      selectedChatAssigned && selectedChatAssigned.isAssigned
    );
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
  const removeAssginedAgents = async (e) => {
    e.preventDefault();
    setLoadings(true);
    if (!user.isAdmin) {
      toast.error("You're not an Admin");
      handleClose();
      return;
    }
    const agentsDocRef = doc(database, "Agents", selectedData.email);
    const chatDocRef = doc(database, "WhatsappMessages", selectedChatId);
    try {
      await updateDoc(chatDocRef, {
        chatAssigned: {
          assignedTo: null,
          isAssigned: false,
        },
      });

      const agentData = (await getDoc(agentsDocRef)).data();
      if (agentData.assignedChats.length > 0) {
        await updateDoc(agentsDocRef, {
          assignedChats: agentData.assignedChats.filter(
            (x) => x.number !== selectedChatId
          ),
        });
      }
      toast.success("Assigned Agent has been successfully removed");
    } catch (error) {
      console.error("Error in deleteAgent:", error);
      toast.error("Failed to remove assigend agent. Please try again.");
    } finally {
      handleClose();
      setLoadings(false);
    }
  };
  const assignHandler = async (e) => {
    e.preventDefault();
    setLoadings(true);
    if (!user.isAdmin) {
      toast.error("You're not an Admin");
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
      number: selectedChatId,
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
    } finally {
      setLoadings(false);
    }
    setSelectedData("");
    setIsAlreadyAssigned(false);
    handleClose();
  };
  return (
    <React.Fragment>
      <div
        className={style.assigendButton}
        onClick={handleClickOpen}
        style={{
          cursor: "pointer",
        }}
      >
        <p>Assign To</p>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
        >
          <path
            d='M7.00684 12.0008C7.00684 11.8019 7.08585 11.6111 7.22651 11.4705C7.36716 11.3298 7.55792 11.2508 7.75684 11.2508H11.2498V7.75781C11.2498 7.5589 11.3289 7.36813 11.4695 7.22748C11.6102 7.08683 11.8009 7.00781 11.9998 7.00781C12.1987 7.00781 12.3895 7.08683 12.5302 7.22748C12.6708 7.36813 12.7498 7.5589 12.7498 7.75781V11.2508H16.2428C16.4417 11.2508 16.6325 11.3298 16.7732 11.4705C16.9138 11.6111 16.9928 11.8019 16.9928 12.0008C16.9928 12.1997 16.9138 12.3905 16.7732 12.5311C16.6325 12.6718 16.4417 12.7508 16.2428 12.7508H12.7498V16.2438C12.7498 16.4427 12.6708 16.6335 12.5302 16.7741C12.3895 16.9148 12.1987 16.9938 11.9998 16.9938C11.8009 16.9938 11.6102 16.9148 11.4695 16.7741C11.3289 16.6335 11.2498 16.4427 11.2498 16.2438V12.7508H7.75684C7.55792 12.7508 7.36716 12.6718 7.22651 12.5311C7.08585 12.3905 7.00684 12.1997 7.00684 12.0008Z'
            fill='#1C1D22'
          />
          <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M7.31684 3.76855C10.4293 3.42351 13.5704 3.42351 16.6828 3.76855C18.5098 3.97255 19.9848 5.41155 20.1988 7.24855C20.5688 10.4055 20.5688 13.5945 20.1988 16.7515C19.9838 18.5885 18.5088 20.0265 16.6828 20.2315C13.5704 20.5766 10.4293 20.5766 7.31684 20.2315C5.48984 20.0265 4.01484 18.5885 3.80084 16.7515C3.43162 13.5946 3.43162 10.4055 3.80084 7.24855C4.01484 5.41155 5.49084 3.97255 7.31684 3.76855ZM16.5168 5.25855C13.5147 4.92578 10.485 4.92578 7.48284 5.25855C6.92708 5.3202 6.40834 5.56742 6.01042 5.96026C5.6125 6.35311 5.35863 6.86863 5.28984 7.42355C4.93419 10.4645 4.93419 13.5366 5.28984 16.5775C5.35884 17.1323 5.6128 17.6476 6.0107 18.0402C6.40861 18.4329 6.92723 18.6799 7.48284 18.7415C10.4598 19.0735 13.5398 19.0735 16.5168 18.7415C17.0723 18.6797 17.5907 18.4326 17.9884 18.0399C18.3861 17.6473 18.6399 17.1321 18.7088 16.5775C19.0645 13.5366 19.0645 10.4645 18.7088 7.42355C18.6397 6.86914 18.3858 6.35419 17.9881 5.96177C17.5904 5.56935 17.0721 5.32232 16.5168 5.26055'
            fill='#1C1D22'
          />
        </svg>
      </div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby='responsive-dialog-title'
      >
        {isAlreadyAssigned ? (
          <div className={style.modalform}>
            <div className={style.modalheading}>
              <h3>Agent that Assigned</h3>
              <img
                src={close}
                onClick={handleClose}
                alt='close'
                className={style.closeModal}
              />
            </div>
            <div className={style.already}>
              <p>Already Assigned</p>
              <div className={style.assigendButton}>
                <button onClick={() => setIsAlreadyAssigned(false)}>
                  Change Assigned Agent
                </button>
                <button
                  disabled={loadings}
                  onClick={(e) => removeAssginedAgents(e)}
                  style={{ backgroundColor: "red" }}
                >
                  Remove Assigned Agent
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={style.modalform}>
            <div className={style.modalheading}>
              <h3>Add Agent Form</h3>
              <img src={close} onClick={handleClose} alt='close' />
            </div>
            <form onSubmit={assignHandler}>
              <div className={style.inputField}>
                <label>Select user</label>
                <ReactSelect
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
              <div className={style.formbutton}>
                <button disabled={loadings}>Assigned</button>
              </div>
            </form>
          </div>
        )}
        <ToastContainer />
      </Dialog>
    </React.Fragment>
  );
};

export default AssignedModal;
