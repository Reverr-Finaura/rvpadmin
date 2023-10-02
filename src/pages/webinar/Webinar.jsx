import React, { useState } from 'react'
import { HourglassSplit } from 'react-bootstrap-icons';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateWebinarDatabase } from '../../firebase/firebase';

import styles from "./UploadPPT.module.css"

const Webinar = () => {
    const[isLoading,setIsloading]=useState(false)
const[data,setData]=useState({topic:"",link:"",speaker:"",timings:""})  


const handleInputChange=(e)=>{
    const{name,value}=e.target
    setData((prev)=>{
        return {...prev,[name]:value}
    })
}


const uploadDataToFirebase=async(e)=>{
  
e.preventDefault()
if(data.topic===""||data.speaker===""||data.timings===""||data.link===""){alert("Fields can not be empty.");return}
setIsloading(true)

const timeStamp=new Date();

var tempdata = {
  topic:data.topic,
  speaker: data.speaker,
  timings: data.timings,
  link: data.link,
  timeStamp
}

await updateWebinarDatabase(tempdata)
setIsloading(true)
toast.success("Uploaded in Firebase")
setTimeout(()=>{
window.location.reload()
},2000)
}
// Topic:
// Speaker:
// Timings:
// Registration link:

  return (
    <>
        <section className={styles.main_page}>
        <ToastContainer/>
        <form onSubmit={uploadDataToFirebase}>
          <fieldset className={styles.form} style={{ display: "flex" }}>
            <legend>Webinar Details</legend>
            <fieldset className={styles.input}>
            <legend>Topic</legend>
        <input onChange={handleInputChange} name='topic' className={styles.input} type="text" placeholder='Topic' value={data.topic} required autoComplete='off'/>
        </fieldset>
        <fieldset className={styles.input}>
            <legend>Speaker</legend>
        <input onChange={handleInputChange} name='speaker' className={styles.input} type="text" placeholder='Speaker' value={data.speaker} required autoComplete='off'/>
        </fieldset>
        <fieldset className={styles.input}>
            <legend>Timings</legend>
        <input onChange={handleInputChange} name='timings' className={styles.input} type="text" placeholder='Timings' value={data.timings} required autoComplete='off'/>
        </fieldset>
        <fieldset className={styles.input}>
            <legend>Registration link</legend>
        <input onChange={handleInputChange} name='link' className={styles.input} type="text" placeholder='Registration link' value={data.link} required autoComplete='off'/>
        </fieldset>
       
        {isLoading?<HourglassSplit className={styles.loadingIcon} />:<button className={styles.button} type='submit'>Upload</button>}
          </fieldset>

          
        </form>
        </section>
    </>
  )
}

export default Webinar
