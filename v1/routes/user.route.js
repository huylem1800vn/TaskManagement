const express = require ("express");
const router = express.Router();

const controller = require("../controllers/user.controller");

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/password/forgot", controller.passwordForgot);

router.post("/password/otp", controller.passwordOtp);

router.post("/password/reset", controller.passwordReset);

module.exports = router;