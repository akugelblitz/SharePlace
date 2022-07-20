const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "aditya",
    email: "k@g.com",
    password: "123",
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs passed", 422));
  }
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    return next(new HttpError("email already registered", 422));
  }
  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };
  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const user = DUMMY_USERS.find((user) => user.email === email);
  if (!user || user.password !== password) {
    return next(new HttpError("invalid auth", 401));
  }
  res.status(200).json({ message: "logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
