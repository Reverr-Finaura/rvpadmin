import React, { useState } from "react";
import style from "./style.module.css";
import Papa from "papaparse";
import { toast } from "react-toastify";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { database } from "../../../firebase/firebase";
import uploadicon from "../../../utils/Image/upload.png";

const AddCSVuser = () => {
  const [data, setData] = useState(null);
  const [headers, setHeaders] = useState(null);
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState(null);

  const handleFileChange = async (e) => {
    if (e.target.files) {
      try {
        const fileURl = e.target.files[0];
        setFile(fileURl);
        setFilename(fileURl.name);
        const results = await new Promise((resolve) =>
          Papa.parse(fileURl, {
            worker: true,
            header: true,
            skipEmptyLines: true,
            complete: (result) => resolve(result.data),
          })
        );
        setData(results);
        setHeaders(Object.keys(results[0]));
      } catch (error) {
        console.error(error);
      }
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    if (data && data.length > 0) {
      toast.info("uploading Users please wait...");
      var twenty = data.length / 5;
      var fourty = twenty * 2;
      var sixty = twenty * 3;
      var eighty = twenty * 4;
      for (let i = 0; i < data.length; i++) {
        const rowData = data[i];
        const header3Data = rowData[headers[3]];
        const header3DataArray = [];
        header3DataArray.push(header3Data);
        const formattedtags = header3DataArray.map((tag) => ({
          label: tag.toLowerCase(),
        }));
        try {
          const tagsDocumnetRef = doc(database, "meta", "tags");
          const allTags = (await getDoc(tagsDocumnetRef)).data();
          if (!allTags.initialTags.some((tag) => formattedtags.includes(tag))) {
            await updateDoc(tagsDocumnetRef, {
              initialTags: arrayUnion(...formattedtags),
            });
          }
        } catch (error) {
          console.error("Error updating tags document:", error);
        }
        const userdata = {
          [headers[0]]: rowData[headers[0]],
          [headers[1]]: rowData[headers[1]],
          [headers[2]]: rowData[headers[2]],
          [headers[3]]: formattedtags.map((tag) => tag.label),
          messages: [],
          profile: false,
          stop: false,
          exits: "true",
        };
        try {
          await setDoc(doc(database, "WhatsappMessages", userdata.number), {
            ...userdata,
          });
          console.log(i, i === twenty, data.length / 5);
          if (i === Math.round(twenty)) {
            toast.info("uploaded 20%...");
          } else if (i === Math.round(fourty)) {
            toast.info("uploaded 40%...");
          } else if (i === Math.round(sixty)) {
            toast.info("uploaded 60%...");
          } else if (i === Math.round(eighty)) {
            toast.info("uploaded 80%...");
          }
          setData(null);
          setHeaders(null);
        } catch (error) {
          console.error("Error adding document: ", error);
          toast.error(
            `Error adding user: ${userdata.name} ,${userdata.number}`,
            error
          );
        }
      }
      toast.success("All CSV file user have been successfully Added");
    }
  };
  return (
    <div className={style.Wrapper}>
      <form className={style.csvform} onSubmit={submit}>
        <div className={style.heading}>
          <h3>Add User through CSV File </h3>
        </div>
        <div className={style.inputField}>
          <label htmlFor='csv' className={style.csvfileUpload}>
            <div className={style.csvfileuploadContent}>
              <img src={uploadicon} alt='' />
              <p> Upload Your CSV File Here{filename && `: ${filename}`}</p>
              <button>Select file</button>
            </div>
          </label>
          <input
            type='file'
            accept='.csv'
            value={file}
            onChange={handleFileChange}
            id='csv'
            style={{ display: "none" }}
          />
        </div>
        <div className={style.formcsvbutton}>
          <button>Send Message</button>
        </div>
      </form>
    </div>
  );
};

export default AddCSVuser;

// const editPprofiler = async (e) => {
//   e.preventDefault();
//   toast.info("uploading Users please wait...");
//   var twenty = data.length / 5;
//   var fourty = twenty * 2;
//   var sixty = twenty * 3;
//   var eighty = twenty * 4;
//   for (let i = 0; i < data.length; i++) {
//     const rowData = data[i];
//     const userdata = {
//       [headers[0]]: rowData[headers[0]],
//       [headers[1]]: rowData[headers[1]],
//       [headers[2]]: rowData[headers[2]],
//     };
//     try {
//       const userDocRef = doc(database, "WhatsappMessages", userdata.number);
//       await updateDoc(userDocRef, {
//         profile: false,
//       });
//       if (i == Math.round(twenty)) {
//         toast.info("uploaded 20%...");
//       } else if (i == Math.round(fourty)) {
//         toast.info("uploaded 40%...");
//       } else if (i == Math.round(sixty)) {
//         toast.info("uploaded 60%...");
//       } else if (i == Math.round(eighty)) {
//         toast.info("uploaded 80%...");
//       }
//     } catch (error) {
//       console.error("Error adding document: ", error);
//     }
//   }
//   toast.success("All CSV file user have been successfully Updated");
// };