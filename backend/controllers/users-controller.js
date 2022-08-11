const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("fetching users failed", 500));
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs passed", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Signing up failed", 500));
  }

  if (existingUser) {
    return next(new HttpError("This email is already registered", 422));
  }

  let hashedPassword;
  try{
    hashedPassword = await bcrypt.hash(password, 12);
  }
  catch(err){
    const error = new HttpError("Could not generate hash, try later", 500)
    return next(error)
  }
  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError("Signup failed :(", 500));
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Log in up failed", 500));
  }

  if (!existingUser) {
    return next(new HttpError("Invalid credentials", 401));
  }

  let isValidPassword = false;
  try{
    isValidPassword = await bcrypt.compare(password, existingUser.password)
  }
  catch(err){
    return next(new HttpError("Could not log you in, try again later", 500));
  }

  if(!isValidPassword){
    return next(new HttpError("Invalid credentials", 401));
  }
  res.status(200).json({
    message: "logged in",
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
