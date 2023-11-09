const jwt = require("jsonwebtoken");
const UNAUTHORIZED = require("../errors/UNAUTHORIZED");

module.exports = (req, res, next) => {
  debugger;
  console.log(req);
  if (!req.headers.cookie) {
    return next(new UNAUTHORIZED("Необходима авторизация"));
  }

  const token = req.headers.cookie;
  const validToken = token.replace("jwt=", "");
  let payload;

  try {
    payload = jwt.verify(validToken, "test");
  } catch (err) {
    return res.send(err);
  }

  req.user = payload;

  return next();
};
