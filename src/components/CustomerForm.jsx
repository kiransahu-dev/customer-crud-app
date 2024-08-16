import React, { useEffect, useState } from "react";
import { getPostcodeDetails, verifyPan } from "../features/CustomerSlice";
import { useDispatch, useSelector } from "react-redux";

const CustomerForm = ({ customer = {}, onSave }) => {
  const dispatch = useDispatch();
  const panVerification = useSelector((state) => {
    console.log("State:", state);
    return state.customers?.panVerification;
  });
  const status = useSelector((state) => state.customers?.status);
  const error = useSelector((state) => state.customers?.error);

  const postcodeDetails = useSelector((state) => {
    return state.customers?.postcodeDetails;
  });

  const [formData, setFormData] = useState({
    pan: customer.pan || "",
    fullName: customer.fullName || "",
    email: customer.email || "",
    mobileNumber: customer.mobileNumber || "",
    addresses: customer.addresses || [
      { line1: "", line2: "", postcode: "", state: "", city: "" },
    ],
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: [e.target.value] });
    console.log(formData);
  };

  // address handler
  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
    setFormData({ ...formData, addresses: updatedAddresses });

    if (name === "postcode" && value.length === 6) {
      dispatch(getPostcodeDetails(value));
    }
  };

  // pan blur
  const handlePanBlur = () => {
    if (formData.pan.length === 10) {
      dispatch(verifyPan(formData.pan));
    }
  };

  // submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // pan verification
  useEffect(() => {
    if (status === "succeeded" && panVerification.isValid) {
      setFormData((prevState) => ({
        ...prevState,
        fullName: panVerification.fullName,
      }));
    }
  }, [status, panVerification]);

  // address verification
  useEffect(() => {
    if (status === "succeeded") {
      setFormData((prevState) => {
        const updatedAddresses = [...prevState.addresses];
        updatedAddresses[0].city = postcodeDetails.city[0].name;
        updatedAddresses[0].state = postcodeDetails.state[0].name;
        return { ...prevState, addresses: updatedAddresses };
      });
    }
  }, [postcodeDetails]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>PAN:</label>
          <input
            type="text"
            name="pan"
            value={formData.pan}
            onChange={handleInputChange}
            onBlur={handlePanBlur}
            maxLength={10}
            required
          />
          {status === "loading" && <span>Loading...</span>}
          {status === "failed" && <span>Error: {error}</span>}
        </div>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            maxLength={140}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            maxLength={255}
            required
          />
        </div>
        <div>
          <label>Mobile Number:</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            maxLength={10}
            required
          />
        </div>

        {formData.addresses.map((address, index) => (
          <div key={index}>
            <h4>Address {index + 1}</h4>
            <div>
              <label>Address Line 1:</label>
              <input
                type="text"
                name="line1"
                value={address.line1}
                onChange={(e) => handleAddressChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Address Line 2:</label>
              <input
                type="text"
                name="line2"
                value={address.line2}
                onChange={(e) => handleAddressChange(index, e)}
              />
            </div>
            <div>
              <label>Postcode:</label>
              <input
                type="number"
                name="postcode"
                value={address.postcode}
                onChange={(e) => handleAddressChange(index, e)}
                maxLength={6}
                required
              />
            </div>
            <div>
              <label>State:</label>
              <select
                name="state"
                value={address.state}
                onChange={(e) => handleAddressChange(index, e)}
              >
                <option value="">{address.state || "Select State"}</option>
              </select>
            </div>
            <div>
              <label>City:</label>
              <select
                name="city"
                value={address.city}
                onChange={(e) => handleAddressChange(index, e)}
              >
                <option value="">{address.city || "Select City"}</option>
              </select>
            </div>
          </div>
        ))}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CustomerForm;
