import { Dialog, useMediaQuery, useTheme } from "@mui/material";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { useSelector } from "react-redux";
import { database } from "../../../firebase/firebase";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import style from "./popup.module.css";
import close from "../../../utils/Image/Close.png";

const DeleteAgentModal = ({ docEmail, docName }) => {
  const user = useSelector((state) => state.user.user);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [loadings, setLoadings] = React.useState(false);
  const handleClickOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setOpen(false);
  };
  const deleteAgent = async (e) => {
    e.preventDefault();
    try {
      setLoadings(true);
      const agentDoc = await getDoc(doc(database, "Agents", docEmail));
      const agentData = agentDoc.data();
      if (agentData && user.isAdmin) {
        const assignedChatsList = agentData.assignedChats || [];
        const deleteAssignedChats = assignedChatsList.map(async (chat) => {
          try {
            const chatDocRef = doc(database, "WhatsappMessages", chat.number);
            await updateDoc(chatDocRef, {
              chatAssigned: {
                assignedTo: null,
                isAssigned: false,
              },
            });
          } catch (error) {
            console.error("Error in updating chat:", error);
            throw error;
          }
        });
        await Promise.allSettled(deleteAssignedChats);
        await deleteDoc(doc(database, "Agents", docEmail));
        toast.success("Agent has been successfully deleted");
      } else {
        toast.error("Agent not found or user is not an admin");
      }
    } catch (error) {
      console.error("Error in deleteAgent:", error);
      toast.error("Failed to delete agent. Please try again.");
    } finally {
      setLoadings(false);
      handleClose(e);
    }
  };
  return (
    <React.Fragment>
      <MdDelete
        onClick={handleClickOpen}
        style={{
          cursor: "pointer",
        }}
      ></MdDelete>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <div className={style.modalform}>
          <div className={style.modalheading}>
            <h3>Delete Agent</h3>
            <img
              src={close}
              onClick={handleClose}
              alt="close"
              className={style.closeModal}
            />
          </div>
          <form>
            <p>Do you want to this delete agent {docName} ? </p>
            <div className={style.deleteAgnetbutton}>
              <div
                className={style.yesButton}
                disabled={loadings}
                onClick={(e) => deleteAgent(e)}
              >
                Yes
              </div>
              <div
                className={style.yesButton}
                disabled={loadings}
                onClick={handleClose}
                style={{ backgroundColor: "transparent", color: "black" }}
              >
                No
              </div>
            </div>
          </form>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default DeleteAgentModal;
