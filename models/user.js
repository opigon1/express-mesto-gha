const mongoose = require("mongoose");
const { isEmail, isURL } = require("validator");
const bcrypt = require("bcrypt");
const UNAUTHORIZED = require("../errors/UNAUTHORIZED");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Жак-Ив Кусто",
    minlength: [2, "Username must be at least 2 characters."],
    maxlength: [30, "Username must be less than 20 characters."],
  },
  about: {
    type: String,
    default: "Исследователь",
    minlength: [2, "Username must be at least 2 characters."],
    maxlength: [30, "Username must be less than 20 characters."],
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
    required: [true, "Your username cannot be blank."],
    validate: {
      validator: (v) => isEmail(v),
      message: "Неправильный формат почты",
    },
  },
  password: {
    type: String,
    minlength: [8, "Password must be at least 8 characters."],
    required: [true, "Your password cannot be blank."],
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
