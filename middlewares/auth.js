const jwt = require("jsonwebtoken");
const UNAUTHORIZED = require("../errors/UNAUTHORIZED");

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startWith("Bearer ")) {
    throw new UNAUTHORIZED("Необходима авторизация");
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, "super-strong-secret");
  } catch (error) {
    throw new UNAUTHORIZED("Необходима авторизация");
  }

  req.user = payload;
  next();
};
