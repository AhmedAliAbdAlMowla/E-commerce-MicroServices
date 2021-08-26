"use strict"
const Joi = require("joi");

/**
 * @desc     Validate signup
 * @returns  Result after validate user
 */
module.exports.signupValidator = (user) => {
  const schema = Joi.object({

    firstName: Joi.string().max(50).min(2).required(),
    lastName: Joi.string().max(50).min(2).required(),
    email: Joi.string().max(100).min(5).email().required(),

    password: Joi.string()
      .max(30)
      .min(8)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)
      .required()
      .label("password")
      .messages({
        "string.min": "password must at least 8 characters",
        "object.regex": "password must have at least 8 characters",
        "string.pattern.base": "password must have at least 1 uppercase lowercase special character and number"
      }),

    phoneNumber: Joi.string().min(4).required(),
  });

  return schema.validate(user);
};

/**
 * @desc     Validate login
 * @returns  Result after validate user
 */
module.exports.loginValidator = (user) => {
  const schema = Joi.object({
    email: Joi.string().max(100).min(5).email().required(),
    password: Joi.string().max(15).min(8)
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      .required()
      .label("password")
      .messages({
        "string.min": "password must at least 8 characters",
        "object.regex": "password must have at least 8 characters",
        "string.pattern.base": "password must have at least 1 uppercase lowercase special character and number"
      }),
  });
  return schema.validate(user);
};

/**
 * @desc     Validate updates in user document
 * @returns  Result after validate new data
 */
module.exports.updateValidator = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().max(50).min(2),
    lastName: Joi.string().max(50).min(2),
    email: Joi.string().max(100).min(5).email(),
    password: Joi.string()
      .max(15)
      .min(8)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      .label("password")
      .messages({
        "string.min": "password must at least 8 characters",
        "object.regex": "password must have at least 8 characters",
        "string.pattern.base": "password must have at least 1 uppercase lowercase special character and number"
      }),
    phoneNumber: Joi.string().min(4),
    notificationOption:Joi.object({
      email: Joi.boolean().required(),
      sms:Joi.boolean().required()
    })
    
  });

  return schema.validate(user);
};
/**
 * @desc     Validate updates in user document
 * @returns  Result after validate new data
 * @allow    SuperAdmin
 */
module.exports.updateForSuperAdminValidator = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().max(50).min(2),
    lastName: Joi.string().max(50).min(2),
    email: Joi.string().max(100).min(5).email(),
    password: Joi.string()
      .max(15)
      .min(8)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      .label("password")
      .messages({
        "string.min": "password must at least 8 characters",
        "object.regex": "password must have at least 8 characters",
        "string.pattern.base": "password must have at least 1 uppercase lowercase special character and number"
      }),
    phoneNumber: Joi.string().min(4),
    role:Joi.string().valid("admin", "client")
    
  });

  return schema.validate(user);
};