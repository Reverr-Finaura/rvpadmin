import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { database } from "../../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import ReactSelect from "react-select";
import CreatableSelect from "react-select/creatable";
import { selectStyles2 } from "../../../utils";

const AddUser = () => {
  const userType = [{ name: "founder" }, { name: "professional" }];
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [number, setNumber] = useState("");
  const [selectedData, setSelectedData] = useState("");
  const [loadings, setLoadings] = React.useState(false);
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
    setLoadings(true);
    if (number.length === 10 && code) {
      const data = {
        name: name,
        number: code.trim.toString() + number.trim.toString(),
        userType: selectedData.name,
        userTags: selectedTags.map((item) => item.label),
        messages: [],
        profile: false,
        stop: false,
        exits: "true",
      };
      try {
        await setDoc(doc(database, "WhatsappMessages", data.number), {
          ...data,
        });
        toast.success("User have been successfully Added");
      } catch (error) {
        toast.error("Error adding in user");
        console.error(error);
      } finally {
        setLoadings(false);
        reset();
      }
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
    <div className={style.container}>
      <div className={style.heading}>
        <h3>Add User Form</h3>
      </div>
      <form className={style.adduserForm} onSubmit={submit}>
        <div className={style.doubleField}>
          <div className={style.inputField}>
            <label>Name</label>
            <input
              type='type'
              placeholder='Enter a Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={style.inputField}>
            <label>User Type</label>
            <ReactSelect
              isClearable
              className='basic-single'
              classNamePrefix='select'
              name='usersMessage'
              options={userType}
              onChange={handleSelectChange}
              value={selectedData}
              styles={selectStyles2}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.name}
            />
          </div>
        </div>
        <div className={style.doubleField}>
          <div className={style.inputField}>
            <label>Country Codes</label>
            <input
              type='number'
              placeholder='Enter a Number'
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className={style.inputField}>
            <label>Number</label>
            <input
              type='number'
              placeholder='Enter a Number'
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
        </div>
        <div className={style.doubleField}>
          <div className={style.inputField}>
            <label>Tags</label>
            <CreatableSelect
              className='basic-multi-select'
              isClearable
              isMulti={true}
              options={tags.initialTags}
              onChange={handleTagSelectChange}
              value={selectedTags}
              styles={selectStyles2}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.label}
            />
          </div>
        </div>
        <div className={style.formbutton}>
          <button>Add User</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddUser;
