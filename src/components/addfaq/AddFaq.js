import { useEffect, useState } from "react";
import { Pen, Trash } from "react-bootstrap-icons";
import { keyGen } from "../../utils/keyGen";

const AddFaq = () => {
  const [isAddfaq, setIsAddFaq] = useState(false);
  const [faq, setFaq] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [selectedData, setSelectedData] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  const onAddFaqHandler = () => {
    let newKey = keyGen();
    setIsAddFaq(false);
    setFaqs([{ title: faq, id: newKey }, ...faqs]);
    setFaq("");
  };

  const onSaveChangesHandler = () => {
    setFaqs([...faqs, { title: faq, id: selectedData.id }]);
    setIsAddFaq(false);
    setIsEditable(false);
    setSelectedData("");
    setFaq("");
  };

  const onEditClickHandler = (data) => {
    setFaqs(faqs.filter((filteredData) => filteredData.id !== data.id));
    setIsAddFaq(true);
    setSelectedData(data);
    setIsEditable(true);
  };

  const onDeleteClickHandler = (data) => {
    setFaqs(faqs.filter((filteredData) => filteredData.id !== data.id));
  };

  useEffect(() => {
    setFaq(selectedData.title);
  }, [isEditable]);

  return (
    <>
      <form>
        <fieldset>
          <legend>Faq</legend>
          {faqs.length
            ? faqs.map((data) => {
                return (
                  <li key={data.id}>
                    {data.title}{" "}
                    <Trash onClick={() => onDeleteClickHandler(data)} />
                    <Pen onClick={() => onEditClickHandler(data)} />
                  </li>
                );
              })
            : null}
          {isAddfaq ? (
            <>
              <input
                value={faq || ""}
                onChange={(e) => setFaq(e.target.value)}
                placeholder="Faq"
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
