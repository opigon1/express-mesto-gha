const jwt = require("jsonwebtoken");
const UNAUTHORIZED = require("../utils/errors/UNAUTHORIZED");
const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  console.log(req);
  if (!req.headers.cookie) {
    return next(new UNAUTHORIZED("Необходима авторизация"));
  }

  const token = req.headers.cookie;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next();
  }

  req.user = payload;

  return next();
};
