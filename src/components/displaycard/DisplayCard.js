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
import { deleteDeal, setSelectedDeal } from "../../redux/createDealSlice";
import {
  deleteInvestorDetailsInDatabse,
  deleteMedia,
} from "../../firebase/firebase";
import EditModal from "../editmodal/EditModal";
import { useState } from "react";

const DisplayCard = ({ data }) => {
  console.log(data);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const {
    dealDetails,
    dealDescription,
    id,
    pitchDeck,
    projection,
    Links,
    cardImages,
  } = data;
  const {
    date,
    firm,
    industry,
    name,
    raised,
    type,
    headquarter,
    noOfEmployees,
    sectorsOfInvestment,
    incorporationDate,
    preMoneyValuation,
    minimumInvestment,
  } = dealDetails;

  const { description, shortDesc } = dealDescription;
  const { docUrl } = pitchDeck;
  const { docUrl:projectionDocUrl } = projection;
  const { instagram, linkedIn, twitter, videoLink, website } = Links;
  const { bgImage, logo } = cardImages;

  return (
    <div className="display-card__wrap">
      {showModal && (
        <EditModal
          show={showModal}
          onClose={() => setShowModal(false)}
          uid={id}
          data={data}
        />
      )}
      <div className="display-card__card-actions">
        <Pen
          title="Click to Edit"
          onClick={() => {
            setShowModal(true);
            dispatch(setSelectedDeal(data));
          }}
          style={{ margin: "0.5rem" }}
        />
        <Trash
          title="Click to delete"
          onClick={() => {
            // console.log(id);
            deleteInvestorDetailsInDatabse(id);
            dispatch(deleteDeal(id));
            deleteMedia(docUrl);
            deleteMedia(projectionDocUrl);
            deleteMedia(bgImage.bgUrl);
            deleteMedia(logo.logoUrl);
          }}
          style={{ margin: "0.5rem" }}
        />
      </div>
      <br />
      <div className="deal-details">
        <div className="deal-details__top">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={logo.logoUrl}
              width="80px"
              height="80px"
              alt="logo"
              className="deal-details__logo"
            />
            &nbsp;&nbsp;
            <b>Name:</b>&nbsp;{name}
          </div>
          <div>
            <b>Date: </b> {date}
            <br />
            <b>Incorporation Date: </b> {incorporationDate}
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
        <div>
          <b>Headquarters: </b> {headquarter}
        </div>

        <div>
          <b>No. of employees: </b> {noOfEmployees}
        </div>
        <div>
          <b>Sectors of Investment: </b>{" "}
          {sectorsOfInvestment.map((data) => (
            <span className="sectors-of-investment">{data}</span>
          ))}
        </div>
        <div>
          <b>Pre money valuation: </b> {preMoneyValuation}
        </div>
        <div>
          <b>Minimum Investment: </b> {minimumInvestment}
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
        {docUrl!==""?<button
          onClick={() => {
            window.open(docUrl, "_blank");
          }}
          className="display-card__download-button"
        >
          Download
        </button>:"N/A"}
      </div>
      <br />
      <div className="projection">
        <b>Projection : </b>
        {projectionDocUrl!==""?<button
          onClick={() => {
            window.open(projectionDocUrl, "_blank");
          }}
          className="display-card__download-button"
        >
          Download
        </button>:"N/A"}
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
