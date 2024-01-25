import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import { useSelector } from "react-redux";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { database } from "../../../firebase/firebase";
import { selectStyles2 } from "../../../utils";
import ReactSelect from "react-select";
import CreatableSelect from "react-select/creatable";
import { ToastContainer, toast } from "react-toastify";

const EditUser = () => {
  const user = useSelector((state) => state.user.user);
  const adminChats = useSelector((state) => state.contact.allAdminChats);
  const agentsChats = useSelector((state) => state.contact.allAgentsChats);
  const [loadings, setLoadings] = React.useState(false);
  const userType = [{ name: "founder" }, { name: "professional" }];
  const [selectedData, setSelectedData] = useState("");
  const [tags, setTags] = useState({});

  const handleSelectChange = (selectedOptions) => {
    setSelectedData(selectedOptions);
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

  const [name, setName] = useState();
  const [userTypes, setUsertypes] = useState();
  const [selectedTags, setSelectedTags] = useState();
  const handleUserTypeChange = (selectedOptions) => {
    setUsertypes(selectedOptions);
  };
  const reset = () => {
    setName("");
    setUsertypes();
    setSelectedTags();
    setSelectedData("");
  };
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
    setLoadings(true);
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
      toast.success("User have been successfully edited");
    } catch (error) {
      console.log("Error updating tags document:", error);
    } finally {
      setLoadings(false);
      reset();
    }
  };
  useEffect(() => {
    if (selectedData) {
      setName(selectedData?.name);
      setUsertypes({ name: selectedData?.userType });
      setSelectedTags(
        (selectedData?.userTags ?? []).map((i) => ({
          label: i,
        }))
      );
    }
  }, [selectedData]);

  return (
    <div className={style.container}>
      <div className={style.heading}>
        <h3>Edit User Form</h3>
      </div>
      <form className={style.adduserForm} onSubmit={submit}>
        <div className={style.doubleField}>
          <div className={style.inputField}>
            <label>Select user</label>
            <ReactSelect
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
              styles={selectStyles2}
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
              onChange={handleUserTypeChange}
              value={userTypes}
              styles={selectStyles2}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.name}
            />
          </div>
        </div>
        <div className={style.doubleField}>
          <div className={style.inputField}>
            <label>Edit User Name</label>
            <input
              type='text'
              placeholder='Enter User Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <button disabled={loadings}>Edit</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditUser;
