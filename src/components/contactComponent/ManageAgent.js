import React, { useEffect, useState } from "react";
import "./contactComp.css";
import { database, getAllAgents } from "../../firebase/firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import EditAgent from "./EditAgent";
import ViewAgent from "./ViewAgent";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";

const ManageAgent = () => {
  const user = useSelector((state) => state.user.user);
  const [data, setdata] = useState([]);
  const [showSelect, setShowSelect] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  useEffect(() => {
    const getAgents = async () => {
      try {
        const res = await getAllAgents();
        if (res.length > 0) {
          setdata(res);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    getAgents();
  }, []);
  const deleteAgnet = async (email) => {
    try {
      const agentRef = doc(database, "Agents", email);
      const agentDoc = await getDoc(agentRef);
      const agentData = agentDoc.data();
      if (agentData && user.isAdmin) {
        await deleteDoc(agentRef);
        setdata((prevData) => prevData.filter((item) => item.email !== email));
        toast.success("Agent has been successfully deleted");
      } else {
        toast.error("Agent not found");
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

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
  const deleteHandler = () => {
    if (selectedData.length > 0) {
      selectedData.map(async (item) => {
        await deleteDoc(doc(database, "Agents", item.id));
      });
      toast.success("All selected Agents has been deleted succesfully");
    } else {
      toast.error("Please Selected data");
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
                      <MdDelete
                        onClick={() => deleteAgnet(item.email)}
                      ></MdDelete>
                      <EditAgent
                        docId={item.id}
                        docName={item.name}
                        docEmail={item.email}
                        docPassword={item.password}
                      />
                      <ViewAgent
                        docId={item.id}
                        docName={item.name}
                        docEmail={item.email}
                        docPassword={item.password}
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
