"use strict"
const JWT = require("jsonwebtoken");

/**
 * @desc     Auth middleware
 */
module.exports = (req, res, next) => {
    const token = req.header("x-auth-token");

    if (!token)
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
  
    try {
      const decoded = JWT.verify(token, process.env.JWT_PRIVIAT_KEY);
 
      req.user = decoded;
      next();
    } catch (ex) {
      res.status(400).json({
        message: "Invalid token",
      });
    }
  };
  