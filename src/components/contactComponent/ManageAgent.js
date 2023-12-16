import React, { useEffect, useState } from "react";
import "./contactComp.css";
import { database, getAllAgents } from "../../firebase/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

const ManageAgent = () => {
  const [data, setdata] = useState([]);

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
    console.log("delete" + email);
    try {
      await deleteDoc(doc(database, "Agents", email));
      setdata((prevData) => prevData.filter((item) => item.email !== email));
      toast.success(`${email} have been successfully deleted`);
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <div>
      <div>
        <h3>Manage Agents</h3>
        <table id='customers'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.password}</td>
                  <td>
                    <button onClick={() => deleteAgnet(item.email)}>
                      Delete
                    </button>
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
