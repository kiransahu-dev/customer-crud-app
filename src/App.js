import { Provider } from "react-redux";
import "./App.css";
import CustomerForm from "./components/CustomerForm";
import ListCustomer from "./components/ListCustomer";
import { store } from "./services/store";
import { addCustomer } from "./features/CustomerSlice";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <h1>Customer CRUD Application</h1>
        <CustomerForm
          onSave={(customer) => store.dispatch(addCustomer(customer))}
        />
        <ListCustomer />
      </div>
    </Provider>
  );
}

export default App;
