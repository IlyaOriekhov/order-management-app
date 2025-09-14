import mongoose from "mongoose";

import User from "../db/models/User.js";
import Product from "../db/models/Product.js";
import Order from "../db/models/Order.js";

import logger from "../utils/logger.js";

export const createOrderController = async (req, res, next) => {
  const { userId, productId, quantity } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(productId)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid User or Product ID format" });
  }
  if (!quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ message: "Quantity must be a positive number" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(productId).session(session);
    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Product not found" });
    }

    const priceAsNumber = parseFloat(product.get("price").toString());
    const userBalanceAsNumber = parseFloat(user.get("balance").toString());

    const totalPrice = priceAsNumber * quantity;

    if (product.stock < quantity) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Not enough product in stock" });
    }

    if (userBalanceAsNumber < totalPrice) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.balance = (userBalanceAsNumber - totalPrice).toString();
    product.stock -= quantity;

    await user.save({ session });
    await product.save({ session });

    const order = new Order({
      userId,
      productId,
      quantity,
      totalPrice: totalPrice.toString(),
    });

    const createdOrder = await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    logger.info(`Order ${createdOrder._id} created successfully.`);
    res.status(201).json(createdOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error(`Error creating order: ${error.message}`);
    next(error);
  }
};

export const getOrdersByUserController = async (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const orders = await Order.find({ userId }).populate("productId");
    res.status(200).json(orders);
  } catch (error) {
    logger.error(`Error fetching orders for user ${userId}: ${error.message}`);
    next(error);
  }
};
