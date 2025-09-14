import { Schema, model, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Types.Decimal128,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.price) {
      ret.price = ret.price.toString();
    }
    return ret;
  },
});

export default model("Product", productSchema);
