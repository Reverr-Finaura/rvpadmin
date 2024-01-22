import React from "react";
import style from "./style.module.css";
import { toast } from "react-toastify";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { auth, database } from "../../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

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
    if (!name || !email || !password) {
      toast.error("Fill all fields");
      return;
    }
    if (password.length <= 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoadings(true);
    const data = {
      name: name,
      email: email,
      password: password,
      isAgent: true,
    };
    try {
      const existingUser = await fetchSignInMethodsForEmail(auth, email);
      if (existingUser.length === 0) {
        await setDoc(doc(database, "Agents", data.email), { ...data });
        toast.success("Agent has been successfully added");
      } else {
        toast.error(`Agent ${email} already exists`);
      }
      setLoadings(false);
      reset();
    } catch (error) {
      setLoadings(false);
      console.error(error);
    }
  };

  return (
    <div className={style.Wrapper}>
      <div className={style.agentContainer}>
        <div className={style.heading}>
          <h3>Add User Form</h3>
        </div>
        <form>
          <div className={style.inputField}>
            <label>Name</label>
            <input
              type='type'
              placeholder='Enter a Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={style.inputField}>
            <label>Email</label>
            <input
              type='email'
              placeholder='Enter a Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={style.inputField}>
            <label>Password</label>
            <input
              type='password'
              placeholder='Enter a password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={style.formbutton}>
            <button>Send Message</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAgent;
