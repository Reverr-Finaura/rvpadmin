import { useEffect, useState } from "react";
import { Pen, Trash } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { uploadMedia } from "../../firebase/firebase";
import { setInvestors } from "../../redux/createDealSlice";
import { dateGenerator } from "../../utils/dategenerator";
import { keyGen } from "../../utils/keyGen";

const AddInvestor = () => {
  const [name, SetName] = useState("");
  const [linkedIn, SetLinkedIn] = useState("");
  const [isAddInvestor, SetIsAddInvestor] = useState(false);
  const [investors, SetInvestors] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [investorImg, SetInvestorImg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const onAddInvestorHandler = async () => {
    setIsLoading(true);
    let newKey = keyGen();
    SetIsAddInvestor(false);
    const investorImgUrl = await uploadMedia(investorImg, "rvpDeal/investors");
    SetInvestors([
      {
        name,
        image: { imageName: investorImg.name, imageUrl: investorImgUrl },
        linkedIn,
        id: newKey,
      },
      ...investors,
    ]);

    SetName("");
    SetLinkedIn("");
    setIsLoading(false);
  };

  const onEditClickHandler = (data) => {
    SetInvestors(
      investors.filter((filteredData) => filteredData.id !== data.id)
    );
    SetIsAddInvestor(true);
    setSelectedData(data);
    SetName(() => data.name);
    SetLinkedIn(() => data.linkedIn);
    setIsEditable(true);
  };

  const onSaveChangesHandler = async (e) => {
    e.preventDefault();
    SetIsAddInvestor(false);

    setIsLoading(true);
    console.log(investorImg);
    const investorImgUrl = await uploadMedia(investorImg, "rvpDeal/investors");
    SetInvestors([
      { name, Image: investorImgUrl, linkedIn, id: selectedData.id },
      ...investors,
    ]);
    setIsEditable(false);
    setSelectedData("");
    SetName("");
    SetLinkedIn("");
    setIsLoading(false);
  };

  const onDeleteClickHandler = (data) => {
    SetInvestors(
      investors.filter((filteredData) => filteredData.id !== data.id)
    );
    // deleteMedia();
  };

  useEffect(() => {
    dispatch(setInvestors(investors));
  }, [investors]);
  return (
    <>
      <form>
        <fieldset>
          <legend>Investors</legend>

          {isLoading
            ? "Uploading..."
            : investors.map((data) => {
                return (
                  <li key={data.id}>
                    {data.name}{" "}
                    <Trash onClick={() => onDeleteClickHandler(data)} />{" "}
                    <Pen onClick={() => onEditClickHandler(data)} />
                  </li>
                );
              })}

          {isAddInvestor ? (
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
                    SetInvestorImg(e.target.files[0]);
                  }
                }}
                type="file"
              />
              <input
                value={linkedIn || ""}
                onChange={(e) => SetLinkedIn(e.target.value)}
                placeholder="LinkedIn"
              />
              {isEditable ? (
                <button onClick={(e) => onSaveChangesHandler(e)}>
                  Save Changes
                </button>
              ) : (
                <button onClick={onAddInvestorHandler}>Add</button>
              )}
            </>
          ) : (
            <button onClick={() => SetIsAddInvestor(true)}>Add Investor</button>
          )}
        </fieldset>
      </form>
    </>
  );
};

export default AddInvestor;
