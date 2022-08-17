import { useEffect, useState } from "react";
import { Pen, Trash } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { setDealHighlight } from "../../redux/createDealSlice";
import { keyGen } from "../../utils/keyGen";

const AddHighlight = () => {
  const [isAddHighlight, setIsAddHighlight] = useState(false);
  const [highlight, setHighlight] = useState("");
  const [higlights, setHiglights] = useState([]);
  const [selectedData, setSelectedData] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const dispatch = useDispatch();
  const onAddHighlightHandler = () => {
    let newKey = keyGen();
    setIsAddHighlight(false);
    setHiglights([{ title: highlight, id: newKey }, ...higlights]);
    setHighlight("");
  };

  const onSaveChangesHandler = () => {
    setHiglights([...higlights, { title: highlight, id: selectedData.id }]);
    setIsAddHighlight(false);
    setIsEditable(false);
    setSelectedData("");
    setHighlight("");
  };

  const onEditClickHandler = (data) => {
    setHiglights(
      higlights.filter((filteredData) => filteredData.id !== data.id)
    );
    setIsAddHighlight(true);
    setSelectedData(data);
    setHighlight(() => data.title);
    setIsEditable(true);
  };

  const onDeleteClickHandler = (data) => {
    setHiglights(
      higlights.filter((filteredData) => filteredData.id !== data.id)
    );
  };

  useEffect(() => {
    dispatch(setDealHighlight(higlights));
  }, [higlights]);

  return (
    <>
      <form>
        <fieldset>
          <legend>Highlight</legend>
          {higlights.length
            ? higlights.map((data) => {
                return (
                  <li key={data.id}>
                    {data.title}{" "}
                    <Trash onClick={() => onDeleteClickHandler(data)} />
                    <Pen onClick={() => onEditClickHandler(data)} />
                  </li>
                );
              })
            : null}
          {isAddHighlight ? (
            <>
              <input
                value={highlight || ""}
                onChange={(e) => setHighlight(e.target.value)}
                placeholder="Highlight"
              />
              {isEditable ? (
                <button onClick={onSaveChangesHandler}>Save Changes</button>
              ) : (
                <button onClick={onAddHighlightHandler}>Add</button>
              )}
            </>
          ) : (
            <button onClick={() => setIsAddHighlight(true)}>
              Add Highlight
            </button>
          )}
        </fieldset>
      </form>
    </>
  );
};

export default AddHighlight;
