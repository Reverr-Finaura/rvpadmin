import Select from "react-select";
import React, { useEffect, useState } from "react";
import { database, getMessage } from "../../firebase/firebase";
import EditSection from "./EditSection";
import "./contactComp.css";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useSelector } from "react-redux";

const EditUser = () => {
  const user = useSelector((state) => state.user.user);
  const [users, setUsers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [agentsChat, setAgentsChat] = useState([]);
  useEffect(() => {
    const unsubscribeMessage = getMessage((userdata) => {
      setUsers(userdata);
    });
    const unsubscribeAgentsChat = onSnapshot(
      doc(database, "Agents", user.email),
      (snapshot) => {
        if (snapshot.exists()) {
          const assignedChats = snapshot.data().assignedChats || [];
          const fetchChatsPromises = assignedChats.map(async (item) => {
            try {
              const chatDocRef = doc(database, "WhatsappMessages", item.number);
              const chatSnapshot = await getDoc(chatDocRef);
              return { ...chatSnapshot.data(), id: chatSnapshot.id };
            } catch (error) {
              console.error("Error fetching chat:", error);
              throw error;
            }
          });
          Promise.allSettled(fetchChatsPromises)
            .then((results) => {
              const successfulChats = results
                .filter((result) => result.status === "fulfilled")
                .map((result) => result.value);

              setAgentsChat(successfulChats);
            })
            .catch((error) => {
              console.error("Error fetching chats:", error);
            });
        }
      }
    );
    return () => {
      unsubscribeMessage();
      unsubscribeAgentsChat();
    };
  }, [user.email]);

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
            options={user.isAdmin ? users : agentsChat}
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
