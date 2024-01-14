import { Dialog, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { GrView } from "react-icons/gr";

const ViewFeedback = ({
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
            <h3>View FeedBack</h3>
            <button onClick={handleClose}>Close</button>
          </div>
          <div>
            {Object.keys({
              docId,
              docPhone,
              docRecommendation,
              docReview,
              docExperience,
              docHighlights,
              docRating,
            }).map((key) => (
              <div key={key} className='property-row'>
                <p>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                  {eval(key)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default ViewFeedback;
