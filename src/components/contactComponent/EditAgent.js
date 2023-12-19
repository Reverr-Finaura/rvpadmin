import * as React from "react";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { database } from "../../firebase/firebase";
import "./contactComp.css";
import { doc, updateDoc } from "firebase/firestore";
import { MdModeEdit } from "react-icons/md";

const EditAgent = ({ docId, docName, docEmail, docPassword }) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [name, setName] = React.useState(docName);
  const [email, setEmail] = React.useState(docEmail);
  const [password, setPassword] = React.useState(docPassword);
  const [loadings, setLoadings] = React.useState(false);
  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
  };
  // const updateUserData = async (authuser, email, password, data, docId) => {
  //   await updateEmail(authuser, email);
  //   await updatePassword(authuser, password);
  // };
  const submit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Fill all fields");
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
      await updateDoc(doc(database, "Agents", docId), { ...data });
      // const existingUser = await fetchSignInMethodsForEmail(auth, email);
      // if (existingUser.length === 1) {
      //   const authuser = auth.currentUser;
      //   await updateUserData(authuser, email, password, data, docId);
      // } else {
      //   toast.error(`User ${email} already exists`);
      // }
      toast.success("User has been successfully added");
      setLoadings(false);
      reset();
    } catch (error) {
      setLoadings(false);
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <MdModeEdit onClick={handleClickOpen}></MdModeEdit>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby='responsive-dialog-title'
      >
        <div className='edit-fotm'>
          <div className='manage-header'>
            <h3>Add Agent Form</h3>
            <button onClick={handleClose}>Close</button>
          </div>
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
              <button disabled={loadings}>Add Agent</button>
            </div>
          </form>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default EditAgent;
