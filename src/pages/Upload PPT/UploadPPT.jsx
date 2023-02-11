import React, { useState } from 'react'
import { HourglassSplit } from 'react-bootstrap-icons';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addPptInDatabase, uploadMedia } from '../../firebase/firebase';
import { dateGenerator } from '../../utils/dategenerator'
import { uidGenerator } from '../../utils/uidgenerator';
import styles from "./UploadPPT.module.css"

const UploadPPT = () => {
    const[isLoading,setIsloading]=useState(false)
    const [thumbnail, setThumbnail] = useState("");
    const[tempImgUrl,settempImgUrl]=useState(null)
const[data,setData]=useState({namee:"",link:"",thumbnail:"",timeStamp:"",tag:"Popular"})  

const handleInputChange=(e)=>{
    const{name,value}=e.target
    setData((prev)=>{
        return {...prev,[name]:value}
    })
}

const uploadDataToFirebase=async(e)=>{
e.preventDefault()
setIsloading(true)
const thumbnailImg = await uploadMedia(thumbnail, "pptTemplates/thumbnail/");
const timeStamp=new Date();
let uid = uidGenerator();
const pptData={
    name:data.namee,
    link:data.link,
    thumbnail:thumbnailImg,
    timeStamp,
    tag:data.tag
}
await addPptInDatabase(uid, pptData);
setIsloading(true)
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
            <legend>Upload PPT Details</legend>
            <fieldset className={styles.input}>
            <legend>PPT Name*</legend>
        <input onChange={handleInputChange} name='namee' className={styles.input} type="text" placeholder='Name' value={data.namee} required autoComplete='off'/>
        </fieldset>
        <fieldset className={styles.input}>
            <legend>Google Drive Link*</legend>
        <input onChange={handleInputChange} name='link' className={styles.input} type="text" placeholder='https://docs.google.com/presentation/d/FILEID/edit?usp=share_link&ouid=UID&rtpof=true&sd=true' value={data.link} required autoComplete='off'/>
        </fieldset>
        <fieldset className={styles.input}>
            <legend>Tag*</legend>
            <select value={data.tag} onChange={handleInputChange} name="tag" className={styles.input} required>
            <option value="For You">For You</option>
            <option value="Popular">Popular</option>
            <option value="Basic">Basic</option>
            <option value="Startups">Startups</option>
            <option value="Business">Business</option>
            <option value="Marketing">Marketing</option>
            <option value="Academic">Academic</option>
            <option value="Sales">Sales</option>
</select>
            </fieldset>
        <fieldset className={styles.input}>
            <legend>PPT Images*</legend>
            <label for="thumbnail">Thumbnail: </label>
            <input
            className={styles.file}
              type="file"
              onChange={(e) => {
                const newDate = dateGenerator();
                if (e.target.files[0]) {
                    const newName=e.target.files[0].name
                  Object.defineProperty(e.target.files[0], "name", {
                    writable: true,
                    value: `${newName} ${newDate}`,
                  });
                  setThumbnail(e.target.files[0]);
                  const fileURL = e.target.files[0];
                    if (fileURL) {
                    settempImgUrl(URL.createObjectURL(fileURL));
                   }}}}
              placeholder="Thumbnail"
              name="thumbnail"
              required
            />
              </fieldset>
        {tempImgUrl?<img className={styles.image} src={tempImgUrl} alt="preview" />:null}
        {isLoading?<HourglassSplit className={styles.loadingIcon} />:<button className={styles.button} type='submit'>Upload</button>}
          </fieldset>

          
        </form>
        </section>
    </>
  )
}

export default UploadPPT