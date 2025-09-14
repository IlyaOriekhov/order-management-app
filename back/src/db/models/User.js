import { Schema, model } from "mongoose";

const userSchema = new Schema({
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
    type: Schema.Types.Decimal128,
    default: 100.0,
  },
});

export const User = model("User", userSchema);
