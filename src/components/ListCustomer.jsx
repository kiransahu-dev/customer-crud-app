import React from "react";
import CustomerForm from "./CustomerForm";
import { useSelector, useDispatch } from "react-redux";
import { deleteCustomer, editCustomer } from "../features/CustomerSlice";

const ListCustomer = () => {
  const customers = useSelector((state) => state.customers?.customers || []);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteCustomer(id));
  };

  const handleEdit = (customer) => {
    dispatch(editCustomer(customer.pan, customer));
  };

  console.log("Customers:", customers); // Debugging statement to check data

  return (
    <div>
      <h1>Customer List</h1>
      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        customers.map((customer) => (
          <div key={customer.pan}>
            <h2>{customer.fullName}</h2>
            <p>PAN: {customer.pan}</p>
            <p>Email: {customer.email}</p>
            <p>Mobile: {customer.mobileNumber}</p>
            {customer.addresses.map((address, index) => (
              <div key={index}>
                <p>Address {index + 1}:</p>
                <p>Line 1: {address.line1}</p>
                <p>Line 2: {address.line2}</p>
                <p>Postcode: {address.postcode}</p>
                <p>State: {address.state}</p>
                <p>City: {address.city}</p>
              </div>
            ))}
            <CustomerForm customer={customer} onSave={handleEdit} />
            <button onClick={() => handleDelete(customer.pan)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default ListCustomer;
