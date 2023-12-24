import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { fetchSignInMethodsForEmail } from "firebase/auth";
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
    console.log(data);
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
    <div>
      <div>
        <h3>Add Agent Form</h3>
        <form onSubmit={submit}>
          <div className="input-feilds">
            <label>Name</label>
            <input
              type="type"
              placeholder="Enter a Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-feilds">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter a Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-feilds">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-feilds">
            <button disabled={loadings}>Add Agent</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddAgent;
