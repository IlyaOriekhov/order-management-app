import { useState, useEffect, useCallback } from "react";
import apiClient from "./api/axios.js";

import OrderForm from "./components/OrderForm.jsx";
import OrdersTable from "./components/OrdersTable.jsx";

import "./App.css";

import { Toaster, toast } from "react-hot-toast";

function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [usersResponse, productsResponse] = await Promise.all([
        apiClient.get("/users"),
        apiClient.get("/products"),
      ]);
      setUsers(usersResponse.data);
      setProducts(productsResponse.data);
      if (usersResponse.data.length > 0) {
        setSelectedUserId(usersResponse.data[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      toast.error("Could not load initial data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const response = await apiClient.get(`/orders/${userId}`);
      setOrders(response.data);
    } catch (error) {
      console.error(`Failed to fetch orders for user ${userId}:`, error);
      toast.error("Could not load orders.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedUserId) {
        fetchOrders(selectedUserId);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [selectedUserId, fetchOrders]);

  const handleCreateOrder = async (orderData) => {
    try {
      await apiClient.post("/orders", orderData);
      toast.success("Order created successfully!");
      fetchOrders(selectedUserId);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Toaster position="top-right" reverseOrder={false} />

      <h1>Order Management</h1>

      <div className="user-selector">
        <label htmlFor="user-select">Select User:</label>
        <select
          id="user-select"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.balance}$)
            </option>
          ))}
        </select>
      </div>

      <div className="main-content">
        <div className="form-container">
          <OrderForm
            users={users}
            products={products}
            onCreateOrder={handleCreateOrder}
            selectedUserId={selectedUserId}
          />
        </div>
        <div className="table-container">
          <OrdersTable orders={orders} />
        </div>
      </div>
    </div>
  );
}

export default App;
