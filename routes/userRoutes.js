const express = require("express");
const {getUserController, getOneUserController, updateUserController, resetUserPasswordController, deleteUserByIdController, addReviewController, updaterateRestaurantController, giveOrderController} = require("../controllers/userController");
//const addRatingController = require("../controllers/restaurantController")
const authMiddleWare = require("../middlewares/authMiddleWare");
const router = express.Router();
const authenticateToken = require("../middlewares/denememiddleware");

router.get("/getUser",getUserController);
router.get("/getOneUser/:id",getOneUserController);
router.put("/updateUser/:id", updateUserController);
router.put("/resetPassword", resetUserPasswordController);
router.delete("/deleteUser/:id",deleteUserByIdController);
router.post("/rateRestaurant",addReviewController);
router.patch("/updaterateRestaurant", updaterateRestaurantController);
router.post("/giveOrder",giveOrderController);

module.exports = router;