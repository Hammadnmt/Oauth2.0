import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      // Only for local users
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      required: true,
    },
    googleId: {
      type: String,
    },
    profilePhoto: {
      type: String,
    },

    // Additional info you may collect after sign-up
    phone: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      country: String,
      postalCode: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    dateOfBirth: {
      type: Date,
    },
    bio: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
