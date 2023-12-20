import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
// import { signInWithEmailAndPassword } from "firebase/auth";
import { getAllAgents } from "../../firebase/firebase";
import "react-toastify/dist/ReactToastify.css";
import "./signin.css";

const AgentSignIn = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agents, setAgents] = useState([]);
  const navigate = useNavigate();

  const getAgents = async () => {
    const results = await getAllAgents();
    if (results.length) {
      setAgents([...results]);
    }
  };

  useEffect(() => {
    getAgents();
  }, []);

  const checkEmailandPassword = () => {
    if (email.length && password.length) {
      const filteredAgents = agents.filter(
        (data) => data.email === email && data.password === password
      );
      if (filteredAgents.length) {
        dispatch(login({ email, isAdmin: false, isAgent: true }));
        navigate("/contact");
      } else {
        toast.error("Please enter a valid email or password !", {
          autoClose: 2000,
        });
      }
    } else {
      toast.error("Fields Can't be empty !", { autoClose: 2000 });
    }
  };

  const handleAdminLogin = () => {
    navigate("/");
  };

  return (
    <>
      <div className='SignIn_MainContainer'>
        <h1 style={{ color: "grey" }}>Agent</h1>
        <div className='SignIn_Container'>
          <p>SignIn</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            value={email}
          />
          <input
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            value={password}
          />
          <button onClick={checkEmailandPassword} className='SingIn_Btn'>
            Sign In
          </button>
          <p className='admin_login_click' onClick={handleAdminLogin}>
            for Admin SignIn
          </p>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AgentSignIn;
