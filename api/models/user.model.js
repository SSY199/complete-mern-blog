import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: "string",
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 50,
    },
    password: {
      type: "string",
      required: true,
      minlength: 5,
    },
    profilePicture: {
      type: "string",
      default:
        "https://cdn.pixabay.com/photo/2021/11/24/05/19/user-6820232_1280.png",
    },
    isAdmin: {
      type: "boolean",
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
