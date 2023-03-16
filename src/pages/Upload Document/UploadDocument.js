import React, { useState } from 'react'
import { HourglassSplit } from 'react-bootstrap-icons';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addDocumentInDatabase } from '../../firebase/firebase';
import { uidGenerator } from '../../utils/uidgenerator';
import styles from "./UploadDocument.module.css"

const UploadDocument = () => {

    const[isLoading,setIsloading]=useState(false)
const[data,setData]=useState({namee:"",link:"",des:"",type:"",timeStamp:"",tag:"Fundraising"})  

const handleInputChange=(e)=>{
    const{name,value}=e.target
    setData((prev)=>{
        return {...prev,[name]:value}
    })
}

const uploadDataToFirebase=async(e)=>{
e.preventDefault()
setIsloading(true)
const timeStamp=new Date();
let uid = uidGenerator();
const documentData={
    title:data.namee,
    description:data.des,
    link:data.link,
    timeStamp,
    tag:data.tag,
    // type:data.type
}
await addDocumentInDatabase(uid, documentData);
setIsloading(false)
toast.success("Uploaded in Firebase")
setTimeout(()=>{
window.location.reload()
},1000)
} 

  return (
    <>
        <section className={styles.main_page}>
        <ToastContainer/>
        <form onSubmit={uploadDataToFirebase}>
          <fieldset className={styles.form} style={{ display: "flex" }}>
            <legend>Upload Document Details</legend>
            <fieldset className={styles.input}>
            <legend>Document Title*</legend>
        <input onChange={handleInputChange} name='namee' className={styles.input} type="text" placeholder='Title' value={data.namee} required autoComplete='off'/>
        </fieldset>
        <fieldset className={styles.input}>
            <legend>Description*</legend>
        <textarea rows="3" onChange={handleInputChange} name='des' className={styles.input} type="text" placeholder='Description' value={data.des} required autoComplete='off'/>
        </fieldset>
        <fieldset className={styles.input}>
            <legend>Google Drive Link*</legend>
        <input onChange={handleInputChange} name='link' className={styles.input} type="text" placeholder='https://docs.google.com/presentation/d/FILEID/edit?usp=share_link&ouid=UID&rtpof=true&sd=true' value={data.link} required autoComplete='off'/>
        </fieldset>
        {/* <fieldset className={styles.input}>
            <legend>Type*</legend>
        <input onChange={handleInputChange} name='type' className={styles.input} type="text" placeholder='Type' value={data.type} required autoComplete='off'/>
        </fieldset> */}
        <fieldset className={styles.input}>
            <legend>Tag*</legend>
            <select value={data.tag} onChange={handleInputChange} name="tag" className={styles.input} required>
            <option value="Business Plan">Business Plan</option>
            <option value="Business Validation">Business Validation</option>
            <option value="Financial Models">Financial Models</option>
            <option value="Fundraising">Fundraising</option>
            <option value="HR">HR</option>
            <option value="Legal">Legal</option>
            <option value="Startup Basics">Startup Basics</option>
</select>
            </fieldset>
        
        {isLoading?<HourglassSplit className={styles.loadingIcon} />:<button className={styles.button} type='submit'>Upload</button>}
          </fieldset>

          
        </form>
        </section>
    </>
  )
  
}

export default UploadDocument