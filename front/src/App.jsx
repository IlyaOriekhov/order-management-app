import { useState, useEffect } from "react";
import apiClient from "./api/axios.js";

import OrderForm from "./components/OrderForm.jsx";
import OrdersTable from "./components/OrdersTable.jsx";

import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const [usersResponse, productsResponse] = await Promise.all([
          apiClient.get("/users"),
          apiClient.get("/products"),
        ]);
        setUsers(usersResponse.data);
        setProducts(productsResponse.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch initial data. Make sure the API is running.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      setOrders([]);
      return;
    }
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/orders/${selectedUser}`);
        setOrders(response.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch orders.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [selectedUser]);

  const handleOrderCreated = () => {
    if (selectedUser) {
      apiClient.get(`/orders/${selectedUser}`).then((response) => {
        setOrders(response.data);
      });
    }
  };

  return (
    <div className="container">
      <h1>Order Management</h1>
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}

      <div className="user-selector">
        <label htmlFor="user">Select User to see orders:</label>
        <select
          id="user"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-- Select a User --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="main-content">
        <div className="form-container">
          <h2>Create New Order</h2>
          <OrderForm
            users={users}
            products={products}
            onOrderCreated={handleOrderCreated}
          />
        </div>
        <div className="table-container">
          <h2>User's Orders</h2>
          <OrdersTable orders={orders} />
        </div>
      </div>
    </div>
  );
}

export default App;
