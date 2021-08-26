"use strict";
const router = require("express").Router();
const userController = require("../controllers/user");
const auth = require("../middleware/auth");

// Login
router.post("/login", userController.login);

// Register
router.post("/signup", userController.signup);

// update user account password
router.patch("/account/password", auth, userController.updatePassword);

//  Forgot Password
router.post("/account/recover", userController.recover);
router.post("/account/token/check", userController.checkToken);
router.post("/account/password/reset", userController.resetPassword);

module.exports = router;
