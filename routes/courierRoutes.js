const express = require("express");
const router = express.Router();
const {courier_register_controller,courier_login_controller,choose_restaurant_controller,get_one_courier} = require("../controllers/courierController");

router.post("/courier-register",courier_register_controller);
router.post("/courier-login",courier_login_controller);
router.post("/courier-choose-restaurant",choose_restaurant_controller);
router.get("/get-one-courier/:courierId",get_one_courier);

module.exports = router;