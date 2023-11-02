import React, { useState } from "react";
import Papa from "papaparse";
import { collection, setDoc, doc } from "firebase/firestore";
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
      const collectionRef = collection(database, "WhatsappMessages");
      for (let i = 0; i < data.length; i++) {
        const rowData = data[i];
        const userdata = {
          [headers[0]]: rowData[headers[0]],
          [headers[1]]: rowData[headers[1]],
          [headers[2]]: rowData[headers[2]],
          profile: true,
          stop: false,
          exits: "true",
        };
        // console.log(userdata);
        try {
          // await addDoc(collectionRef, { userdata });
          await setDoc(doc(database, "WhatsappMessages", userdata.number), {...userdata});
        } catch (error) {
          console.error("Error adding document: ", error);
          toast.error(`Error adding user: ${userdata.name} ,${userdata.number}`, error)
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
