const jwt = require("jsonwebtoken");
const UNAUTHORIZED = require("../utils/errors/UNAUTHORIZED");

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new UNAUTHORIZED("Необходима авторизация"));
  }

  let payload;

  try {
    payload = jwt.verify(req.cookies.jwt, "JWT_SECRET");
  } catch (err) {
    return next(new UNAUTHORIZED("Необходима авторизация"));
  }

  req.user = payload;

  return next();
};
