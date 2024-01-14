import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { database } from "../../firebase/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import ViewFeedback from "./ViewFeedback";
import DeleteFeedbacl from "./DeleteFeedbacl";

const FeedBack = () => {
  const [showSelect, setShowSelect] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const allfeedback = useSelector((state) => state.contact.allfeedback);

  const openSelector = () => {
    if (selectedData.length === 0) {
      setShowSelect(!showSelect);
    } else {
      toast.error("Please Clear Selected");
    }
  };

  const datahandler = (id) => {
    if (selectedData.includes(id)) {
      setSelectedData(selectedData.filter((item) => item !== id));
    } else {
      setSelectedData([...selectedData, id]);
    }
  };

  const selectedAllHandler = () => {
    setShowSelect(true);
    setSelectedData(allfeedback.map((item) => item.id));
  };
  const deleteHandler = async (e) => {
    e.preventDefault();
    try {
      if (!Array.isArray(selectedData)) {
        throw new Error("Selected data is not an array");
      }
      if (selectedData.length > 0) {
        const deletePromises = selectedData.map((item) =>
          deleteDoc(doc(database, "Agents", item.id))
        );
        await Promise.all(deletePromises);
        toast.success("All selected Agents have been deleted successfully");
      } else {
        toast.error("Please select data");
      }
    } catch (error) {
      console.error("Error in deleteHandler:", error.message);
      toast.error("An error occurred while deleting Agents");
    }
  };
  return (
    <div>
      <div>
        <div className='manage-header'>
          <h3>Manage Agents</h3>
          <div className='manage-btn'>
            {selectedData.length > 0 && (
              <>
                <button onClick={deleteHandler}>Delete Selected</button>
                <button onClick={() => setSelectedData([])}>
                  Deselect All
                </button>
              </>
            )}
            <button onClick={selectedAllHandler}>Select All</button>
            <button onClick={openSelector}>
              {showSelect ? "Close" : "Open to Select"}
            </button>
          </div>
        </div>
        <table id='customers'>
          <thead>
            <tr>
              {showSelect && <th>Select</th>}
              <th>Id</th>
              <th>Phone</th>
              <th>Recommendation</th>
              <th>Review</th>
              <th>Experience</th>
              <th>Highlights</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allfeedback.map((item, index) => {
              return (
                <tr key={index}>
                  {showSelect && (
                    <td>
                      <input
                        style={{ height: "fit-content" }}
                        type='checkbox'
                        onChange={() => datahandler(item.id)}
                        checked={selectedData.includes(item.id)}
                      />
                    </td>
                  )}
                  <td>{item.id}</td>
                  <td>{item.Phone}</td>
                  <td>{item.recommendation}</td>
                  <td>{item.review}</td>
                  <td>{item.experience}</td>
                  <td>{item.highlights}</td>
                  <td>{item.rating}</td>
                  <td>
                    <div className='manage-btn'>
                      <DeleteFeedbacl docId={item.id} docPhone={item.Phone} />
                      <ViewFeedback
                        docId={item.id}
                        docPhone={item.Phone}
                        docRecommendation={item.recommendation}
                        docReview={item.review}
                        docExperience={item.experience}
                        docHighlights={item.highlights}
                        docRating={item.rating}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FeedBack;
