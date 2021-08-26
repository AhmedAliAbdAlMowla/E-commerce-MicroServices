"use strict"
/**
 * @desc     Not found middleware
 */
 module.exports =  (req, res) => {
    res.status(404).json({
      message: "Not Found",
    });
  };