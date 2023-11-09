const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const BAD_REQUEST = require("../errors/BAD_REQUEST");
const NOT_FOUND = require("../errors/NOT_FOUND");
const CONFLICT = require("../errors/CONFLICT");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserinfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(() => {
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND("Пользователь не найден");
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        throw new BAD_REQUEST("Неверный формат ID.");
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BAD_REQUEST("Не указан Email или пароль");
  }
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
      })
        .then((user) => {
          res.status(200).send({
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            throw new BAD_REQUEST("Ошибка при создании пользователя");
          } else next(err);
        })
    )
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findOneAndUpdate(
    { _id: req.user._id },
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND("Пользователь с указанным _id не найден.");
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BAD_REQUEST(
          "Переданы некорректные данные при обновлении пользователя"
        );
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND("Пользователь с указанным _id не найден.");
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BAD_REQUEST(
          "Переданы некорректные данные при обновлении аватара"
        );
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "super-strong-secret", {
        expiresIn: "7d",
      });

      res
        .cookie("jwt", token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .status(200)
        .send({ message: "Авторизация прошла успешно!" });
    })
    .catch((err) => {
      next(err);
    });
};
