const express = require("express");
const mongoose = require("mongoose");
const { celebrate, Joi, errors } = require("celebrate");
const { login, createUser } = require("./controllers/users");
const { auth } = require("./middlewares/auth");
const NOT_FOUND = require("./errors/NOT_FOUND");

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connect!"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`${PORT}`);
});

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(
        /^(https?:\/\/)?([\da-z\\.-]+)\.([a-z\\.]{2,6})([\\/\w \\.-]*)*\/?$/
      ),
    }),
  }),
  createUser
);
app.use(auth);
app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use("*", (req, res) => {
  throw new NOT_FOUND("Страница не найдена");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
});
