import { useDispatch, useSelector } from "react-redux";
import "./dashboard.css";
import { Link } from "react-router-dom";
import { getInvestorDealsFromDatabase } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import DisplayCard from "../../components/DisplayCard";
import { HourglassSplit } from "react-bootstrap-icons";
import { setInvestorDeals } from "../../redux/createDealSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

<<<<<<< HEAD
  const investorDeals = useSelector((state) => state.investorDeals);
=======
  // investordeals data to be mapped
  const investorDeals = useSelector(
    (state) => state.investorDeal.investorDeals
  );
>>>>>>> e1884cca9cafb97dca11e1e6f1b9dbb130c12585
  const [isLoading, setIsLoading] = useState(true);

  const getInvestorDeals = async () => {
    const results = await getInvestorDealsFromDatabase();
    if (results.length) {
      dispatch(setInvestorDeals(results));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getInvestorDeals();
  }, []);

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
<<<<<<< HEAD
                Fetching <HourglassSplit /> Investor Deals
              </h3>
            ) : (
              investorDeals.investorDeals.map((data) => (
                <DisplayCard key={data.id} data={data} />
=======
                Fetching <HourglassSplit /> Deals
              </h3>
            ) : (
              investorDeals.map((data) => (
                <DealCard key={data.id} data={data} />
>>>>>>> e1884cca9cafb97dca11e1e6f1b9dbb130c12585
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
