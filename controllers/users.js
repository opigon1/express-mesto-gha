const User = require("../models/user");
const {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
} = require("../errors/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "Пользователь не найден" });
      } else {
        res.status(OK).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        res.status(BAD_REQUEST).send({ message: "Неверный формат ID" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "Ошибка на сервере" });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findOneAndUpdate(
    { _id: req.user._id },
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: "Пользователь с указанным _id не найден." });
      } else {
        res.status(OK).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при обновлении пользователя",
        });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: "Пользователь с указанным _id не найден." });
      } else {
        res.status(OK).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};
