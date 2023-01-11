import { configureStore } from "@reduxjs/toolkit";
import investorDealReducer from "../redux/createDealSlice";
import userReducer from "../redux/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    investorDeals: investorDealReducer,
  },
});
