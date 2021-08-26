"use strict"
const helmet = require("helmet");
const compression = require("compression");
/**
 * @desc     Use helmet and compression 
 */
module.exports = (app) => {
    app.use(helmet);
    app.use(compression);
  };