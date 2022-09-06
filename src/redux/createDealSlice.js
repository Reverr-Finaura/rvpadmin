import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

const initialState = {
  investorDeals: null,
  selectedUser: null,
  investors: null,
  founders: null,
  advisors: null,
  faqs: null,
  dealHighlight: null,
  meetings: null,
  selectedDeal: null,
};

export const investorDealSlice = createSlice({
  name: "investorDeals",
  initialState,
  reducers: {
    setInvestorDeals: (state, action) => {
      state.investorDeals = action.payload;
    },

    setInvestors: (state, { payload }) => {
      state.investors = payload;
    },

    setFounders: (state, { payload }) => {
      state.founders = payload;
    },

    setAdvisors: (state, { payload }) => {
      state.advisors = payload;
    },

    setFaq: (state, { payload }) => {
      state.faqs = payload;
    },

    setDealHighlight: (state, { payload }) => {
      state.dealHighlight = payload;
    },

    setDealMeetings: (state, { payload }) => {
      state.meetings = payload;
    },
    setSelectedDeal: (state, { payload }) => {
      state.selectedDeal = payload;
    },

    deleteDeal: (state, action) => {
      state.investorDeals = state.investorDeals.filter(
        (data) => data.id !== action.payload
      );
    },
  },
});

export const {
  setInvestorDeals,
  deleteDeal,
  updateDeal,
  setInvestors,
  setAdvisors,
  setFounders,
  setFaq,
  setDealHighlight,
  setDealMeetings,
  setSelectedDeal,
} = investorDealSlice.actions;

export default investorDealSlice.reducer;
