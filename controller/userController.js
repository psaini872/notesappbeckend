import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const signup = async (req, res) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  // Sending token as cookies
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);

  res.status(201).json({ status: "Succes", data: { User: newUser } });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next("Please provide email and password!", 400);
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password"); // we have manully select the password becaue we select false in scheam

  if (!user || !(await correctPassword(password, user.password))) {
    return next("Incorrect email or password", 401);
  }

  // 3) If everything ok, send token to client
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  // Sending token as cookies
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);

  res.status(201).json({ status: "Succes", data: { User: user } });
};

// logot and sending empty cookies

const logout = async (req, res) => {
  res.cookie("jwt", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(200).json({ msg: "user logged out!" });
};

//  this is middelware which check that the request has vail token to access proted route now put this
// MW on those which you want to protect

const protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  const token = req.cookies.jwt;
  console.log(token);

  if (!token) {
    return next("You are not logged in! Please log in to get access.", 401);
  }

  // 2) Verification token ... verify is async function which give us promise which is awit
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next("The user belonging to this token does no longer exist.", 401);
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  console.log(currentUser);
  req.user = currentUser; // this puting extra information might be usefull in futrue
  // console.log(req.user);
  next();
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  res.status(200).json({ user });
};

export { signup, login, protect, logout, getCurrentUser };
