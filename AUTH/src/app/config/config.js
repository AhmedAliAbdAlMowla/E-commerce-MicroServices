"use strict"
module.exports = () => {
  if (!process.env.JWT_PRIVIAT_KEY) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not define. ");
  }
};