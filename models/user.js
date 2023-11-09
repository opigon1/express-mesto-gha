const mongoose = require("mongoose");
const { isEmail, isURL } = require("validator");
const bcrypt = require("bcrypt");
const UNAUTHORIZED = require("../errors/UNAUTHORIZED");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Жак-Ив Кусто",
    minlength: [2, "Минимуи 2 знака."],
    maxlength: [30, "Максимум 20 знаков."],
  },
  about: {
    type: String,
    default: "Исследователь",
    minlength: [2, "Минимуи 2 знака."],
    maxlength: [30, "Максимум 20 знаков."],
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator: (v) => isURL(v),
      message: "Неправильный формат адресса фотографии",
    },
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Обязательно."],
    validate: {
      validator: (v) => isEmail(v),
      message: "Неправильный формат почты",
    },
  },
  password: {
    type: String,
    minlength: [8, "Минимуи 8 знаков."],
    required: [true, "Обязательно."],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new UNAUTHORIZED("Не правильные email или password");
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UNAUTHORIZED("Не правильные email или password");
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
