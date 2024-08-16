import React from "react";
import CustomerForm from "./CustomerForm";
import { useSelector, useDispatch } from "react-redux";
import { deleteCustomer, editCustomer } from "../features/CustomerSlice";
import "./style.css";

const ListCustomer = () => {
  const customers = useSelector((state) => state.customers?.customers || []);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteCustomer(id));
  };

  const handleEdit = (customer) => {
    dispatch(editCustomer(customer.pan, customer));
  };

  console.log("Customers:", customers);

  return (
    <div className="container">
      <h2>Customer List</h2>
      <ul className="customer-list">
        {customers.length === 0 ? (
          <p>No customers available.</p>
        ) : (
          customers.map((customer, index) => (
            <li key={index}>
              <span>
                {customer.fullName} - {customer.email}
              </span>
              <div className="customer-actions">
                <button className="edit" onClick={() => handleEdit(customer)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(customer.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ListCustomer;
