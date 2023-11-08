const jwt = require("jsonwebtoken");

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startWith("Bearer ")) {
    return res.status(UNAUTHORIZED).send({ message: "Необходима авторизация" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, "super-strong-secret");
  } catch (error) {
    return res.status(UNAUTHORIZED).send({ message: "Необходима авторизация" });
  }

  req.user = payload;
  next();
};
