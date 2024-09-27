const express = require("express");
const testUserController = require("../controllers/testController");
const route = express.Router();

route.get("/test-user",testUserController);

module.exports = route; 