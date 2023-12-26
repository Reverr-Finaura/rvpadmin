import { Dialog, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { MdDelete } from "react-icons/md";
import { database } from "../../firebase/firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const DeleteAgent = ({ setdata, docEmail, docName }) => {
  const user = useSelector((state) => state.user.user);
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
  const deleteAgnet = async (email) => {
    try {
      setLoadings(true);
      const agentRef = doc(database, "Agents", email);
      const agentDoc = await getDoc(agentRef);
      const agentData = agentDoc.data();
      if (agentData && user.isAdmin) {
        await deleteDoc(agentRef);
        setdata((prevData) => prevData.filter((item) => item.email !== email));
        toast.success("Agent has been successfully deleted");
      } else {
        toast.error("Agent not found");
      }
      setLoadings(false);
    } catch (error) {
      setLoadings(false);
      console.log(error.message);
      toast.error(error.message);
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
            <p>Do you want to this delete agent {docName} ? </p>
            <div
              style={{
                display: "flex",
                alignItem: "center",
                justifyContent: "space-between",
              }}
            >
              <button disabled={loadings} onClick={() => deleteAgnet(docEmail)}>
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

export default DeleteAgent;
