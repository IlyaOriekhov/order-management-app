import { Schema, model, Types } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Types.Decimal128,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

orderSchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.totalPrice) {
      ret.totalPrice = ret.totalPrice.toString();
    }
    return ret;
  },
});

export default model("Order", orderSchema);
