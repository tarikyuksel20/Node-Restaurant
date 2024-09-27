const express = require("express");
const {createResturantController,getRestaurantController, deleteRestaurantController,updateRestaurantController} = require("../controllers/restaurantController");
const router = express.Router();


router.get("/get/:id",getRestaurantController)
router.post("/create",createResturantController)
router.put("/updaterestaurant/:id",updateRestaurantController);
router.delete("/deleterestaurant/:id",deleteRestaurantController)


module.exports = router;