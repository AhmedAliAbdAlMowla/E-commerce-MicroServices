"use strict"
module.exports = (app) => {
    // Routes
    app.use("/api/v1/users",require("../routes/user")); 
};
