import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAdminsFromDatabase } from "../../firebase/firebase";
import { login } from "../../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./signin.css";

const SignIn = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  console.log(user);
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const getAdmin = async () => {
    const results = await getAdminsFromDatabase();
    if (results.length) {
      setAdmins([...results]);
    }
  };
  useEffect(() => {
    if (user !== null && user?.isAdmin === true) {
      navigate("/dashboard");
    }
  }, [navigate, user, user?.isAdmin]);

  useEffect(() => {
    getAdmin();
  }, []);

  const checkEmailandPassword = () => {
    if (email.length && password.length) {
      const filteredAdmin = admins.filter(
        (data) => data.email === email && data.password === password
      );
      if (filteredAdmin.length) {
        dispatch(login({ email, isAdmin: true, isAgent: false }));
        navigate("dashboard");
      } else {
        toast.error("Please enter a valid email or password !", {
          autoClose: 2000,
        });
      }
    } else {
      toast.error("Fields Can't be empty !", { autoClose: 2000 });
    }
  };

  const handleAgentLogin = () => {
    navigate("/agentSignIn");
  };

  return (
    <>
      <div className='SignIn_MainContainer'>
        <h1 style={{ color: "grey" }}>Admin</h1>
        <div className='SignIn_Container'>
          <p>SignIn</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
          />
          <input
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
          />
          <button onClick={checkEmailandPassword} className='SingIn_Btn'>
            Sign In
          </button>
          <p className='admin_login_click' onClick={handleAgentLogin}>
            for Agents SignIn
          </p>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SignIn;
