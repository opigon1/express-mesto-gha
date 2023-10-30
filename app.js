const express = require("express");
const mongoose = require("mongoose");

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

app.use((req, res, next) => {
  req.user = {
    _id: "653a32d300e6835222a87622",
  };

  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));
app.use("*", (req, res) => {
  res.status(404).send({ message: "Страница не найдена" });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
