import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk middleware for API calls

// pan verification
export const verifyPan = createAsyncThunk(
  "customers/verifyPan",
  async (panNumber, thunkAPI) => {
    try {
      const response = await axios.post(
        "https://lab.pixel6.co/api/verify-pan.php",
        { panNumber }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

// postcode verification
export const getPostcodeDetails = createAsyncThunk(
  "customers/getPostcodeDetails",
  async (postcode) => {
    const response = await axios.post(
      "https://lab.pixel6.co/api/get-postcode-details.php",
      { postcode }
    );
    return response.data;
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [],
    panVerification: {},
    postcodeDetails: {},
    status: "idle",
    loading: false,
    error: null,
  },
  reducers: {
    addCustomer: (state, action) => {
      state.customers.push(action.payload);
    },
    editCustomer: (state, action) => {
      const { id, customer } = action.payload;
      const index = state.customers.findIndex((cid) => cid.id === id);
      if (index !== -1) {
        state.customers[index] = customer;
      }
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter(
        (customer) => customer.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyPan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyPan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.panVerification = action.payload;
      })
      .addCase(verifyPan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      });
  },
});

export const { addCustomer, editCustomer, deleteCustomer } =
  customerSlice.actions;
export default customerSlice.reducer;
