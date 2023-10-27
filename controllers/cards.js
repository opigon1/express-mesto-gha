const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: "Карточка с указанным _id не найдена." });
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при удалении карточки.",
        });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: { likes: req.user._id },
  })
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: "Передан несуществующий _id карточки." });
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: " Переданы некорректные данные для постановки/снятии лайка.",
        });
      } else {
        return res.status(500).send({ message: "Error!" });
      }
    });

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
      .then((card) => {
        if (!card) {
          return res
            .status(404)
            .send({ message: "Передан несуществующий _id карточки." });
        } else {
          res.status(200).send({ data: card });
        }
      })
      .catch((err) => {
        if (err.name === "CastError") {
          return res.status(400).send({
            message:
              " Переданы некорректные данные для постановки/снятии лайка.",
          });
        } else {
          return res.status(500).send({ message: "Error!" });
        }
      })
  );
