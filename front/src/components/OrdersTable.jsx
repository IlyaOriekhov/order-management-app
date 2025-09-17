function OrdersTable({ orders }) {
  if (orders.lengh === 0) {
    return <p>No orders found for this user.</p>;
  }

  return (
    <table className="orders-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Total Price</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order._id}>
            <td>{order._id}</td>
            <td>{order.productId?.name || "N/A"}</td>
            <td>{order.quantity}</td>
            <td>${order.totalPrice}</td>
            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrdersTable;
