import Select from "react-select";
import React, { useEffect, useState } from "react";
import { getAllMessage } from "../../firebase/firebase";
import EditSection from "./EditSection";
import "./contactComp.css";

const EditUser = () => {
  const [users, setUsers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  useEffect(() => {
    const getUserMsg = async () => {
      try {
        const user = await getAllMessage();
        setUsers(user);
        console.log("running");
      } catch (error) {
        new Error(error);
      }
    };
    getUserMsg();
  }, [isEdit]);

  const [selectedData, setSelectedData] = useState("");
  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
  };
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      zIndex: "unset",
    }),
  };

  return (
    <div className='form-container'>
      <h3>Edit the user</h3>
      <div>
        <div className='input-feilds'>
          <label>Select user</label>
          <Select
            isClearable
            className='basic-single'
            classNamePrefix='select'
            style={{ position: "static" }}
            name='edituser'
            options={users}
            onChange={handleSelectChange}
            value={selectedData}
            getOptionLabel={(option) =>
              `+` + option.id + (option.name ? ` (${option.name})` : "")
            }
            getOptionValue={(option) => option.id}
            styles={customStyles} // Apply the custom styles here
          />
        </div>
      </div>
      {selectedData && (
        <div>
          <EditSection
            selectedData={selectedData}
            isEdited={isEdit}
            setIsEdit={setIsEdit}
            editName={selectedData?.name}
            editUserType={selectedData?.userType}
            editUserTags={selectedData?.userTags}
          />
        </div>
      )}
    </div>
  );
};

export default EditUser;
