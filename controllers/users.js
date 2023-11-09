const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const BAD_REQUEST = require("../errors/BAD_REQUEST");
const NOT_FOUND = require("../errors/NOT_FOUND");
const CONFLICT = require("../errors/CONFLICT");
const UNAUTHORIZED = require("../errors/UNAUTHORIZED");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

// module.exports.getUserinfo = (req, res) => {
//   debugger;
//   User.findById(req.user._id)
//     .orFail(() => {
//       const error = new Error("Пользователь по заданному id отсутствует");
//       error.statusCode = 404;
//       throw error;
//     })
//     .then((user) => res.send({ data: user }))
//     .catch((err) => {
//       if (err.statusCode === 404) {
//         res.status(err.statusCode).send({ message: err.message });
//       } else if (err.kind === "ObjectId") {
//         res.status(400).send({ message: "Неверный формат id" });
//       } else {
//         res.status(500).send({ message: "Error!" });
//       }
//     });
// };

module.exports.getUserinfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send({ data: user }))
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
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))

    .then((user) =>
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      })
    )
    .catch((err) => {
      if (err.code == 11000) {
        next(new CONFLICT("Такой пользователь уже существует"));
      }
      if (err.name === "ValidationError") {
        next(
          new BAD_REQUEST(
            "Переданы некорректные данные при создании пользователя"
          )
        );
      } else {
        next(err);
      }
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
  // signin
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          next(new UNAUTHORIZED("Передан неккоректный пароль"));
        }
        const token = jwt.sign({ _id: user._id }, "test", { expiresIn: "7d" });
        res
          .cookie("jwt", token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 3600000 * 24 * 7,
          })
          .status(200)
          .send({
            message: "Аутентификация прошла успешно",
          });
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST("Поле email или password не должны быть пустыми"));
      } else {
        next(new UNAUTHORIZED("Передан неккоректный email"));
      }
      next(err);
    });
};
