"use strict"
// const winston = require("winston");
/**
 * @desc     error middleware
 */
module.exports =  (err, req, res, next) => {
//   winston.error(err.message, err);
console.log(err);
  res.status(500).json({
    message: err.message,
  });
};