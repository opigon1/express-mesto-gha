const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getCards,
  deleteCardById,
  createCard,
  dislikeCard,
  likeCard,
} = require("../controllers/cards");

router.get("/", getCards);
router.delete(
  "/:cardId",
  celebrate({
    body: Joi.object().keys({
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
      link: Joi.string()
        .required()
        .regex(
          /^(https?:\/\/)?([\da-z\\.-]+)\.([a-z\\.]{2,6})([\\/\w \\.-]*)*\/?$/
        ),
    }),
  }),
  createCard
);
router.put(
  "/:cardId/likes",
  celebrate({
    body: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  likeCard
);
router.delete(
  "/:cardId/likes",
  celebrate({
    body: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  dislikeCard
);

module.exports = router;
