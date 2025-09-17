import { useState } from "react";
import apiClient from "../api/axios.js";

function OrderForm({ users, products, onOrderCreated }) {
  const [formData, setFormData] = useState({
    userId: "",
    productId: "",
    quantity: 1,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.userId || !formData.productId || formData.quantity <= 0) {
      setError("Please fill all fields and enter a valid quantity.");
      return;
    }

    try {
      await apiClient.post("/orders", {
        ...formData,
        quantity: Number(formData.quantity),
      });
      setSuccess("Order created successfully!");
      onOrderCreated();
      setFormData({ userId: "", productId: "", quantity: 1 });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create order.";
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="form-group">
        <label htmlFor="userId">User</label>
        <select name="userId" value={formData.userId} onChange={handleChange}>
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="productId">Product</label>
        <select
          name="productId"
          value={formData.productId}
          onChange={handleChange}
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} - ${product.price} (Stock: {product.stock})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
        />
      </div>

      <button type="submit">Create Order</button>
    </form>
  );
}

export default OrderForm;
