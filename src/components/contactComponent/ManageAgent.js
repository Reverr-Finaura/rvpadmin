import React, { useEffect, useState } from "react";
import "./contactComp.css";
import { database, getAllAgents } from "../../firebase/firebase";
import { deleteDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

const ManageAgent = () => {
  const rabe = [
    { name: "Manage", email: "manage@example.com", password: "password" },
    { name: "John Doe", email: "john.doe@example.com", password: "secure123" },
    {
      name: "Alice Smith",
      email: "alice.smith@example.com",
      password: "pass1234",
    },
    {
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      password: "bob123",
    },
    {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      password: "emily456",
    },
    {
      name: "Daniel Brown",
      email: "daniel.brown@example.com",
      password: "daniel789",
    },
    {
      name: "Olivia White",
      email: "olivia.white@example.com",
      password: "olivia123",
    },
    {
      name: "Michael Green",
      email: "michael.green@example.com",
      password: "michael456",
    },
    {
      name: "Sophia Black",
      email: "sophia.black@example.com",
      password: "sophia789",
    },
    {
      name: "David Miller",
      email: "david.miller@example.com",
      password: "david123",
    },
  ];
  const [data, setdata] = useState([]);
  useEffect(() => {
    const getAgents = async () => {
      try {
        const res = await getAllAgents();
        if (res.length > 0) {
          setdata(res);
        } else {
          setdata(rabe);
        }
      } catch (error) {}
    };
    getAgents();
  }, []);

  const deleteAgnet = async (email) => {
    try {
      await deleteDoc(database, "Agents", email);
      toast.success("User have been successfully Added");
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
