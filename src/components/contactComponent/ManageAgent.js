import React, { useEffect, useState } from "react";
import "./contactComp.css";
import { database, getAllAgents } from "../../firebase/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import EditAgent from "./EditAgent";
import ViewAgent from "./ViewAgent";
import DeleteAgent from "./DeleteAgent";

const ManageAgent = () => {
  const [data, setdata] = useState([]);
  const [showSelect, setShowSelect] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  useEffect(() => {
    const unsubscribeMessage = getAllAgents((userdata) => {
      setdata(userdata);
    });
    return () => {
      unsubscribeMessage();
    };
  }, []);

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
    setSelectedData(data.map((item) => item.id));
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
                  UnSelected All
                </button>
              </>
            )}
            <button onClick={openSelector}>
              {showSelect ? "Close" : "Open to Select"}
            </button>
            <button onClick={selectedAllHandler}>Select All</button>
          </div>
        </div>
        <table id='customers'>
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
            {data.map((item, index) => {
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
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.password}</td>
                  <td>
                    <div className='manage-btn'>
                      <DeleteAgent
                        setdata={setdata}
                        docEmail={item.email}
                        docName={item.name}
                      />
                      <EditAgent
                        docId={item.id}
                        docName={item.name}
                        docEmail={item.email}
                        docPassword={item.password}
                        docChatAssigned={item.assignedChats}
                      />
                      <ViewAgent
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
      <ToastContainer />
    </div>
  );
};

export default ManageAgent;
