import React, { useState } from "react";
import Papa from "papaparse";
import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { database } from "../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";

const CSVAdduser = () => {
  const [data, setData] = useState(null);
  const [headers, setHeaders] = useState(null);

  const handleFileChange = async (e) => {
    if (e.target.files) {
      try {
        const file = e.target.files[0];
        const results = await new Promise((resolve) =>
          Papa.parse(file, {
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
      toast.info("uploading Users please wait...")
      var twenty = data.length /5;
      var fourty = twenty*2;
      var sixty = twenty*3;
      var eighty = twenty*4;
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
          profile: true,
          stop: false,
          exits: "true",
        };
        try {
          await setDoc(doc(database, "Testing", userdata.number), {
            ...userdata,
          });
          console.log(i,i == twenty, data.length/5)
          if(i == Math.round(twenty)){
            toast.info("uploaded 20%...")
          }else if(i == Math.round(fourty)){
            toast.info("uploaded 40%...")
          }else if(i == Math.round(sixty)){
            toast.info("uploaded 60%...")
          }else if(i == Math.round(eighty)){
            toast.info("uploaded 80%...")
          }
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
    <div>
      <div>
        <h3>Add User throgh CSV file</h3>
        <form onSubmit={submit}>
          <div className='input-feilds'>
            <label>File</label>
            <input type='file' accept='.csv' onChange={handleFileChange} />
          </div>
          <div className='input-feilds'>
            <button>Add CSV User</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CSVAdduser;
