import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/database";
import {
  addMentorInDatabase,
  getSingleUserFromDatabase,
  updateMentorAccount,
  updateMentorCalendly,
  uploadMedia,
} from "../../firebase/firebase";
import "./style.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const Domains = [
  { value: "Brand & Public Relations", label: "Brand & Public Relations" },
  {
    value: "Career Advice & Self Mastery",
    label: "Career Advice & Self Mastery",
  },
  { value: "Culture", label: "Culture" },
  { value: "Data Science & Analytics", label: "Data Science & Analytics" },
  {
    value: "Finance, Accounting & Controlling",
    label: "Finance, Accounting & Controlling",
  },
  {
    value: "Human Resources & Recruiting",
    label: "Human Resources & Recruiting",
  },
  {
    value: "Infrastructure & Security Leadership & Management",
    label: "Infrastructure & Security Leadership & Management",
  },
  {
    value: "Legal, Risk Management, Compliance",
    label: "Legal, Risk Management, Compliance",
  },
  { value: "Marketing & Growth", label: "Marketing & Growth" },
  { value: "Product Management", label: "Product Management" },
  { value: "Sales", label: "Sales" },
  {
    value: "Social Entrepreneurship & Charity",
    label: "Social Entrepreneurship & Charity",
  },
  {
    value: "Software Engineering & Charity",
    label: "Software Engineering & Charity",
  },
  {
    value: "Startup: Founding & Funding",
    label: "Startup: Founding & Funding",
  },
  {
    value: "Strategy & Business Development",
    label: "Strategy & Business Development",
  },
  { value: "Sustainability", label: "Sustainability" },
  {
    value: "Team Structure & Work Methodologies",
    label: "Team Structure & Work Methodologies",
  },
  { value: "Transformation", label: "Transformation" },
  { value: "UX, Design & User Research", label: "UX, Design & User Research" },
];

const Spaces = [
  { value: "FinTech", label: "FinTech" },
  { value: "EdTech", label: "EdTech" },
  { value: "AgriTech", label: "AgriTech" },
  { value: "FoodTech", label: "FoodTech" },
  { value: "Ecommerce", label: "Ecommerce" },
  { value: "Logistics & Delivery", label: "Logistics & Delivery" },
  {
    value: "Cleantech & Renewable Energy",
    label: "Cleantech & Renewable Energy",
  },
  { value: "Ai & ML", label: "Ai & ML" },
  { value: "Web 3.0", label: "Web 3.0" },
  { value: "SpaceTech", label: "SpaceTech" },
  { value: "HealthTech", label: "HealthTech" },
  { value: "Cybersecurity", label: "Cybersecurity" },
  { value: "AR & VR", label: "AR & VR" },
  { value: "Internet of Things(IOT)", label: "Internet of Things(IOT)" },
  { value: "Biotech", label: "Biotech" },
  { value: "TravelTech", label: "TravelTech" },
  { value: "Real Estate-Tech", label: "Real Estate-Tech" },
  { value: "BeautyTech", label: "BeautyTech" },
  { value: "LegalTech", label: "LegalTech" },
  { value: "HR-Tech", label: "HR-Tech" },
  { value: "Personal fitness Tech", label: "Personal fitness Tech" },
  {
    value: "Waste Management Technologies",
    label: "Waste Management Technologies",
  },
  { value: "Online Marketplaces", label: "Online Marketplaces" },
  { value: "CloudTech", label: "CloudTech" },
  { value: "FashionTech", label: "FashionTech" },
];

// program to generate random strings

// declare all characters
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@!$";

function generateString(length) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export default function Mentor() {
  const [userEmail, setUserEmail] = useState("");
  const [accountHolderName, setaccountHolderName] = useState("");
  const [accountNumber, setaccountNumber] = useState("");
  const [accountType, setaccountType] = useState("");
  const [bankAdress, setbankAdress] = useState("");
  const [bankName, setbankName] = useState("");
  const [ifscCode, setifscCode] = useState("");
  const [upiId, setupiId] = useState("");
  const [mentorCalendlyLink, setmentorCalendlyLink] = useState("");
  const [isMentor, setIsMentor] = useState(false);
  const [updateBank, setUpdateBank] = useState(false);
  const [updateCalendly, setUpdateCalendly] = useState(false);
  const [signup, setSignup] = useState(false);
  const [askSignup, setAskSignup] = useState(false);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [mobile, setMobile] = useState("");
  const [linlkedin, setLinlkedin] = useState("");
  const [userSpace, setUserSpace] = useState([]);
  const [domain, setDomain] = useState([]);
  const [designation, setDesignation] = useState("");
  const [industry, setIndustry] = useState("");
  const [dob, setDob] = useState();
  const [countryCode, setCountryCode] = useState("");
  const [chargeph, setChargeph] = useState();
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();

    //get mentor
    if (userEmail == "" || userEmail == undefined) {
      alert("Please Enter user's email to continue");
    } else {
      var result = await getSingleUserFromDatabase(userEmail);
      if (result == undefined) {
        setAskSignup(true);
        alert("No document found!");
      } else if (result == -1) {
        alert("No user found with that email please check.");
      } else if (result.userType != "Mentor") {
        alert("This email does not belong to a mentor.");
      } else {
        setIsMentor(true);
      }
    }
  };
  const handleSubmit3 = async (e) => {
    e.preventDefault();

    if (image) {
      setUploading(true);
      var result = await uploadMedia(image, "mentors");

      if (result == false) {
        setUploading(false);
        return alert("Error while uploading image");
      } else {
        var plans = [
          chargeph,
          (chargeph * 4).toString(),
          (chargeph * 12).toString(),
          (chargeph * 24).toString(),
        ];

        var userObject = {
          name,
          image: result,
          email: userEmail,
          domain,
          userSpace,
          linlkedin,
          mentorCalendlyLink,
          about,
          phone: mobile,
          designation,
          industry,
          dob,
          countryCode,
          plans,
          Password: generateString(12),
          accountDetails: {
            accountHolderName,
            accountNumber,
            accountType,
            bankAdress,
            bankName,
            ifscCode,
            upiId,
          },
          reviews: [{ id: "connect@reverr.io", rate: "5" }],
          totalRating: "5",
          userType: "Mentor",
        };
        var res = await addMentorInDatabase(userEmail, userObject);

        if (res) {
          setUploading(false);
          alert(name + " added Successfully");
          window.location.reload();
        } else {
          alert("ERROR while adding user...");
          setUploading(false);
        }
      }
    }
  };
  const handleSubmit2 = async (event) => {
    event.preventDefault();
    var ub,
      uc = false;
    if (updateBank) {
      ub = true;
      if (
        (accountHolderName == "" ||
          accountNumber == "" ||
          accountType == "" ||
          bankAdress == "" ||
          bankName == "" ||
          ifscCode == "") &&
        upiId == ""
      ) {
        alert(
          "Please fill one of the above that is account details or the upi id"
        );
      } else {
        var accountDetails = {
          accountHolderName,
          accountNumber,
          accountType,
          bankAdress,
          bankName,
          ifscCode,
          upiId,
        };

        var result = await updateMentorAccount(accountDetails, userEmail);
        if (result == -1) {
          alert("Error while updating user Account Details");
        } else {
          alert("Bank Details updated!");
          setaccountHolderName("");
          setaccountNumber("");
          setaccountType("");
          setbankAdress("");
          setbankName("");
          setifscCode("");
          setupiId("");
          setUpdateBank(false);
          ub = false;
        }
      }
    }

    if (updateCalendly) {
      uc = true;
      if (mentorCalendlyLink == "") {
        alert("Please Enter Mentor calendly Link");
      } else {
        var result = await updateMentorCalendly(mentorCalendlyLink, userEmail);
        if (result == -1) {
          alert("Error while updating user Calendly Link");
        } else {
          alert("Calendly Link updated!");
          setmentorCalendlyLink("");
          setUpdateCalendly(false);
          uc = false;
        }
      }
    }
    console.log(ub, uc);
    if (!ub && !uc) {
      window.location.reload();
    }
  };

  return (
    <div
      className='body'
      style={{ display: "block", height: "250vh", width: "98.5vw" }}
    >
      {!askSignup || !signup ? (
        <>
          {!isMentor ? (
            <form className='form' onSubmit={handleSubmit}>
              <div className='form-panel one'>
                <div className='form-header'>
                  <h1>Mentor Form</h1>
                </div>
                <div className='form-group'>
                  <label htmlFor='userEmail'>User EMAIL:</label>
                  <input
                    type='text'
                    id='userEmail'
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                  />
                </div>
                {askSignup ? (
                  <>
                    <label
                      style={{
                        color: "rgba(0, 0, 0, 0.6)",

                        fontSize: "12px",
                        fontWeight: 500,
                        lineHeight: 1,
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                      }}
                      htmlFor='askSignup'
                    >
                      Signup?{" "}
                    </label>

                    <input
                      type='checkbox'
                      id='askSignup'
                      value={signup}
                      onChange={(e) => setSignup(!signup)}
                    />
                  </>
                ) : null}
                <div className='form-group'>
                  <button type='submit'>Submit</button>
                </div>
              </div>
            </form>
          ) : (
            <form className='form' onSubmit={handleSubmit2}>
              <div className='form-panel one'>
                <div className='form-header'>
                  <h1>Mentor Form</h1>
                </div>
                <label
                  style={{
                    color: "rgba(0, 0, 0, 0.6)",

                    fontSize: "12px",
                    fontWeight: 500,
                    lineHeight: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                  }}
                  htmlFor='updatebank'
                >
                  Upload Bank details?{" "}
                </label>

                <input
                  type='checkbox'
                  id='updatebank'
                  value={updateBank}
                  onChange={(e) => setUpdateBank(!updateBank)}
                />

                <label
                  style={{
                    color: "rgba(0, 0, 0, 0.6)",
                    fontSize: "12px",
                    fontWeight: 500,
                    lineHeight: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                  }}
                  htmlFor='updatecalendly'
                >
                  Upload Calendly link?
                </label>
                <input
                  type='checkbox'
                  id='updatecalendly'
                  value={updateCalendly}
                  onChange={(e) => setUpdateCalendly(!updateCalendly)}
                />
                {updateBank ? (
                  <>
                    <div className='form-group'>
                      <label htmlFor='accountHolderName'>
                        Account Holder Name:
                      </label>
                      <input
                        type='text'
                        id='accountHolderName'
                        value={accountHolderName}
                        onChange={(e) => setaccountHolderName(e.target.value)}
                      />
                    </div>
                    <div className='form-group'>
                      <label htmlFor='accountNumber'>account Number:</label>
                      <input
                        type='text'
                        id='accountNumber'
                        value={accountNumber}
                        onChange={(e) => setaccountNumber(e.target.value)}
                      />
                    </div>
                    <div className='form-group'>
                      <label htmlFor='accountType'>account Type:</label>
                      <input
                        type='text'
                        id='accountType'
                        value={accountType}
                        onChange={(e) => setaccountType(e.target.value)}
                      />
                    </div>

                    <div className='form-group'>
                      <label htmlFor='bankAdress'>bank Address:</label>
                      <input
                        type='text'
                        id='bankAdress'
                        value={bankAdress}
                        onChange={(e) => setbankAdress(e.target.value)}
                      />
                    </div>

                    <div className='form-group'>
                      <label htmlFor='bankName'>bank Name:</label>
                      <input
                        type='text'
                        id='bankName'
                        value={bankName}
                        onChange={(e) => setbankName(e.target.value)}
                      />
                    </div>
                    <div className='form-group'>
                      <label htmlFor='ifscCode'>ifsc Code:</label>
                      <input
                        type='text'
                        id='ifscCode'
                        value={ifscCode}
                        onChange={(e) => setifscCode(e.target.value)}
                      />
                    </div>
                    <div className='form-group'>
                      <label htmlFor='upiId'>upiId:</label>
                      <input
                        type='text'
                        id='upiId'
                        value={upiId}
                        onChange={(e) => setupiId(e.target.value)}
                      />
                    </div>
                  </>
                ) : null}
                {updateCalendly ? (
                  <div className='form-group'>
                    <label htmlFor='mentorCalendlyLink'>Calendly Link:</label>
                    <input
                      type='text'
                      id='mentorCalendlyLink'
                      value={mentorCalendlyLink}
                      onChange={(e) => setmentorCalendlyLink(e.target.value)}
                    />
                  </div>
                ) : null}
                {updateBank == true || updateCalendly == true ? (
                  <div className='form-group'>
                    <button type='submit'>Submit</button>
                  </div>
                ) : null}
              </div>
            </form>
          )}{" "}
        </>
      ) : null}
      {signup ? (
        <form className='form' onSubmit={handleSubmit3}>
          <div className='form-panel one'>
            <div className='form-header'>
              <h1>Mentor Form</h1>
              <p style={{ margin: "0px" }}>
                Note:- Enter Bank details or UPI ID*
              </p>
            </div>
            <div className='form-group'>
              <label htmlFor='name'>Name:</label>
              <input
                type='text'
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='userEmail'>Email:</label>
              <input
                type='text'
                id='userEmail'
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='image'>Profile Pic:</label>
              <input
                type='file'
                id='image'
                value={""}
                onChange={(e) => {
                  if (e.target.files[0]) console.log(e.target.files[0]);
                  setImage(e.target.files[0]);
                }}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='about'>About:</label>
              <input
                type='textarea'
                id='about'
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='countryCode'>Country Code:</label>
              <input
                type='text'
                id='countryCode'
                placeholder='Example 91 for India'
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='mobile'>Phone Number:</label>
              <input
                type='text'
                id='mobile'
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='linlkedin'>Linlkedin URL:</label>
              <input
                type='text'
                id='linlkedin'
                value={linlkedin}
                onChange={(e) => setLinlkedin(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='userSpace'>Space:</label>
              <Select
                id='userSpace'
                components={animatedComponents}
                onChange={(e) => {
                  if (e.length > 0) {
                    var result = [];
                    e.map((item, index) => {
                      result.push(item.value);
                    });
                    setUserSpace(result);
                  } else {
                    setUserSpace([]);
                  }
                }}
                isMulti
                closeMenuOnSelect={false}
                options={Spaces}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='domain'>Domain:</label>
              <Select
                id='domain'
                components={animatedComponents}
                onChange={(e) => {
                  if (e.length > 0) {
                    var result = [];
                    e.map((item, index) => {
                      result.push(item.value);
                    });
                    setDomain(result);
                  } else {
                    setDomain([]);
                  }
                }}
                isMulti
                closeMenuOnSelect={false}
                options={Domains}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='designation'>Designation:</label>
              <input
                type='text'
                id='designation'
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='industry'>Industry:</label>
              <input
                type='text'
                id='industry'
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='dob'>Date of Birth:</label>
              <input
                type='date'
                id='dob'
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='chargeph'>Charges per hour (₹):</label>
              <input
                type='text'
                id='chargeph'
                value={chargeph}
                onChange={(e) => setChargeph(e.target.value)}
              />
            </div>
            <>
              <div className='form-group'>
                <label htmlFor='accountHolderName'>Account Holder Name:</label>
                <input
                  type='text'
                  id='accountHolderName'
                  value={accountHolderName}
                  onChange={(e) => setaccountHolderName(e.target.value)}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='accountNumber'>account Number:</label>
                <input
                  type='text'
                  id='accountNumber'
                  value={accountNumber}
                  onChange={(e) => setaccountNumber(e.target.value)}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='accountType'>account Type:</label>
                <input
                  type='text'
                  id='accountType'
                  value={accountType}
                  onChange={(e) => setaccountType(e.target.value)}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='bankAdress'>bank Address:</label>
                <input
                  type='text'
                  id='bankAdress'
                  value={bankAdress}
                  onChange={(e) => setbankAdress(e.target.value)}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='bankName'>bank Name:</label>
                <input
                  type='text'
                  id='bankName'
                  value={bankName}
                  onChange={(e) => setbankName(e.target.value)}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='ifscCode'>ifsc Code:</label>
                <input
                  type='text'
                  id='ifscCode'
                  value={ifscCode}
                  onChange={(e) => setifscCode(e.target.value)}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='upiId'>upiId:</label>
                <input
                  type='text'
                  id='upiId'
                  value={upiId}
                  onChange={(e) => setupiId(e.target.value)}
                />
              </div>
            </>
            <div className='form-group'>
              <label htmlFor='mentorCalendlyLink'>Calendly Link:</label>
              <input
                type='text'
                id='mentorCalendlyLink'
                value={mentorCalendlyLink}
                onChange={(e) => setmentorCalendlyLink(e.target.value)}
              />
            </div>

            <div className='form-group'>
              <button type='submit'>
                {uploading ? "UPLOADING... Dont Touch Anything!😣" : "Submit"}
              </button>
            </div>
          </div>
        </form>
      ) : null}
    </div>
  );
}
