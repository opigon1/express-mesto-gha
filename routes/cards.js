const router = require("express").Router();
const {
  getCards,
  deleteCardById,
  createCard,
  dislikeCard,
  likeCard,
} = require("../controllers/cards");

router.get("/", getCards);
router.delete("/:cardId", deleteCardById);
router.post("/", createCard);
router.put("/:cardId/likes", likeCard);
router.delete("/:cardId/likes", dislikeCard);

module.exports = router;
