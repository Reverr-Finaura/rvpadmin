import { useDispatch, useSelector } from "react-redux";
import "./EditModal.css";
import { useState, useEffect } from "react";
import {
  updateInvestorDetailsInDatabase,
  uploadMedia,
} from "../../firebase/firebase";
import { HourglassSplit } from "react-bootstrap-icons";
import { dateGenerator } from "../../utils/dategenerator";
import AddFaq from "../../components/addfaq/AddFaq";
import AddHighlight from "../../components/addHighlights/AddHighlight";
import AddInvestor from "../../components/addInvestor/AddInvestor";
import AddFounder from "../../components/addfounder/AddFounder";
import AddAdvisor from "../../components/addAdvisor/AddAdvisor";
import Select from "react-select";

const EditModal = (props) => {
  const {
    Links,
    advisors,
    cardImages,
    dealDescription,
    dealDetails,
    dealHighlight,
    due_Diligence,
    faqs,
    founders,
    investors,
    onePage,
    pitchDeck,
    projection,
  } = props.data;

  const faqsRedux = useSelector((state) => state.investorDeals.faqs);
  const highlightsRedux = useSelector(
    (state) => state.investorDeals.dealHighlight
  );
  const advisorRedux = useSelector((state) => state.investorDeals.advisors);
  const investorsRedux = useSelector((state) => state.investorDeals.investors);
  const foundersRedux = useSelector((state) => state.investorDeals.founders);

  const [name, setName] = useState(dealDetails.name);
  const [industry, setIndustry] = useState(dealDetails.industry);
  const [raised, setRaised] = useState(dealDetails.raised);
  const [type, setType] = useState(dealDetails.raised);
  const [firm, setFirm] = useState(dealDetails.firm);
  const [date, setDate] = useState(dealDetails.date);
  const [shortDesc, setShortDesc] = useState(dealDescription.shortDesc);
  const [description, setDescription] = useState(dealDescription.description);
  const [instagram, setInstagram] = useState(Links.instagram);
  const [twitter, setTwitter] = useState(Links.twitter);
  const [linkedIn, setLinkedIn] = useState(Links.linkedIn);
  const [videoLink, setVideoLink] = useState(Links.videoLink);
  const [website, setWebsite] = useState(Links.website);
  const [pitchDeckMedia, setPitchDeckMedia] = useState({
    docName: pitchDeck.docName,
    docUrl: pitchDeck.docUrl,
  });
  const [projectionMedia, setProjectionMedia] = useState({
    docName: projection.docName,
    docUrl: projection.docUrl,
  });
  const [logo, setLogo] = useState({
    name: cardImages.logo.name,
    logoUrl: cardImages.logo.logoUrl,
  });
  const [bgImg, setBgImg] = useState({
    name: cardImages.bgImage.name,
    bgUrl: cardImages.bgImage.bgUrl,
  });
  const [dueDiligence, setDue_Dilligence] = useState(due_Diligence);
  const [headquarter, setHeadquarter] = useState(dealDetails.headquarter);
  const [noOfEmployees, setNoOfEmployees] = useState(dealDetails.noOfEmployees);
  const [sectorsOfInvestment, setSectorsOfInvestment] = useState(
    dealDetails.sectorsOfInvestment
  );
  const [incorporationDate, setIncorporationDate] = useState(
    dealDetails.incorporationDate
  );
  const [preMoneyValuation, setPreMoneyValuation] = useState(
    dealDetails.preMoneyValuation
  );
  const [minimumInvestment, setMinimumInvestment] = useState(
    dealDetails.minimumInvestment
  );
  const [companyDescription, setCompanyDescription] = useState(
    onePage.companyDescription
  );
  const [problem, setProblem] = useState(onePage.problem);
  const [solution, setSolution] = useState(onePage.solution);
  const [tam, setTam] = useState(onePage.tam);
  const [sam, setSam] = useState(onePage.sam);
  const [som, setSom] = useState(onePage.som);
  const [competitiveLandscape, setCompetitiveLandscape] = useState(
    onePage.competitiveLandscape
  );
  const [revenueModal, setRevenueModal] = useState(onePage.revenueModal);
  const [growthStategy, setGrowthStrategy] = useState(onePage.growthStategy);
  const [marketTraction, setMarketTraction] = useState(onePage.marketTraction);
  const [fundingAmt, setFundingAmt] = useState(onePage.fundingAmt);

  const sectors = [
    { value: 1, label: "Agricultural" },
    { value: 2, label: "Apparel & Accessories" },
    { value: 3, label: "Automobile & Ancillaries" },
    { value: 4, label: "Banking" },
    { value: 5, label: "Consumer Durables" },
    { value: 6, label: "Derived Materials" },
    { value: 7, label: "Energy" },
    { value: 8, label: "Financial" },
    { value: 9, label: "FMCG" },
    { value: 10, label: "Food and Beverages" },
    { value: 11, label: "Healthcare" },
    { value: 12, label: "Hospitality and Travel" },
    { value: 13, label: "Industrial Products" },
    { value: 14, label: "Industries" },
    { value: 15, label: "IT Industry" },
    { value: 16, label: "Logistics and Freight" },
    { value: 17, label: "Media & Entertainment" },
    { value: 18, label: "Raw Material" },
    { value: 19, label: "Tele-Communication" },
    { value: 20, label: "Textile Industry" },
    { value: 21, label: "Others" },
  ];

  // Default Value (or pre-selected value) for sectors of investment
  let defaultValue = [];

  for (let i = 0; i < sectorsOfInvestment.length; i++) {
    for (let j = 0; j < 21; j++) {
      if (sectorsOfInvestment[i] === sectors[j].label) {
        defaultValue.push({
          value: sectors[j].value,
          label: sectorsOfInvestment[i],
        });
      }
    }
  }

  const [dealsUpdateLoading, setDealsUpdateLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (!props.show) {
    return null;
  }

  const onUploadLogoClickHandler = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const logoUrl = await uploadMedia(logo, "rvpDeal/cardImg/logoImg");
    setLogo({
      name: logo.name,
      logoUrl: logoUrl,
    });
    setIsUploading(false);
  };

  const onUploadBgClickHandler = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const bgUrl = await uploadMedia(bgImg, "rvpDeal/cardImg/backgroundImg");
    setBgImg({
      name: bgImg.name,
      bgUrl: bgUrl,
    });
    setIsUploading(false);
  };

  const onUploadPitchDeckClickHandler = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const pitchDeckUrl = await uploadMedia(
      pitchDeckMedia,
      "rvpDeal/pitchDecFiles"
    );
    setProjectionMedia({
      docName: pitchDeckMedia.name,
      docUrl: pitchDeckUrl,
    });
    setIsUploading(false);
  };

  const onUploadProjectionClickHandler = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const projectionUrl = await uploadMedia(
      projectionMedia,
      "rvpDeal/projectionFiles"
    );
    setProjectionMedia({
      docName: projectionMedia.name,
      docUrl: projectionUrl,
    });
    setIsUploading(false);
  };

  const onUpdateDealClickHandler = async () => {
    console.log(logo);
    console.log(bgImg);
    console.log(pitchDeckMedia);
    console.log(projectionMedia);
    setDealsUpdateLoading(true);
    try {
      const dealUpdatedData = {
        dealDetails: {
          name,
          industry,
          date,
          raised,
          firm,
          type,
          headquarter,
          noOfEmployees,
          sectorsOfInvestment,
          incorporationDate,
          minimumInvestment,
          preMoneyValuation,
        },
        due_Diligence: dueDiligence,
        dealDescription: {
          shortDesc,
          description,
        },
        Links: {
          instagram,
          linkedIn,
          twitter,
          website,
          videoLink,
        },
        onePage: {
          companyDescription,
          problem,
          solution,
          tam,
          sam,
          som,
          competitiveLandscape,
          revenueModal,
          growthStategy,
          marketTraction,
          fundingAmt,
        },
        faqs: faqsRedux,
        dealHighlight: highlightsRedux,
        advisors: advisorRedux,
        investors: investorsRedux,
        founders: foundersRedux,
        cardImages: {
          bgImage: { name: bgImg.name, bgUrl: bgImg.bgUrl },
          logo: { name: logo.name, logoUrl: logo.logoUrl },
        },
        pitchDeck: {
          docName: pitchDeckMedia.docName,
          docUrl: pitchDeckMedia.docUrl,
        },
        projection: {
          docName: projectionMedia.docName,
          docUrl: projectionMedia.docUrl,
        },
      };

      console.log(dealUpdatedData);
      await updateInvestorDetailsInDatabase(props.uid, dealUpdatedData);
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
              <fieldset style={{ display: "flex" }}>
                <legend>Deal Details</legend>
                <input
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  value={name}
                />
                <input
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Industry"
                  value={industry}
                />
                <input
                  onChange={(e) => setRaised(e.target.value)}
                  placeholder="Raised"
                  value={raised}
                />
                <input
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Type"
                  value={type}
                />
                <input
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  placeholder="date"
                  value={date}
                />
                <input
                  onChange={(e) => setFirm(e.target.value)}
                  placeholder="Firm"
                  value={firm}
                />
                <input
                  onChange={(e) => setHeadquarter(e.target.value)}
                  placeholder="Headquarters"
                  value={headquarter}
                />
                <input
                  onChange={(e) => setNoOfEmployees(e.target.value)}
                  placeholder="No of employees"
                  value={noOfEmployees}
                />
                <div style={{ width: "88%", marginLeft: "1%" }}>
                  <label for="sectors">
                    <h4>Sectors: </h4>
                  </label>
                  <Select
                    isMulti
                    options={sectors}
                    onChange={(e) => {
                      setSectorsOfInvestment(
                        Array.isArray(e) ? e.map((x) => x.label) : []
                      );
                    }}
                    defaultValue={defaultValue}
                    name="sectors"
                  />
                </div>
                <label style={{ marginLeft: "1%" }}>
                  <h4>Incorporation Date :</h4>
                </label>
                <input
                  style={{ width: "26.3%" }}
                  onChange={(e) => setIncorporationDate(e.target.value)}
                  placeholder="Incorporation date"
                  type="date"
                  value={incorporationDate}
                />
                <input
                  onChange={(e) => setPreMoneyValuation(e.target.value)}
                  placeholder="Pre money valuation"
                  type="number"
                  value={preMoneyValuation}
                />

                <input
                  onChange={(e) => setMinimumInvestment(e.target.value)}
                  placeholder="Minimum investment"
                  type="number"
                  value={minimumInvestment}
                />
              </fieldset>
            </form>

            <form>
              <fieldset>
                <legend>Deal Description</legend>
                <textarea
                  onChange={(e) => setShortDesc(e.target.value)}
                  rows="3"
                  placeholder="Short Description"
                  value={shortDesc}
                />
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  rows="8"
                  placeholder="Description"
                  value={description}
                />
              </fieldset>
            </form>

            <form>
              <fieldset>
                <legend>One Pager</legend>
                <textarea
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  rows="3"
                  placeholder="Enter Company description"
                  value={companyDescription}
                />
                <textarea
                  onChange={(e) => setProblem(e.target.value)}
                  rows="3"
                  placeholder="Problem"
                  value={problem}
                />
                <textarea
                  onChange={(e) => setSolution(e.target.value)}
                  rows="3"
                  placeholder="Solution"
                  value={solution}
                />
                <h3>Market (In Crores)</h3>
                <input
                  onChange={(e) => setTam(e.target.value)}
                  placeholder="TAM"
                  type="number"
                  value={tam}
                />
                <input
                  onChange={(e) => setSom(e.target.value)}
                  placeholder="SOM"
                  type="number"
                  value={som}
                />{" "}
                <input
                  onChange={(e) => setSam(e.target.value)}
                  placeholder="SAM"
                  type="number"
                  value={sam}
                />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ width: "45%" }}>
                    <h3>Competitive Landscape</h3>
                    <textarea
                      onChange={(e) => setCompetitiveLandscape(e.target.value)}
                      rows="3"
                      placeholder="Mention your competitors"
                      value={competitiveLandscape}
                    />
                  </div>
                  <div style={{ width: "45%" }}>
                    <h3>Revenue Model</h3>
                    <textarea
                      onChange={(e) => setRevenueModal(e.target.value)}
                      rows="3"
                      placeholder="Your startup's revenue model"
                      value={revenueModal}
                    />
                  </div>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ width: "45%" }}>
                    <h3>Growth Strategy</h3>
                    <textarea
                      onChange={(e) => setGrowthStrategy(e.target.value)}
                      rows="3"
                      placeholder="Few points about..."
                      value={growthStategy}
                    />
                  </div>
                  <div style={{ width: "45%" }}>
                    <h3>Market Traction</h3>
                    <textarea
                      onChange={(e) => setMarketTraction(e.target.value)}
                      rows="3"
                      placeholder="Current market traction"
                      value={marketTraction}
                    />
                  </div>
                </div>
                <h3>Funding Ask (in lakhs)</h3>
                <input
                  onChange={(e) => setFundingAmt(e.target.value)}
                  placeholder="Enter funding amount"
                  type="number"
                  value={fundingAmt}
                />
              </fieldset>
            </form>

            <form>
              <fieldset>
                <legend>File</legend>
                <label for="Pitchdeck">Pitchdeck: </label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setPitchDeckMedia(e.target.files[0]);
                    }
                  }}
                  placeholder="Pitchdeck"
                  name="Pitchdeck"
                />
                {isUploading ? (
                  <HourglassSplit />
                ) : (
                  <button onClick={onUploadPitchDeckClickHandler}>
                    Upload
                  </button>
                )}
                <br />
                <label for="Projections">Projections: </label>
                <input
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setProjectionMedia(e.target.files[0]);
                    }
                  }}
                  type="file"
                  placeholder="Projections"
                  name="Projections"
                />
                {isUploading ? (
                  <HourglassSplit />
                ) : (
                  <button onClick={onUploadProjectionClickHandler}>
                    Upload
                  </button>
                )}
              </fieldset>
            </form>

            <form>
              <fieldset>
                <legend>Card Images</legend>
                <label for="logo">Logo: </label>
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
                  placeholder="logo"
                  name="logo"
                />
                {isUploading ? (
                  <HourglassSplit />
                ) : (
                  <button onClick={onUploadLogoClickHandler}>Upload</button>
                )}
                <br />
                <label for="bg">Background: </label>
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
                  placeholder="background"
                  name="background"
                />
                {isUploading ? (
                  <HourglassSplit />
                ) : (
                  <button onClick={onUploadBgClickHandler}>Upload</button>
                )}
              </fieldset>
            </form>

            <form>
              <fieldset>
                <legend>Links</legend>
                <input
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="Instagram"
                  value={instagram}
                />
                <input
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="Twitter"
                  value={twitter}
                />
                <input
                  onChange={(e) => setLinkedIn(e.target.value)}
                  placeholder="LinkedIn"
                  value={linkedIn}
                />
                <input
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="Video Link"
                  value={videoLink}
                />
                <input
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Website Link"
                  value={website}
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
                Due Diligence{" "}
              </h1>
              <label className="switch">
                <input
                  type="checkbox"
                  onClick={(e) =>
                    e.target.checked
                      ? setDue_Dilligence(true)
                      : setDue_Dilligence(false)
                  }
                  defaultChecked={dueDiligence}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <AddFaq faqs={faqs} />
            <AddHighlight highlight={dealHighlight} />
            <AddInvestor investors={investors} />
            <AddFounder founders={founders} />
            <AddAdvisor advisors={advisors} />
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
