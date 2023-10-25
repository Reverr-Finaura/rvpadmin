import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import ReactSelect from "react-select";
import { database } from "../../firebase/firebase";
import { toast } from "react-toastify";

const AddUser = () => {
  const userType = [{ name: "founder" }, { name: "professional" }];
  const [name, setName] = useState("");
  const [number, setNumber] = useState(null);
  const [bio, setBio] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
  };
  const submit = async (e) => {
    e.preventDefault();
    const data = {
      name: name,
      number: number,
      bio: bio,
      userType: selectedData.name,
      profile: true,
      stop: false,
      exits: "true",
    };
    const collectionRef = collection(database, "WhatsappMessages");
    await addDoc(collectionRef, {
      data,
    });
    toast.success("User have been successfully Added");
  };
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
            <label>Number</label>
            <input
              type='type'
              placeholder='Enter a Number'
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
          <div className='input-feilds'>
            <label>Bio</label>
            <textarea
              className='textarea-area'
              rows={6}
              placeholder='Enter a bio'
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>
          <div className='input-feilds'>
            <label>User Type</label>
            <ReactSelect
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
            <button>Add User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
