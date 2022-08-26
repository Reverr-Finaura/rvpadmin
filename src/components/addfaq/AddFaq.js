import { useEffect, useState } from "react";
import { Pen, Star, StarFill, Trash } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { setFaq } from "../../redux/createDealSlice";
import { keyGen } from "../../utils/keyGen";

const AddFaq = () => {
  const [isAddfaq, setIsAddFaq] = useState(false);
  const [question, setQuestion] = useState("");
  const [ans, setAns] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [selectedData, setSelectedData] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const dispatch = useDispatch();
  const onAddFaqHandler = () => {
    let newKey = keyGen();
    setIsAddFaq(false);
    setFaqs([{ Q: question, A: ans, id: newKey }, ...faqs]);
    setQuestion("");
    setAns("");
  };

  const onSaveChangesHandler = () => {
    setFaqs([{ Q: question, A: ans, id: selectedData.id }, ...faqs]);
    setIsAddFaq(false);
    setIsEditable(false);
    setSelectedData("");
    setQuestion("");
    setAns("");
  };

  const onEditClickHandler = (data) => {
    setFaqs(faqs.filter((filteredData) => filteredData.id !== data.id));
    setIsAddFaq(true);
    setSelectedData(data);
    setQuestion(data.Q);
    setAns(() => data.A);
    setIsEditable(true);
  };

  const onDeleteClickHandler = (data) => {
    setFaqs(faqs.filter((filteredData) => filteredData.id !== data.id));
  };

  useEffect(() => {
    dispatch(setFaq(faqs));
  }, [faqs]);

  return (
    <>
      <form>
        <fieldset>
          <legend>FAQ</legend>
          {faqs.length
            ? faqs.map((data) => {
                return (
                  <>
                    <h5 key={data.id} style={{ margin: 0 }}>
                      <StarFill /> {data.Q}{" "}
                      <Trash onClick={() => onDeleteClickHandler(data)} />
                      <Pen onClick={() => onEditClickHandler(data)} />
                    </h5>
                    <blockquote>{data.A}</blockquote>
                  </>
                  // <li key={data.id}>
                  //   {data.title}{" "}
                  //   <Trash onClick={() => onDeleteClickHandler(data)} />
                  //   <Pen onClick={() => onEditClickHandler(data)} />
                  // </li>
                );
              })
            : null}
          {isAddfaq ? (
            <>
              <input
                value={question || ""}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Q."
              />

              <input
                value={ans || ""}
                onChange={(e) => setAns(e.target.value)}
                placeholder="Ans. "
              />
              {isEditable ? (
                <button onClick={onSaveChangesHandler}>Save Changes</button>
              ) : (
                <button onClick={onAddFaqHandler}>Add</button>
              )}
            </>
          ) : (
            <button onClick={() => setIsAddFaq(true)}>Add Faq</button>
          )}
        </fieldset>
      </form>
    </>
  );
};

export default AddFaq;
