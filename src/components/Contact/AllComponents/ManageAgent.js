import { deleteDoc, doc } from "firebase/firestore";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { database } from "../../../firebase/firebase";
import style from "./style.module.css";
import EditAgentModal from "../Popup/EditAgentModal";
import ViewAgentModal from "../Popup/ViewAgentModal";
import DeleteAgentModal from "../Popup/DeleteAgentModal";
import Pagination from "../Navbar/Pagination";

const ManageAgent = () => {
  const [showSelect, setShowSelect] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [loadings, setLoadings] = React.useState(false);
  const allagents = useSelector((state) => state.contact.allAgents);

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
    setSelectedData(allagents.map((item) => item.id));
  };
  const deleteHandler = async (e) => {
    e.preventDefault();
    setLoadings(true);
    try {
      if (!Array.isArray(selectedData)) {
        throw new Error("Selected data is not an array");
      }
      if (selectedData.length > 0) {
        const deletePromises = selectedData.map(
          async (item) => await deleteDoc(doc(database, "Agents", item.id))
        );
        await Promise.all(deletePromises);
        toast.success("All selected Agents have been deleted successfully");
      } else {
        toast.error("Please select data");
      }
    } catch (error) {
      console.error("Error in deleteHandler:", error.message);
      toast.error("An error occurred while deleting Agents");
    } finally {
      setLoadings(false);
    }
  };
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = allagents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = parseInt(page || 1);
  const paginatedAgent = allagents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={style.tableWrapper}>
      <div className={style.tableAction}>
        {selectedData.length > 0 && (
          <>
            <button onClick={deleteHandler} disabled={loadings}>
              Delete Selected
            </button>
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
          <h3>Manage Agent</h3>
        </div>
        <div style={{ height: "84%" }}>
          <table className={style.allTable}>
            <thead>
              <tr>
                {showSelect && <th>Select</th>}
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAgent.map((item, index) => {
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
                    <td>{index + 1}.</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.password}</td>
                    <td>
                      <div className={style.agentAction}>
                        <DeleteAgentModal
                          docEmail={item.email}
                          docName={item.name}
                        />
                        <EditAgentModal
                          docId={item.id}
                          docName={item.name}
                          docEmail={item.email}
                          docPassword={item.password}
                          docChatAssigned={item.assignedChats}
                        />
                        <ViewAgentModal
                          docId={item.id}
                          docName={item.name}
                          docEmail={item.email}
                          docPassword={item.password}
                          docChatAssigned={item.assignedChats}
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
          data={allagents}
          currentPage={currentPage}
          totalPages={totalPages}
          setPage={setPage}
        />
        <ToastContainer />
      </div>
    </div>
  );
};

export default ManageAgent;
