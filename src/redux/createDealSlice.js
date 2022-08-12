import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  investorDeals: null,
  selectedUser: null,
};

export const investorDealSlice = createSlice({
  name: "investorDeal",
  initialState,
  reducers: {
    setInvestorDeals: (state, action) => {
      state.investorDeals = action.payload;
    },

    deleteDeal: (state, action) => {
      state.investorDeal = state.investorDeal.filter(
        (data) => data.id !== action.payload
      );
    },
  },
});

export const { setInvestorDeals, deleteDeal } = investorDealSlice.actions;

export default investorDealSlice.reducer;
