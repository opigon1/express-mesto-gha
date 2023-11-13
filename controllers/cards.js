const Card = require("../models/card");
const UNAUTHORIZED = require("../utils/errors/UNAUTHORIZED");
const BAD_REQUEST = require("../utils/errors/BAD_REQUEST");
const NOT_FOUND = require("../utils/errors/NOT_FOUND");
const FORBIDDEN = require("../utils/errors/FORBIDDEN_ERROR");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new NOT_FOUND("Карточка не найдена"));
      }

      if (card.owner.toString() !== req.user._id) {
        return next(new FORBIDDEN("Нет доступа"));
      } else {
        Card.findByIdAndDelete(cardId).then(() => {
          res.status(200).send(card);
        });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BAD_REQUEST("Переданы некорректные данные при удалении карточки.")
        );
      } else {
        return next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BAD_REQUEST("Переданы некорректные данные"));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return next(new NOT_FOUND("Передан несуществующий _id карточки."));
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BAD_REQUEST(
            "Переданы некорректные данные для постановки/снятии лайка."
          )
        );
      } else {
        return next(err);
      }
    });

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return next(new NOT_FOUND("Передан несуществующий _id карточки."));
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BAD_REQUEST(
            "Переданы некорректные данные для постановки/снятии лайка."
          )
        );
      } else {
        return next(err);
      }
    });
};
