"use strict";
const {
  updateValidator,
  loginValidator,
  signupValidator,
} = require("../utils/validator/user");
const dbConnection = require("../db/connection");
const sqlQuery = require("../db/queries").queryList;
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const JWT = require("jsonwebtoken");

/**
 * @desc    Login user
 * @route   POST /api/v1/users/login
 * @access  Public
 */
exports.login = async (req, res) => {
  const { error } = loginValidator(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });
  let account = await dbConnection.query(sqlQuery.GET_DATA_FOR_LOGIN, [
    req.body.email,
  ]);

  account = account.rows[0];
  if (!account)
    return res.status(400).json({ message: "Invalid email or password." });

  const validPassword = await bcrypt.compare(
    req.body.password,
    account.password
  );
  if (!validPassword)
    return res.status(400).json({ message: "Invalid  password." });
  const token = JWT.sign(
    {
      user_id: account.user_id,
      name: account.first_name + " " + account.last_name,
      role: account.role,
    },
    process.env.JWT_PRIVIAT_KEY,
    {
      expiresIn: "20h",
    }
  );

  res.status(200).json({ message: "succes Auth", token: token });
};
/**
 * @desc    Signup user
 * @route   POST /api/v1/users/signup
 * @access  Private/admin
 */
exports.signup = async (req, res) => {
  const { error } = signupValidator(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  const email_exist = await dbConnection.query(sqlQuery.CHECK_EMAIL_IS_EXIST, [
    req.body.email,
  ]);
  if (email_exist.rows[0].count == 1)
    return res.status(400).json({ message: "User already exists." });
  // hashing password
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const accountData = [
    req.body.firstName,
    req.body.lastName,
    req.body.password,
    req.body.email,
    req.body.phoneNumber,
  ];
  //  create account
  let result = await dbConnection.query(sqlQuery.CREATE_ACCOUNT, accountData);
  result = result.rows[0];

  const token = JWT.sign(
    {
      user_id: result.user_id,
      name: result.first_name + " " + result.last_name,
      role: result.role,
    },
    process.env.JWT_PRIVIAT_KEY,
    {
      expiresIn: "20h",
    }
  );
  res.status(201).json({
    message: "Account created.",
    token,
  });
};

/**
 * @desc    Update user password
 * @route   PATCH /api/v1/users/account/password
 * @access  Private
 */
exports.updatePassword = async (req, res) => {
  // validate newPassword
  const { error } = updateValidator({ password: req.body.newPassword });

  if (error) return res.status(400).json({ message: error.details[0].message });

  let user = await dbConnection.query(sqlQuery.GET_ACCOUNT_PASSWORD, [
    req.user.user_id,
  ]);

  const oldPassword = user.rows[0].password;

  // check old password
  const validPassword = await bcrypt.compare(req.body.password, oldPassword);

  if (!validPassword)
    return res.status(401).json({ message: "Invalid  old password." });
  // hashing new password
  const salt = await bcrypt.genSalt(10);
  req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);
  await dbConnection.query(sqlQuery.UPDATE_ACCOUNT_PASSWORD, [
    req.body.newPassword,
    req.user.user_id,
  ]);
  res.status(200).json({ message: "password updated." });
};

/**
 * @desc    Recover  account
 * @route   POST /api/v1/user/account/recover
 * @access  Public
 */
exports.recover = async (req, res) => {
  const { error } = updateValidator({ email: req.body.email });
  if (error) return res.status(400).json({ error: error.details[0].message });

  let user = await dbConnection.query(sqlQuery.GET_ACCOUNT_BY_EMAIL, [
    req.body.email,
  ]);

  if (!user.rows.length)
    return res.status(401).json({
      message:
        "The email address " +
        req.body.email +
        " is not associated with any account. Double-check your email address and try again.",
    });

  //Generate and set password reset code
  const resetPasswordToken = crypto.randomBytes(3).toString("hex");
  let resetPasswordExpires = Date.now() + 1200000; //expires in an 20 minutes

  await dbConnection.query(sqlQuery.UPDATE_PASSWORD_VERIFICATION_TOKEN, [
    resetPasswordToken,
    resetPasswordExpires,
    user.rows[0].user_id,
  ]);

  //  Send mail
          /**     will connect with RabbitMQ and send message to send email using notification SERVICES */
  // const emailText = "The password reset code is : " + resetPasswordToken;
  // const emailSubject = "(PROTOQIT) Sending code to confirm change password :";
  // await Email.sendMail(emailSubject, emailText, req.body.email);

  res
    .status(200)
    .json({ message: " Send password reset code to your email is success." });
};

/**
 * @desc    Check recover token
 * @route   POST /api/v1/user/account/token/check
 * @access  Public
 */
exports.checkToken = async (req, res) => {
  const user = await dbConnection.query(sqlQuery.CHECH_TOKENT_IS_FIND, [
    req.body.token,
  ]);

  if (!user.rows.length)
    return res
      .status(401)
      .json({ message: "Password reset token is invalid or has expired." });

  const resetPasswordExpires = user.rows[0].reset_password_expires.getTime();

  if (resetPasswordExpires < Date.now())
    return res
      .status(401)
      .json({ message: "Password reset token has expired." });

  return res.status(200).json({ message: "Token auth is success." });
};
/**
 * @desc    Reset password
 * @route   POST /api/v1/user/account/password/reset
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  // validate newPassword
  const { error } = updateValidator({ password: req.body.password });

  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await dbConnection.query(sqlQuery.CHECH_TOKENT_IS_FIND, [
    req.body.token,
  ]);

  if (!user.rows.length)
    return res
      .status(401)
      .json({ message: "Password reset token is invalid or has expired." });

  const resetPasswordExpires = user.rows[0].reset_password_expires.getTime();

  if (resetPasswordExpires < Date.now())
    return res
      .status(401)
      .json({ message: "Password reset token has expired." });

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  await dbConnection.query(sqlQuery.RESET_ACCOUNT_PASSWORD, [
    req.body.password,
    req.body.token,
  ]);

  res.status(200).json({ message: "Your password has been updated." });
};
