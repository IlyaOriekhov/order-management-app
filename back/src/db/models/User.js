import { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Types.Decimal128,
      default: 100.0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.balance) {
      ret.balance = ret.balance.toString();
    }
    return ret;
  },
});

export default model("User", userSchema);
