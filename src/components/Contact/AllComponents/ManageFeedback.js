import { deleteDoc, doc } from "firebase/firestore";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { database } from "../../../firebase/firebase";
import style from "./style.module.css";
import DeleteFeedbackModal from "../Popup/DeleteFeedbackModal";
import ViewFeedbackModal from "../Popup/ViewFeedbackModal";
import Pagination from "../Navbar/Pagination";

const ManageFeedback = () => {
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
  console.log(selectedData);
  const deleteHandler = async (e) => {
    e.preventDefault();
    try {
      if (!Array.isArray(selectedData)) {
        throw new Error("Selected data is not an array");
      }
      if (selectedData.length > 0) {
        const deletePromises = selectedData.map((item) =>
          deleteDoc(doc(database, "Feedback", item))
        );
        await Promise.all(deletePromises);
        toast.success("All selected Feedback have been deleted successfully");
      } else {
        toast.error("Please select data");
      }
    } catch (error) {
      console.error("Error in deleteHandler:", error.message);
      toast.error("An error occurred while deleting Feedback");
    }
  };
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = allfeedback.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = parseInt(page || 1);
  const paginatedFeedback = allfeedback.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className={style.tableWrapper}>
      <div className={style.tableAction}>
        {selectedData.length > 0 && (
          <>
            <button onClick={deleteHandler}>Delete Selected</button>
            <button onClick={() => setSelectedData([])}>Deselect All</button>
          </>
        )}
        <button onClick={selectedAllHandler}>Select All</button>
        <button onClick={openSelector}>
          {showSelect ? "Close" : "Open to Select"}
        </button>
      </div>
      <div className={style.tableContainer} style={{ height: "75vh" }}>
        <div className={style.tableheading}>
          <h3>Manage Feedback</h3>
        </div>
        <div style={{ height: "85%" }}>
          <table className={style.allTable}>
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
              {paginatedFeedback.map((item, index) => {
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
                    <td style={{ width: "20%" }}>{item.id}</td>
                    <td>{item.Phone}</td>
                    <td>{item.recommendation}</td>
                    <td>{item.review}</td>
                    <td>{item.experience}</td>
                    <td>{item.highlights}</td>
                    <td>{item.rating}</td>
                    <td>
                      <div className={style.agentAction}>
                        <DeleteFeedbackModal
                          docId={item.id}
                          docPhone={item.Phone}
                        />
                        <ViewFeedbackModal
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
        <Pagination
          data={allfeedback}
          currentPage={currentPage}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default ManageFeedback;
