import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, database } from "../../firebase/firebase";
import "./contactComp.css";

const AddAgent = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loadings, setLoadings] = React.useState(false);
  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (name === "" && email === "" && password === "") {
      setLoadings(true);
      const data = {
        name: name,
        email: email,
        password: password,
      };
      try {
        const existingUser = await fetchSignInMethodsForEmail(auth, email);
        if (existingUser.length === 0) {
          await createUserWithEmailAndPassword(auth, email, password);
          await setDoc(doc(database, "Agents", data.email), { ...data });
          toast.success("User have been successfully Added");
        } else {
          toast.error(`User ${name} already exists`);
        }
        setLoadings(false);
        reset();
      } catch (error) {
        console.error(error);
      }
    } else {
      toast.error(`Fill all fields`);
    }
  };

  return (
    <div>
      <div>
        <h3>Add Agent Form</h3>
        <form onSubmit={submit}>
          <div className='input-feilds'>
            <label>Name</label>
            <input
              type='type'
              placeholder='Enter a Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='input-feilds'>
            <label>Email</label>
            <input
              type='email'
              placeholder='Enter a Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='input-feilds'>
            <label>Password</label>
            <input
              type='password'
              placeholder='Enter a password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='input-feilds'>
            <button disable={loadings}>Add Agent</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddAgent;
