import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { getSingleUserFromDatabase, updateMentorAccount, updateMentorCalendly } from "../../firebase/firebase";
import './style.css' 

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
    
    const handleSubmit = async(event) => {
      event.preventDefault();
  
      //get mentor
      if(userEmail == "" || userEmail == undefined){
        alert("Please Enter user's email to continue")
      }else{
        var result = await getSingleUserFromDatabase(userEmail);
        if(result == -1){
            alert("No user found with that email please check.")
        }else if(result.userType != "Mentor"){
            alert("This email does not belong to a mentor.")
        }else{
            setIsMentor(true);
        }
      }
    };
    const handleSubmit2 = async(event) => {
        event.preventDefault();
        var ub, uc = false
        if(updateBank){
            ub=true;
            if((accountHolderName == "" || accountNumber== "" ||accountType == "" || bankAdress== "" ||bankName == "" || ifscCode== "" )&& (upiId == "")){
                alert("Please fill one of the above that is account details or the upi id")
            }else{
                
                var accountDetails = {
                    accountHolderName,
                    accountNumber,
                    accountType,
                    bankAdress,
                    bankName,
                    ifscCode,
                    upiId
                }

                var result = await updateMentorAccount(accountDetails , userEmail)
                if(result == -1){
                    alert("Error while updating user Account Details")
                }else{
                    alert("Bank Details updated!")
                    setaccountHolderName("");
                    setaccountNumber("");
                    setaccountType("");
                    setbankAdress("");
                    setbankName("");
                    setifscCode("");
                    setupiId("");
                    setUpdateBank(false);
                    ub=false
                }
            }
        
        }

        if(updateCalendly){
            uc=true;
            if(mentorCalendlyLink == ""){
                alert("Please Enter Mentor calendly Link")
            }else{
                var result = await updateMentorCalendly(mentorCalendlyLink, userEmail)
                if(result == -1){
                    alert("Error while updating user Calendly Link")
                }else{
                    alert("Calendly Link updated!")
                    setmentorCalendlyLink("");
                    setUpdateCalendly(false);
                    uc=false
                }
            }
        }
        console.log(ub , uc)
        if(!ub&&!uc){
            window.location.reload()
        }
    
      };
  
    return (
      <div className="body">
        {!isMentor? 
        <form className="form" onSubmit={handleSubmit}>
             <div className="form-panel one">
                <div className="form-header">
                 <h1>Mentor Form</h1>
                </div>
                <div className="form-group">
                <label htmlFor="userEmail">User EMAIL:</label>
                <input
                    type="text"
                    id="userEmail"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                />
                </div>
                <div className="form-group">
                <button type="submit">Submit</button>
                </div>
            </div>
        </form>
        :
        <form className="form" onSubmit={handleSubmit2}>
            <div className="form-panel one">
                <div className="form-header">
                 <h1>Mentor Form</h1>
                </div>
                <label style={{ color: "rgba(0, 0, 0, 0.6)",
                
                fontSize: "12px",
                fontWeight: 500,
                lineHeight: 1,
                textTransform: "uppercase",
                letterSpacing: "0.2em"}} 
                htmlFor="updatebank">Upload Bank details? </label>  
            
                <input 
              
                    type="checkbox"
                    id="updatebank"
                    value={updateBank}
                    onChange={(e)=>
                            setUpdateBank(!updateBank)}
                />
               
          
                <label
                style={{ color: "rgba(0, 0, 0, 0.6)",
                fontSize: "12px",
                fontWeight: 500,
                lineHeight: 1,
                textTransform: "uppercase",
                letterSpacing: "0.2em"}} 
                htmlFor="updatecalendly">Upload Calendly link?</label>
                <input 
                    type="checkbox"
                    id="updatecalendly"
                    value={updateCalendly}
                    onChange={(e)=> setUpdateCalendly(!updateCalendly)}
                />
                {updateBank? 
                <>
                <div className="form-group">
                <label htmlFor="accountHolderName">Account Holder Name:</label>
                <input
                    type="text"
                    id="accountHolderName"
                    value={accountHolderName}
                    onChange={(e) => setaccountHolderName(e.target.value)}
                    
                />
                </div>
                <div className="form-group">
                <label htmlFor="accountNumber">account Number:</label>
                <input
                    type="text"
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setaccountNumber(e.target.value)}
                    
                />
                </div>
                <div className="form-group">
                <label htmlFor="accountType">account Type:</label>
                <input
                    type="text"
                    id="accountType"
                    value={accountType}
                    onChange={(e) => setaccountType(e.target.value)}
                    
                />
                </div>

                <div className="form-group">
                <label htmlFor="bankAdress">bank Address:</label>
                <input
                    type="text"
                    id="bankAdress"
                    value={bankAdress}
                    onChange={(e) => setbankAdress(e.target.value)}
                    
                />
                </div>

                <div className="form-group">
                <label htmlFor="bankName">bank Name:</label>
                <input
                    type="text"
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setbankName(e.target.value)}
                    
                />
                </div>
                <div className="form-group">
                <label htmlFor="ifscCode">ifsc Code:</label>
                <input
                    type="text"
                    id="ifscCode"
                    value={ifscCode}
                    onChange={(e) => setifscCode(e.target.value)}
                    
                />
                </div>
                <div className="form-group">
                <label htmlFor="upiId">upiId:</label>
                <input
                    type="text"
                    id="upiId"
                    value={upiId}
                    onChange={(e) => setupiId(e.target.value)}
                    
                />
                </div>
          </>
          :null}
          {updateCalendly?
          <div className="form-group">
          <label htmlFor="mentorCalendlyLink">Calendly Link:</label>
          <input
            type="text"
            id="mentorCalendlyLink"
            value={mentorCalendlyLink}
            onChange={(e) => setmentorCalendlyLink(e.target.value)}
            
          />
          </div>
          :null}
          {(updateBank == true) || (updateCalendly ==true)? 
          <div className="form-group">
          <button type="submit">Submit</button>
          </div>
          :null}
          </div>
          </form>
        }
      </div>
    );
}
