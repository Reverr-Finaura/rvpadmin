import "./DisplayCard.css";
import {
  Trash,
  Pen,
  Instagram,
  Twitter,
  Linkedin,
  CameraReels,
  Globe,
} from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { deleteDeal } from "../redux/createDealSlice";
import {
  deleteInvestorDetailsInDatabse,
  deleteMedia,
} from "../firebase/firebase";
import EditModal from "./EditModal";
import { useState } from "react";

const DisplayCard = ({ data }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const {
    dealDetails,
    dealDescription,
    id,
    pitchDeck,
    projection,
    socialLinks,
    addedOn,
  } = data;
  const { date, firm, industry, name, raised, type } = dealDetails;
  const { description, shortDesc } = dealDescription;
  const { docName, docUrl } = pitchDeck;
  const { projectionDocName, projectionDocUrl } = projection;
  const { instagram, linkedIn, twitter, videoLink, website } = socialLinks;

  return (
    <div className="display-card__wrap">
      {showModal && (
        <EditModal
          show={showModal}
          onClose={() => setShowModal(false)}
          uid={id}
        />
      )}
      <div className="display-card__card-actions">
        <Pen
          title="Click to Edit"
          onClick={() => {
            // Edit Functionality
            setShowModal(true);
          }}
          style={{ margin: "0.5rem" }}
        />
        <Trash
          title="Click to delete"
          onClick={() => {
            console.log(id);
            deleteInvestorDetailsInDatabse(id);
            dispatch(deleteDeal(id));
            deleteMedia(docUrl);
            deleteMedia(projectionDocUrl);
          }}
          style={{ margin: "0.5rem" }}
        />
      </div>
      <br />
      <div className="deal-details">
        <div className="deal-details__top">
          <div>
            <b>Name :</b> {name}
          </div>
          <div>
            <b>Date: </b> {date}
          </div>
        </div>
        <br />
        <div>
          <b>Firm: </b> {firm}
        </div>
        <div>
          <b>Industry: </b> {industry}
        </div>

        <div>
          <b>Raised: </b> {raised}
        </div>
        <div>
          <b>Type: </b> {type}
        </div>
      </div>
      <br />
      <div style={{ textAlign: "justify" }}>
        <b>Short Description: </b>
        {shortDesc}
        <br />
        <br />
        <b>Description: </b>
        {description}
      </div>
      <br />
      <div className="pitch-deck">
        <b>Pitch : </b>
        <button
          onClick={() => {
            window.open(docUrl, "_blank");
          }}
          className="display-card__download-button"
        >
          Download
        </button>
      </div>
      <br />
      <div className="projection">
        <b>Projection : </b>
        <button
          onClick={() => {
            window.open(projectionDocUrl, "_blank");
          }}
          className="display-card__download-button"
        >
          Download
        </button>
      </div>
      <br />
      <br />
      <div className="social-links">
        <Instagram
          className="social-link"
          title="instagram"
          onClick={() => {
            window.open(instagram, "_blank");
          }}
        />
        <Twitter
          className="social-link"
          onClick={() => {
            window.open(twitter, "_blank");
          }}
        />
        <Linkedin
          className="social-link"
          onClick={() => {
            window.open(linkedIn, "_blank");
          }}
        />
        <CameraReels
          className="social-link"
          onClick={() => {
            window.open(videoLink, "_blank");
          }}
        />
        <Globe
          className="social-link"
          onClick={() => {
            window.open(website, "_blank");
          }}
        />
      </div>
    </div>
  );
};

export default DisplayCard;
