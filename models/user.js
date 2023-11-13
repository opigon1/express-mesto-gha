const mongoose = require("mongoose");
const { isEmail, isURL } = require("validator");

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
    required: [true, "Обязательно."],
    select: false,
  },
});

module.exports = mongoose.model("user", userSchema);
