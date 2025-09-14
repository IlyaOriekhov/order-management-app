import mongoose from "mongoose";

import { User } from "../db/models/User.js";
import { Product } from "../db/models/Product.js";
import { Order } from "../db/models/Order.js";

export const createOrderController = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Missing or invalid required fields" });
    }

    const user = await User.findById(userId).session(session);
    const product = await Product.findById(productId).session(session);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const totalPrice = product.price.toString() * quantity;

    if (parseFloat(user.balance.toString()) < totalPrice) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    user.balance = parseFloat(user.balance.toString()) - totalPrice;
    product.stock -= quantity;

    const order = new Order({
      userId,
      productId,
      quantity,
      totalPrice,
    });

    await user.save({ session });
    await product.save({ session });
    await order.save({ session });

    await session.commitTransaction();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);

    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  } finally {
    session.endSession();
  }
};

export const getOrdersByUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const orders = await Order.find({ userId }).populate(
      "productId",
      "name price"
    );

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve orders", error: error.message });
  }
};
