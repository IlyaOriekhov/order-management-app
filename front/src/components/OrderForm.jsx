import { useState, useEffect } from "react";

import { toast } from "react-hot-toast";

const OrderForm = ({ products, onCreateOrder, selectedUserId }) => {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (products.length > 0) {
      setProductId(products[0]._id);
    }
  }, [products]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedUserId || !productId || !quantity) {
      toast.error("Please select a user, product, and quantity.");
      return;
    }

    if (quantity <= 0) {
      toast.error("Quantity must be a positive number.");
      return;
    }

    onCreateOrder({
      userId: selectedUserId,
      productId,
      quantity,
    });

    setQuantity(1);
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      <h2>Create New Order</h2>

      <div className="form-group">
        <label htmlFor="product">Product</label>
        <select
          id="product"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} ({product.price}$) - Stock: {product.stock}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
        />
      </div>

      <button type="submit">Submit Order</button>
    </form>
  );
};

export default OrderForm;
