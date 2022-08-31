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
import Select from "react-select";

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
  const [headquarter, setHeadquarter] = useState("");
  const [noOfEmployees, setNoOfEmployees] = useState("");
  const [sectorsOfInvestment, setSectorsOfInvestment] = useState([]);
  const [incorporationDate, setIncorporationDate] = useState("");
  const [preMoneyValuation, setPreMoneyValuation] = useState(0);
  const [minimumInvestment, setMinimumInvestment] = useState(0);
  const [companyDescription, setCompanyDescription] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [tam, setTam] = useState(0);
  const [sam, setSam] = useState(0);
  const [som, setSom] = useState(0);
  const [competitiveLandscape, setCompetitiveLandscape] = useState("");
  const [revenueModal, setRevenueModal] = useState("");
  const [growthStategy, setGrowthStrategy] = useState("");
  const [marketTraction, setMarketTraction] = useState("");
  const [fundingAmt, setFundingAmt] = useState("");

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
          headquarter,
          noOfEmployees,
          sectorsOfInvestment,
          incorporationDate,
          minimumInvestment,
          preMoneyValuation,
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
      };

      await addDealInDatabase(uid, dealData);
      console.log("added");
      setDealsAddLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const scheduleDeal = () => {
    meetingDetails = { time, date, desc, meetingLink };
    // await sendMeetingLink()
  };

  // const sendMailLink = async () => {
  //   for (i = 0; i < interestedUsers.length; i++) {
  //     await emailJs.send(interestedUsers[i]);
  //   }
  // };

  // useEffect(() => {
  //  getMeetingsFromDatabase(uid);
  // }, [meetings]);

  /* 
  schedule -> meetingData-Update,
  fetch meeting -> destuct interestedUser,
  emailJS -> meeting link,meeting_Time.....,
for(let i=0; i<=interestedUser.length; i++ ){
    email.send({
    interestedUser[i].email,
    })
  }

*/

  return (
    <>
      <div className="main__deal">
        <form>
          <fieldset style={{ display: "flex" }}>
            <legend>Deal Details</legend>
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
            <input
              onChange={(e) => setHeadquarter(e.target.value)}
              placeholder="Headquarters"
            />
            <input
              onChange={(e) => setNoOfEmployees(e.target.value)}
              placeholder="No of employees"
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
            />
            <input
              onChange={(e) => setPreMoneyValuation(e.target.value)}
              placeholder="Pre money valuation"
              type="number"
            />

            <input
              onChange={(e) => setMinimumInvestment(e.target.value)}
              placeholder="Minimum investment"
              type="number"
            />
          </fieldset>
        </form>
        <form>
          <fieldset style={{ display: "flex" }}>
            <legend>Deal Description</legend>
            <textarea
              onChange={(e) => setShortDesc(e.target.value)}
              rows="3"
              placeholder="Short Description"
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
            <legend>One Pager</legend>
            <textarea
              onChange={(e) => setCompanyDescription(e.target.value)}
              rows="3"
              placeholder="Enter Company description"
            />
            <textarea
              onChange={(e) => setProblem(e.target.value)}
              rows="3"
              placeholder="Problem"
            />
            <textarea
              onChange={(e) => setSolution(e.target.value)}
              rows="3"
              placeholder="Solution"
            />
            <h3>Market (In Crores)</h3>
            <input
              onChange={(e) => setTam(e.target.value)}
              placeholder="TAM"
              type="number"
            />
            <input
              onChange={(e) => setSom(e.target.value)}
              placeholder="SOM"
              type="number"
            />{" "}
            <input
              onChange={(e) => setSam(e.target.value)}
              placeholder="SAM"
              type="number"
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "45%" }}>
                <h3>Competitive Landscape</h3>
                <textarea
                  onChange={(e) => setCompetitiveLandscape(e.target.value)}
                  rows="3"
                  placeholder="Mention your competitors"
                />
              </div>
              <div style={{ width: "45%" }}>
                <h3>Revenue Model</h3>
                <textarea
                  onChange={(e) => setRevenueModal(e.target.value)}
                  rows="3"
                  placeholder="Your startup's revenue model"
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "45%" }}>
                <h3>Growth Strategy</h3>
                <textarea
                  onChange={(e) => setGrowthStrategy(e.target.value)}
                  rows="3"
                  placeholder="Few points about..."
                />
              </div>
              <div style={{ width: "45%" }}>
                <h3>Market Traction</h3>
                <textarea
                  onChange={(e) => setMarketTraction(e.target.value)}
                  rows="3"
                  placeholder="Current market traction"
                />
              </div>
            </div>
            <h3>Funding Ask (in lakhs)</h3>
            <input
              onChange={(e) => setFundingAmt(e.target.value)}
              placeholder="Enter funding amount"
              type="number"
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
              name="Pitchdeck"
            />
            <br />
            <label for="projection">Projection: </label>
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
              name="projection"
            />
          </fieldset>
        </form>
        {/* Card Images */}
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
              placeholder="bg"
              name="bg"
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
              placeholder="Video Link"
            />
            <input
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Website Link"
            />
          </fieldset>
        </form>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <h1 style={{ marginRight: "2rem", color: "gray" }}>Due Diligence </h1>
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
