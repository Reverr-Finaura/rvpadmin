import { Dialog, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { GrView } from "react-icons/gr";
import style from "./popup.module.css";
import close from "../../../utils/Image/Close.png";

const ViewFeedbackModal = ({
  docId,
  docPhone,
  docRecommendation,
  docReview,
  docExperience,
  docHighlights,
  docRating,
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
        aria-labelledby='responsive-dialog-title'
      >
        <div className={style.modalform}>
          <div className={style.modalheading}>
            <h3>View Feedback</h3>
            <img src={close} onClick={handleClose} alt='close' />
          </div>
          <div className={style.Info}>
            {Object.keys({
              docId,
              docPhone,
              docRecommendation,
              docReview,
              docExperience,
              docHighlights,
              docRating,
            }).map((key) => (
              <p key={key}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                <span className={style.infobox}>{eval(key)}</span>
              </p>
            ))}
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default ViewFeedbackModal;
