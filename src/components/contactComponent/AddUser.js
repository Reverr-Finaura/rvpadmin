import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import CreatableSelect from "react-select/creatable";
import { database } from "../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "./contactComp.css";

const AddUser = () => {
  const userType = [{ name: "founder" }, { name: "professional" }];
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [number, setNumber] = useState("");
  const [selectedData, setSelectedData] = useState("");
  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
  };
  const [tags, setTags] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagSelectChange = async (selectedOptions) => {
    if (selectedOptions) {
      const formattedSelectedTags = selectedOptions.map((option) => ({
        label: option.label.toLowerCase(),
      }));
      try {
        setSelectedTags(formattedSelectedTags);
        const tagsDocumnetRef = doc(database, "meta", "tags");
        const allTags = (await getDoc(tagsDocumnetRef)).data();
        if (
          !allTags.initialTags.some((tag) =>
            formattedSelectedTags.includes(tag)
          )
        ) {
          await updateDoc(tagsDocumnetRef, {
            initialTags: arrayUnion(...formattedSelectedTags),
          });
          console.log("Updated tags");
        }
      } catch (error) {
        console.error("Error updating tags document:", error);
      }
    }
  };

  const reset = () => {
    setName("");
    setCode("");
    setNumber("");
    setSelectedData("");
    setSelectedTags([]);
  };
  const submit = async (e) => {
    e.preventDefault();
    if (number.length === 10 && code) {
      const data = {
        name: name,
        number: code.toString() + number.toString(),
        userType: selectedData.name,
        userTags: selectedTags.map((item) => item.label),
        profile: true,
        stop: false,
        exits: "true",
      };
      console.log(data);
      await setDoc(doc(database, "WhatsappMessages", data.number), { ...data });
      toast.success("User have been successfully Added");
      reset();
    }
  };

  useEffect(() => {
    const getTags = async () => {
      const result = await getDoc(doc(database, "meta", "tags"));
      if (result.exists()) {
        setTags(result.data());
      }
    };
    getTags();
  }, []);

  return (
    <div>
      <div>
        <h3>Add User Form</h3>
        <form onSubmit={submit}>
          <div className='input-feilds'>
            <label>Name</label>
            <input
              type='type'
              placeholder='Enter a Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='input-feilds'>
            <label>Country Codes</label>
            <input
              type='number'
              placeholder='Enter a Number'
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className='input-feilds'>
            <label>Number</label>
            <input
              type='number'
              placeholder='Enter a Number'
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
          <div className='input-feilds'>
            <label>User Type</label>
            <ReactSelect
              isClearable
              className='basic-single'
              classNamePrefix='select'
              name='usersMessage'
              options={userType}
              onChange={handleSelectChange}
              value={selectedData}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.name}
            />
          </div>
          <div className='input-feilds'>
            <label>Tags</label>
            <CreatableSelect
              className='basic-multi-select'
              isClearable
              isMulti={true}
              options={tags.initialTags}
              onChange={handleTagSelectChange}
              value={selectedTags}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.label}
            />
          </div>
          <div className='input-feilds'>
            <button>Add User</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddUser;
