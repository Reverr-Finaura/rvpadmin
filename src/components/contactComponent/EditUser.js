import Select from "react-select";
import React, { useEffect, useState } from "react";
import { database, getMessage } from "../../firebase/firebase";
import EditSection from "./EditSection";
import "./contactComp.css";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useSelector } from "react-redux";

const EditUser = () => {
  const user = useSelector((state) => state.user.user);
  const adminChats = useSelector((state) => state.contact.allAdminChats);
  const agentsChats = useSelector((state) => state.contact.allAgentsChats);
  const [isEdit, setIsEdit] = useState(false);

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
            options={user.isAdmin ? adminChats : agentsChats}
            onChange={handleSelectChange}
            value={selectedData}
            getOptionLabel={(option) =>
              `+` + option.id + (option.name ? ` (${option.name})` : "")
            }
            getOptionValue={(option) => option.id}
            styles={customStyles}
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
