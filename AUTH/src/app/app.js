"use strict";
const express = require("express");
const app = express();
const core = require("cors");
const coreOptions = require("./config/core");
const error = require("./middleware/error");
const notfound = require("./middleware/notFound");
const logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../../authSwagger.json");

app.use(logger("dev"));
// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// core
app.use(core(coreOptions));

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// config
require("./config/config")();
// loger
require("./startup/loger")();
// Routes
require("./startup/routes")(app);



// error handler
app.use(error);
// not found handler
app.use(notfound);
// production
require("./startup/prod")(app);

module.exports = app;
