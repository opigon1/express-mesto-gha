const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getCards,
  deleteCardById,
  createCard,
  dislikeCard,
  likeCard,
} = require("../controllers/cards");
const { httpsRegex } = require("../utils/regex/httpsRegex");

router.get("/", getCards);
router.delete(
  "/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  deleteCardById
);
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().uri().regex(httpsRegex),
    }),
  }),
  createCard
);
router.put(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  likeCard
);
router.delete(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  dislikeCard
);

module.exports = router;
