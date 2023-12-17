import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import "react-toastify/dist/ReactToastify.css";
import "./signin.css";

const AgentSignIn = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const checkEmailAndPassword = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        dispatch(login(email));
        navigate("/contact2"); // Adjust the path as per your route structure
      } else {
        toast.error("Authentication failed. Please check your credentials.", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Error signing in. Please try again later.", {
        autoClose: 2000,
      });
      console.error(error);
    }
  };

  return (
    <>
      <div className="SignIn_MainContainer">
        <h1 style={{ color: "grey" }}>Agent</h1>
        <div className="SignIn_Container">
          <p>SignIn</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            value={email}
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            value={password}
          />
          <button onClick={checkEmailAndPassword} className="SingIn_Btn">
            Sign In
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AgentSignIn;
