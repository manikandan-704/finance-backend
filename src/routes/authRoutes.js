const express = require("express");
const { register, login } = require("../controllers/authController");
const { validate, registerSchema } = require('../middlewares/validator');

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", login);

module.exports = router;
