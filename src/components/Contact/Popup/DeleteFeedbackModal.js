import { Dialog, useMediaQuery, useTheme } from "@mui/material";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { database } from "../../../firebase/firebase";
import { toast } from "react-toastify";
import style from "./popup.module.css";
import close from "../../../utils/Image/Close.png";
import { MdDelete } from "react-icons/md";

const DeleteFeedbackModal = ({ docId, docPhone }) => {
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
  const deleteFeedback = async (e) => {
    e.preventDefault();
    try {
      setLoadings(true);
      await deleteDoc(doc(database, "Feedback", docId));
      toast.success("Feed has been successfully deleted");
      setLoadings(false);
      handleClose();
    } catch (error) {
      setLoadings(false);
    }
  };
  return (
    <React.Fragment>
      <MdDelete onClick={handleClickOpen}></MdDelete>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <div className={style.modalform}>
          <div className={style.modalheading}>
            <h3>Delete Feedback</h3>
            <img
              src={close}
              onClick={handleClose}
              alt="close"
              className={style.closeModal}
            />
          </div>
          <form>
            <p>Do you want to Delete this feedback of {docPhone} ? </p>
            <div className={style.deleteAgnetbutton}>
              <button
                disabled={loadings}
                onClick={(e) => deleteFeedback(e)}
                style={{
                  cursor: "pointer",
                }}
              >
                Yes
              </button>
              <button
                disabled={loadings}
                onClick={handleClose}
                style={{
                  backgroundColor: "transparent",
                  color: "black",
                  cursor: "pointer",
                }}
              >
                No
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default DeleteFeedbackModal;
