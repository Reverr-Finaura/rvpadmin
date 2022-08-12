import { useDispatch, useSelector } from "react-redux";
import "./EditModal.css";
import { useState, useEffect } from "react";
import {
  updateInvestorDetailsInDatabase,
  uploadMedia,
  getInvestorDealsFromDatabase,
} from "../firebase/firebase";
import { updateDeal } from "../redux/createDealSlice";
import { HourglassSplit } from "react-bootstrap-icons";

const EditModal = (props) => {
  const dispatch = useDispatch();
  const investorDeals = useSelector((state) => state.investorDeals);

  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [raised, setRaised] = useState("");
  const [type, setType] = useState("");
  const [firm, setFirm] = useState("");
  const [date, setDate] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [website, setWebsite] = useState("");
  const [pitchDeckMedia, setPitchDeckMedia] = useState("");
  const [projectionMedia, setProjectionMedia] = useState("");

  const [dealsUpdateLoading, setDealsUpdateLoading] = useState(false);

  if (!props.show) {
    return null;
  }

  const onUpdateDealClickHandler = async () => {
    setDealsUpdateLoading(true);
    try {
      const pitchDeckUrl = await uploadMedia(pitchDeckMedia);
      const projectionUrl = await uploadMedia(projectionMedia);
      const dealData = {
        id: props.uid,
        dealDetails: {
          name,
          industry,
          date,
          raised,
          firm,
          type,
        },

        pitchDeck: { docName: pitchDeckMedia.name, docUrl: pitchDeckUrl },
        projection: { docName: projectionMedia.name, docUrl: projectionUrl },
        dealDescription: {
          shortDesc,
          description,
        },
        socialLinks: {
          instagram,
          linkedIn,
          twitter,
          website,
          videoLink,
        },
      };

      await updateInvestorDetailsInDatabase(props.uid, dealData);
      console.log("updated");
      setDealsUpdateLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="edit-modal">
      <div className="edit-modal__content">
        <div className="edit-modal__header">
          <h4 className="edit-modal__title">Edit Investor Deal</h4>
        </div>
        <div className="edit-modal__body">
          <div className="main__deal">
            <form>
              <fieldset>
                <legend>Deal Deatails</legend>
                <input
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                />
                <input
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Industry"
                />
                <input
                  onChange={(e) => setRaised(e.target.value)}
                  placeholder="Raised"
                />
                <input
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Type"
                />
                <input
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  placeholder="Funded"
                />
                <input
                  onChange={(e) => setFirm(e.target.value)}
                  placeholder="Firm"
                />
              </fieldset>
            </form>

            <form>
              <fieldset>
                <legend>Deal Description</legend>
                <textarea
                  onChange={(e) => setShortDesc(e.target.value)}
                  rows="3"
                  placeholder="Short_desc"
                />
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  rows="8"
                  placeholder="Description"
                />
              </fieldset>
            </form>

            <form>
              <fieldset>
                <legend>Media</legend>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setPitchDeckMedia(e.target.files[0]);
                    }
                  }}
                  placeholder="Pitchdeck"
                />
                <input
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setProjectionMedia(e.target.files[0]);
                    }
                  }}
                  type="file"
                  placeholder="Projections"
                />
              </fieldset>
            </form>

            <form>
              <fieldset>
                <legend>Social Links</legend>
                <input
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="Instagram"
                />
                <input
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="Twitter"
                />
                <input
                  onChange={(e) => setLinkedIn(e.target.value)}
                  placeholder="LinkedIn"
                />
                <input
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="Video_link"
                />
                <input
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Website_link"
                />
              </fieldset>
            </form>
          </div>
        </div>
        <div className="edit-modal__footer">
          {dealsUpdateLoading && (
            <div className="loading-state">
              <HourglassSplit />
            </div>
          )}
          <br />
          <div>
            <button
              onClick={onUpdateDealClickHandler}
              className="edit-modal__button"
            >
              Update Investor Deals
            </button>
            <button onClick={props.onClose} className="edit-modal__button">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
