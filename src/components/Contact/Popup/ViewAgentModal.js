import { Dialog, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { GrView } from "react-icons/gr";
import style from "./popup.module.css";
import close from "../../../utils/Image/Close.png";

const ViewAgentModal = ({
  docId,
  docName,
  docEmail,
  docPassword,
  docChatAssigned,
}) => {
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
  return (
    <React.Fragment>
      <GrView onClick={handleClickOpen}></GrView>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <div className={style.modalform}>
          <div className={style.modalheading}>
            <h3>View Agent</h3>
            <img
              src={close}
              onClick={handleClose}
              alt="close"
              className={style.closeModal}
            />
          </div>
          <div className={style.Info}>
            <p>
              Name : <span className={style.infobox}>{docName}</span>
            </p>
            <p>
              Email : <span className={style.infobox}>{docEmail}</span>
            </p>
            <p>
              Password : <span className={style.infobox}>{docPassword}</span>
            </p>
            <p>Assigned :</p>
            <ul className={style.list}>
              {docChatAssigned &&
                docChatAssigned.map((item, index) => (
                  <li key={index}>
                    <p className={style.infobox}>
                      {item.name} <span>({item.number})</span>
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default ViewAgentModal;
