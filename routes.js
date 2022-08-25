const express = require("express");
const route = express.Router();
const homeController = require("./src/controllers/homeController");
const loginController = require("./src/controllers/loginController");
const {
  checkCsrfError,
  middlewareGlobal,
} = require("./src/middlewares/middleware");

//Rotas da home page
route.get("/", homeController.index);

//rotas de login
route.get("/login/index", loginController.index);
route.post("/login/register", loginController.register);
route.post("/login/login", loginController.login);
route.get("/login/logout", loginController.logout);

module.exports = route;
