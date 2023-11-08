const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const UNAUTHORIZED = require("../errors/UNAUTHORIZED");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    required: true,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      message: "Не валидный email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
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
