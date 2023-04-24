import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const user = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "provide a vaild email"],
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    // custom validator to check pass and passconfirn is same
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
});

// mongoose middlware to encrpt the password befor add to data base using a 'bcrypt' npm model
user.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field because we only need passconfirm to check that both password and passwordconfirm is same
  this.passwordConfirm = undefined;
  next();
});
export default mongoose.model("User", user);
