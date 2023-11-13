const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UNAUTHORIZED("Необходима авторизация"));
  }
  let payload;

  try {
    payload = jwt.verify(token, "JWT_SECRET");
  } catch (err) {
    return next(err);
  }

  req.user = payload;

  return next();
};
