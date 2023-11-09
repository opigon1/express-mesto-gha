const Card = require("../models/card");
const UNAUTHORIZED = require("../errors/UNAUTHORIZED");
const BAD_REQUEST = require("../errors/BAD_REQUEST");
const NOT_FOUND = require("../errors/NOT_FOUND");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new UNAUTHORIZED("На сервере произошла ошибка");
      } else {
        Card.findByIdAndDelete(req.params.cardId).then(() => {
          res.status(200).send(card);
        });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BAD_REQUEST(
          "Переданы некорректные данные при удалении карточки."
        );
      } else {
        next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST("Переданы некорректные данные"));
      }
      next(err);
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
        next(err);
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
        next(err);
      }
    });
};
