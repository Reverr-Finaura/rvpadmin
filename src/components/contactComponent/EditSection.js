import React, { useEffect, useState } from "react";
import { database } from "../../firebase/firebase";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import ReactSelect from "react-select";
import CreatableSelect from "react-select/creatable";
import { ToastContainer, toast } from "react-toastify";
import "./contactComp.css";

const EditSection = ({
  selectedData,
  editName,
  editUserType,
  editUserTags,
  setIsEdit,
  isEdit,
}) => {
  console.log(editUserType);
  const [userdata, setUserdata] = useState({});

  useEffect(() => {
    if (selectedData) {
      const getUserData = async () => {
        const docRef = doc(database, "WhatsappMessages", selectedData?.id);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          setUserdata({ ...docSnapshot.data(), id: docSnapshot.id });
        }
        console.log("running");
      };
      getUserData();
    }
  }, [selectedData]);

  const [tags, setTags] = useState({});
  useEffect(() => {
    const getTags = async () => {
      const result = await getDoc(doc(database, "meta", "tags"));
      if (result.exists()) {
        setTags(result.data());
      }
    };
    getTags();
  }, []);
  // console.log(tags);

  const userType = [{ name: "founder" }, { name: "professional" }];
  const [name, setName] = useState(editName);
  const [userTypes, setUsertypes] = useState({ name: editUserType });
  const handleSelectChange = (selectedOptions) => {
    setUsertypes(selectedOptions);
  };
  const [selectedTags, setSelectedTags] = useState(
    (editUserTags ?? []).map((i) => ({
      label: i,
    }))
  );
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
  const submit = async (e) => {
    e.preventDefault();
    const data = {
      name: name,
      userType: userTypes.name,
      userTags: selectedTags.map((item) => item.label),
      profile: true,
      stop: false,
    };
    console.log(data);
    try {
      await updateDoc(doc(database, "WhatsappMessages", selectedData?.id), {
        ...data,
      });
      setIsEdit(!isEdit);
      toast.success("User have been successfully edited");
    } catch (error) {
      console.log("Error updating tags document:", error);
    }
  };

  return (
    <div className='form-container'>
      <h3>
        Edit this user {selectedData.name ? `${selectedData.name}` : ""}
        <span>
          (
          {selectedData.id &&
            `+${
              selectedData.id.slice(0, -10) + "-" + selectedData.id.slice(-10)
            }`}
          )
        </span>
      </h3>
      <form onSubmit={submit}>
        <div className='input-feilds'>
          <label>Edit User Name</label>
          <input
            type='text'
            placeholder='Enter User Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={userTypes}
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
          <button>Edit User</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditSection;
