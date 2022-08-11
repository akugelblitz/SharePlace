const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const config = require("../config");

const TOKEN_SEED = config.TOKEN_GEN_SECRET;

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        console.log("fsdkjfa;jfad;fkjadfak")
      throw new Error("auth failed");
    }
    // console.log(token)
    const decodedToken = jwt.verify(token, TOKEN_SEED);
    // console.log(decodedToken)
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    console.log("this is whrewkrj");
    return next(new HttpError("Authentication failed", 401));
  }
};
