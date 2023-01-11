import { useEffect, useState } from "react";
import { Pen, Steam, Trash } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { uploadMedia } from "../../firebase/firebase";
import { setAdvisors } from "../../redux/createDealSlice";
import { dateGenerator } from "../../utils/dategenerator";
import { keyGen } from "../../utils/keyGen";

const AddAdvisor = (props) => {
  const [name, SetName] = useState("");
  const [linkedIn, SetLinkedIn] = useState("");
  const [isAddAdvisor, SetIsAddAdvisor] = useState(false);
  const [advisor, SetAdvisor] = useState(props.advisors);
  const [isEditable, setIsEditable] = useState(false);
  const [selectedData, setSelectedData] = useState("");
  const [advisorImg, SetadvisorImg] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const onAddAdvisorHandler = async () => {
    setIsLoading(true);
    let newKey = keyGen();
    SetIsAddAdvisor(false);
    const advisorImgUrl = await uploadMedia(advisorImg, "rvpDeal/advisors");
    SetAdvisor([
      {
        name,
        image: { imageName: advisorImg.name, imageUrl: advisorImgUrl },
        linkedIn,
        id: newKey,
        description,
      },
      ...advisor,
    ]);

    SetName("");
    SetLinkedIn("");
    setIsLoading(false);
  };

  const onEditClickHandler = (data) => {
    SetAdvisor(advisor.filter((filteredData) => filteredData.id !== data.id));
    SetIsAddAdvisor(true);
    setSelectedData(data);
    SetName(() => data.name);
    SetLinkedIn(() => data.linkedIn);
    setDescription(() => data.description);
    setIsEditable(true);
  };

  const onSaveChangesHandler = async (e) => {
    e.preventDefault();
    SetIsAddAdvisor(false);

    setIsLoading(true);
    let advisorImgUrl = await uploadMedia(advisorImg, "rvpDeal/advisors");
    if (advisorImg === "") {
      // console.log("exec");
      advisorImgUrl = selectedData.image.imageUrl;
    }
    SetAdvisor([
      {
        name,
        image: {
          imageName: advisorImg.name || selectedData.image.imageName,
          imageUrl: advisorImgUrl,
        },
        linkedIn,
        id: selectedData.id,
        description,
      },
      ...advisor,
    ]);
    setIsEditable(false);
    setSelectedData("");
    SetName("");
    SetLinkedIn("");
    setDescription("");
    setIsLoading(false);
    setIsLoading(false);
  };

  const onDeleteClickHandler = (data) => {
    SetAdvisor(advisor.filter((filteredData) => filteredData.id !== data.id));
    // deleteMedia();
  };

  useEffect(() => {
    dispatch(setAdvisors(advisor));
  }, [advisor]);
  return (
    <>
      <form>
        <fieldset>
          <legend>Advisor</legend>

          {isLoading
            ? "Uploading..."
            : advisor.map((data) => {
                return (
                  <li key={data.id}>
                    {data.name}{" "}
                    <Trash onClick={() => onDeleteClickHandler(data)} />{" "}
                    <Pen onClick={() => onEditClickHandler(data)} />
                  </li>
                );
              })}

          {isAddAdvisor ? (
            <>
              <input
                value={name || ""}
                onChange={(e) => SetName(e.target.value)}
                placeholder="Name"
              />
              <input
                onChange={(e) => {
                  const newDate = dateGenerator();
                  if (e.target.files[0]) {
                    Object.defineProperty(e.target.files[0], "name", {
                      writable: true,
                      value: `${name} ${newDate}`,
                    });
                    SetadvisorImg(e.target.files[0]);
                  }
                }}
                type="file"
              />
              <input
                value={linkedIn || ""}
                onChange={(e) => SetLinkedIn(e.target.value)}
                placeholder="LinkedIn"
              />
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                placeholder="Short_desc"
                value={description || ""}
              />
              {isEditable ? (
                <button onClick={(e) => onSaveChangesHandler(e)}>
                  Save Changes
                </button>
              ) : (
                <button onClick={onAddAdvisorHandler}>Add</button>
              )}
            </>
          ) : (
            <button onClick={() => SetIsAddAdvisor(true)}>Add advisor</button>
          )}
        </fieldset>
      </form>
    </>
  );
};

export default AddAdvisor;
