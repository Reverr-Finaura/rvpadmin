import { Dialog, useMediaQuery, useTheme } from "@mui/material";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { MdDelete } from "react-icons/md";
import { database } from "../../firebase/firebase";
import { toast } from "react-toastify";

const DeleteFeedbacl = ({ docId, docPhone }) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [loadings, setLoadings] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const deleteFeedback = async (id) => {
    try {
      setLoadings(true);
      await deleteDoc(doc(database, "Feedback", id));
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
        aria-labelledby='responsive-dialog-title'
      >
        <div className='edit-fotm'>
          <div className='manage-header'>
            <h3>DeleteAgent </h3>
            <button onClick={handleClose}>Close</button>
          </div>
          <form
            style={{
              display: "flex",
              alignItem: "center",
              justifyContent: "center",
            }}
          >
            <p>Do you want to this feedback of {docPhone} ? </p>
            <div
              style={{
                display: "flex",
                alignItem: "center",
                justifyContent: "space-between",
              }}
            >
              <button disabled={loadings} onClick={() => deleteFeedback(docId)}>
                Yes
              </button>
              <button disabled={loadings} onClick={handleClose}>
                No
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default DeleteFeedbacl;
