import { useDispatch, useSelector } from "react-redux";
import "./EditModal.css";
import { useState, useEffect } from "react";
import {
  updateInvestorDetailsInDatabase,
  uploadMedia,
  getInvestorDealsFromDatabase,
} from "../../firebase/firebase";
import { HourglassSplit } from "react-bootstrap-icons";
import { dateGenerator } from "../../utils/dategenerator";
import AddFaq from "../../components/addfaq/AddFaq";
import AddHighlight from "../../components/addHighlights/AddHighlight";
import AddInvestor from "../../components/addInvestor/AddInvestor";
import AddFounder from "../../components/addfounder/AddFounder";
import AddAdvisor from "../../components/addAdvisor/AddAdvisor";
import { setInvestorDeals } from "../../redux/createDealSlice";

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
  const [logo, setLogo] = useState("");
  const [bgImg, setBgImg] = useState("");
  const [due_Diligence, setDue_Dilligence] = useState(false);

  const [dealsUpdateLoading, setDealsUpdateLoading] = useState(false);

  if (!props.show) {
    return null;
  }

  const getUpdatedInvestorDeals = async () => {
    const results = await getInvestorDealsFromDatabase();
    if (results.length) {
      dispatch(setInvestorDeals([...results]));
    }
  };

  const onUpdateDealClickHandler = async () => {
    setDealsUpdateLoading(true);
    const { investors, founders, advisors, faqs, dealHighlight } =
      investorDeals;
    try {
      const pitchDeckUrl = await uploadMedia(
        pitchDeckMedia,
        "rvpDeal/pitchDecFiles"
      );
      const projectionUrl = await uploadMedia(
        projectionMedia,
        "rvpDeal/projectionFiles"
      );
      const logoImg = await uploadMedia(logo, "rvpDeal/cardImg/logoImg");
      const bagdImg = await uploadMedia(bgImg, "rvpDeal/cardImg/backgroundImg");
      const dealUpdatedData = {
        id: props.uid,
        dealDetails: {
          name,
          industry,
          date,
          raised,
          firm,
          type,
        },
        due_Diligence,
        pitchDeck: { docName: pitchDeckMedia.name, docUrl: pitchDeckUrl },
        projection: { docName: projectionMedia.name, docUrl: projectionUrl },
        dealDescription: {
          shortDesc,
          description,
        },
        faqs,
        founders,
        advisors,
        dealHighlight,
        investors,
        Links: {
          instagram,
          linkedIn,
          twitter,
          website,
          videoLink,
        },
        cardImages: {
          logo: { name: logo.name, logoUrl: logoImg },
          bgImage: { name: bgImg.name, bgUrl: bagdImg },
        },
      };

      await updateInvestorDetailsInDatabase(props.uid, dealUpdatedData);
      console.log("updated");
      getUpdatedInvestorDeals();
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
                <legend>File</legend>
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
                <legend>Card Images</legend>
                <input
                  type="file"
                  onChange={(e) => {
                    const newDate = dateGenerator();
                    if (e.target.files[0]) {
                      Object.defineProperty(e.target.files[0], "name", {
                        writable: true,
                        value: `${name} ${newDate}`,
                      });
                      setLogo(e.target.files[0]);
                    }
                  }}
                  placeholder="Pitchdeck"
                />
                <input
                  onChange={(e) => {
                    const newDate = dateGenerator();
                    if (e.target.files[0]) {
                      Object.defineProperty(e.target.files[0], "name", {
                        writable: true,
                        value: `${name} ${newDate}`,
                      });
                      setBgImg(e.target.files[0]);
                    }
                  }}
                  type="file"
                  placeholder="Projections"
                />
              </fieldset>
            </form>

            <form>
              <fieldset>
                <legend>Links</legend>
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <h1 style={{ marginRight: "2rem", color: "gray" }}>
                Due_diligence{" "}
              </h1>
              <label className="switch">
                <input
                  type="checkbox"
                  onClick={(e) =>
                    e.target.checked
                      ? setDue_Dilligence(true)
                      : setDue_Dilligence(false)
                  }
                />
                <span className="slider round"></span>
              </label>
            </div>
            <AddFaq />

            <AddHighlight />
            <AddInvestor />
            <AddFounder />
            <AddAdvisor />
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
