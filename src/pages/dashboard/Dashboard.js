import { useDispatch, useSelector } from "react-redux";
import "./dashboard.css";
import { Link } from "react-router-dom";
import { getInvestorDealsFromDatabase } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import DisplayCard from "../../components/displaycard/DisplayCard";
import { HourglassSplit } from "react-bootstrap-icons";
import { setInvestorDeals } from "../../redux/createDealSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  window.scroll(0, 0);

  const [isLoading, setIsLoading] = useState(true);
  const getInvestorDeals = async () => {
    const results = await getInvestorDealsFromDatabase();
    if (results.length) {
      dispatch(setInvestorDeals([...results]));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getInvestorDeals();
  }, []);

  const investorDeals = useSelector((state) => state.investorDeals);
  console.log(investorDeals);
  return (
    <>
      <div className="Dashboard_MainContainer">
        <div className="Dashboard_Container">
          <div className="L_Container">
            <h1 style={{ color: "grey" }}>Admin</h1>
            {/* <h3>{user !== null ? user.user : "User"}</h3> */}
            <Link to="/create-deal">
              <button>Create Deal</button>
            </Link>
            {/* <button onClick={() => dispatch(logout())}>Logout</button> */}
          </div>
          <div className="R_Container">
            {isLoading ? (
              <h3>
                Fetching <HourglassSplit /> Investor Deals
              </h3>
            ) : (
              investorDeals.investorDeals.map((data) => (
                <DisplayCard key={data.id} data={data} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
