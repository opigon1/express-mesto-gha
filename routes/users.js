const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getUserinfo,
} = require("../controllers/users");
const { httpsRegex } = require("../utils/regex/httpsRegex");

router.get("/", getUsers);
router.get("/me", getUserinfo);
router.get(
  "/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().hex().min(24).max(24),
    }),
  }),
  getUserById
);
router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().regex(httpsRegex),
    }),
  }),
  updateUserAvatar
);

module.exports = router;
