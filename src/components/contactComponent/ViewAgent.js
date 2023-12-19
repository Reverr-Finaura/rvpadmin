import * as React from "react";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { GrView } from "react-icons/gr";

const ViewAgent = ({ docId, docName, docEmail, docPassword }) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <GrView onClick={handleClickOpen}></GrView>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby='responsive-dialog-title'
      >
        <div className='edit-fotm'>
          <div className='manage-header'>
            <h3>View Agent Form</h3>
            <button onClick={handleClose}>Close</button>
          </div>
          <div>
            <p>docId : {docId}</p>
            <p>Name : {docName}</p>
            <p>Email : {docEmail}</p>
            <p>Password : {docPassword}</p>
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default ViewAgent;
