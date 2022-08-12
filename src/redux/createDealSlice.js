import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  investorDeals: null,
  selectedUser: null,
};

export const investorDealSlice = createSlice({
  name: "investorDeals",
  initialState,
  reducers: {
    setInvestorDeals: (state, action) => {
      state.investorDeals = action.payload;
    },

    deleteDeal: (state, action) => {
      state.investorDeals = state.investorDeals.filter(
        (data) => data.id !== action.payload
      );
    },

    updateDeal: (state, action) => {
      state.investorDeals = action.payload;
    },
  },
});

export const { setInvestorDeals, deleteDeal, updateDeal } =
  investorDealSlice.actions;

export default investorDealSlice.reducer;
