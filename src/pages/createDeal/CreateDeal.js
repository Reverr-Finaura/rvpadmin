import { useEffect, useState } from "react";
import { dateGenerator } from "../../utils/dategenerator";
import { uidGenerator } from "../../utils/uidgenerator";
import {
  addDealInDatabase,
  getinvestorDealsFromDatabase,
  uploadMedia,
} from "../../firebase/firebase";
import "./createdeal.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HourglassSplit, Pen, Trash } from "react-bootstrap-icons";
import { keyGen } from "../../utils/keyGen";
import AddFaq from "../../components/addfaq/AddFaq";
import AddHighlight from "../../components/addHighlights/AddHighlight";
import AddInvestor from "../../components/addInvestor/AddInvestor";
import AddFounder from "../../components/addfounder/AddFounder";
import AddAdvisor from "../../components/addAdvisor/AddAdvisor";
import { useSelector } from "react-redux";

const CreateDeal = () => {
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
  const [dealsAddLoading, setDealsAddLoading] = useState(false);
  const [due_Diligence, setDue_Dilligence] = useState(false);

  const investorDeals = useSelector((state) => state.investorDeals);

  const onAddDealHandler = async () => {
    setDealsAddLoading(true);
    const { investors, founders, advisors, faqs, dealHighlight } =
      investorDeals;
    try {
      let uid = uidGenerator();
      let addedOn = dateGenerator();
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
      const dealData = {
        id: uid,
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
        addedOn,
        cardImages: {
          logo: { name: logo.name, logoUrl: logoImg },
          bgImage: { name: bgImg.name, bgUrl: bagdImg },
        },
      };

      await addDealInDatabase(uid, dealData);
      console.log("added");
      setDealsAddLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
                const newDate = dateGenerator();
                if (e.target.files[0]) {
                  Object.defineProperty(e.target.files[0], "name", {
                    writable: true,
                    value: `${name} ${newDate}`,
                  });
                  setPitchDeckMedia(e.target.files[0]);
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
                  setProjectionMedia(e.target.files[0]);
                }
              }}
              type="file"
              placeholder="Projections"
            />
          </fieldset>
        </form>

        {/* Card Images */}
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
          <h1 style={{ marginRight: "2rem", color: "gray" }}>Due_diligence </h1>
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

        {dealsAddLoading && (
          <div className="loading-state">
            <HourglassSplit />
          </div>
        )}
        <div className="btn_container">
          <button onClick={onAddDealHandler}>Add Deal</button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default CreateDeal;
