import { useEffect, useState } from "react";
import { Pen, Trash } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { uploadMedia } from "../../firebase/firebase";
import { setFounders } from "../../redux/createDealSlice";
import { dateGenerator } from "../../utils/dategenerator";
import { keyGen } from "../../utils/keyGen";

const AddFounder = () => {
  const [name, SetName] = useState("");
  const [linkedIn, SetLinkedIn] = useState("");
  const [isAddFounder, SetIsAddFounder] = useState(false);
  const [founder, SetFounder] = useState([]);
  const [position, setPosition] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [founderImg, SetFounderImg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const onAddFounderHandler = async () => {
    setIsLoading(true);
    let newKey = keyGen();
    SetIsAddFounder(false);
    const founderImgUrl = await uploadMedia(founderImg, "rvpDeal/founders");
    SetFounder([
      {
        name,
        image: { imageName: founderImg.name, imageUrl: founderImgUrl },
        linkedIn,
        position,
        id: newKey,
      },
      ...founder,
    ]);

    SetName("");
    SetLinkedIn("");
    setPosition("");
    setIsLoading(false);
  };

  const onEditClickHandler = (data) => {
    SetFounder(founder.filter((filteredData) => filteredData.id !== data.id));
    SetIsAddFounder(true);
    setSelectedData(data);
    SetName(() => data.name);
    SetLinkedIn(() => data.linkedIn);
    setPosition(() => data.position);
    setIsEditable(true);
  };

  const onSaveChangesHandler = async (e) => {
    e.preventDefault();
    SetIsAddFounder(false);
    setIsLoading(true);
    const founderImgUrl = await uploadMedia(founderImg, "rvpDeal/founders");
    SetFounder([
      { position, name, Image: founderImgUrl, linkedIn, id: selectedData.id },
      ...founder,
    ]);
    setIsEditable(false);
    setSelectedData("");
    SetName("");
    SetLinkedIn("");
    setPosition("");
    setIsLoading(false);
  };

  const onDeleteClickHandler = (data) => {
    SetFounder(founder.filter((filteredData) => filteredData.id !== data.id));
    // deleteMedia();
  };

  useEffect(() => {
    dispatch(setFounders(founder));
  }, [founder]);
  return (
    <>
      <form>
        <fieldset>
          <legend>Founders</legend>

          {isLoading
            ? "Uploading..."
            : founder.map((data) => {
                return (
                  <li key={data.id}>
                    {data.name}{" "}
                    <Trash onClick={() => onDeleteClickHandler(data)} />{" "}
                    <Pen onClick={() => onEditClickHandler(data)} />
                  </li>
                );
              })}

          {isAddFounder ? (
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
                    SetFounderImg(e.target.files[0]);
                  }
                }}
                type="file"
              />
              <input
                value={linkedIn || ""}
                onChange={(e) => SetLinkedIn(e.target.value)}
                placeholder="LinkedIn"
              />
              <input
                value={position || ""}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Position"
              />
              {isEditable ? (
                <button onClick={(e) => onSaveChangesHandler(e)}>
                  Save Changes
                </button>
              ) : (
                <button onClick={onAddFounderHandler}>Add</button>
              )}
            </>
          ) : (
            <button onClick={() => SetIsAddFounder(true)}>Add Founder</button>
          )}
        </fieldset>
      </form>
    </>
  );
};

export default AddFounder;
