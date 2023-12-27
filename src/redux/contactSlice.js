import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allAdminChats: [],
  allAgentsChats: [],
  allAgents: [],
  editAgentsChats: [],
};

export const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setAdminChats: (state, action) => {
      state.allAdminChats = action.payload;
    },
    setAgentChats: (state, action) => {
      state.allAgentsChats = action.payload;
    },
    setAllAgent: (state, action) => {
      state.allAgents = action.payload;
    },
    setEditAgentsChats: (state, action) => {
      state.editAgentsChats = action.payload;
    },
  },
});

export const { setAdminChats, setAgentChats, setAllAgent, setEditAgentsChats } =
  contactSlice.actions;
export default contactSlice.reducer;
