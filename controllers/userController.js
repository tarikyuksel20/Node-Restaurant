const userModel = require("../models/userModel");
const RestaurantModel = require("../models/restaurantModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

//Get User
const getUserController = async (req, res) =>{
    try {
        const users = await userModel.find(); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            status:"Fail",
            message:error.message
        })
    }
}
const getOneUserController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                status: "Fail",
                message: "Wrong format"
            });
        }

        const user = await userModel.findOne({ id: Number(id) });

        if (!user) {
            return res.status(404).json({
                status: "Fail",
                message: "User not found"
            });
        }

        res.status(200).json(user); // Respond with the user data
    } catch (error) {
        res.status(500).json({
            status: "Fail",
            message: error.message
        });
    }
};
const updateUserController = async (req, res) => {
    try {
        const { id } = req.params; // Extract ID from request parameters

        // Validate ID format
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                status: "Fail",
                message: "Invalid ID format"
            });
        }

        // Convert ID to number
        const numericId = Number(id);

        // Find the user by ID
        const user = await userModel.findOne({ id: numericId });

        if (!user) {
            return res.status(404).json({
                status: "Fail",
                message: "User not found"
            });
        }

        // Extract fields to update
        const { userName, address, phone } = req.body;

        // Validate fields only if they are provided
        if (userName !== undefined && userName.trim() === '') {
            return res.status(400).json({
                status: "Fail",
                message: "Name cannot be empty"
            });
        }
        if (address !== undefined && Array.isArray(address) && address.length === 0) {
            return res.status(400).json({
                status: "Fail",
                message: "Address cannot be empty"
            });
        }
        if (phone !== undefined && phone.trim() === '') {
            return res.status(400).json({
                status: "Fail",
                message: "Phone cannot be empty"
            });
        }

        // Update fields if provided
        if (userName !== undefined) user.userName = userName;
        if (address !== undefined) user.address = address;
        if (phone !== undefined) user.phone = phone;

        // Save updated user
        await user.save();

        res.status(200).json({
            status: "Success",
            message: "Update successful",
            user
        });
    } catch (err) {
        res.status(500).json({
            status: "Fail",
            message: err.message
        });
    }
};
const resetUserPasswordController = async (req, res) => {
    try {
        const { email, id, newPassword } = req.body;

        // Validate email, id, and newPassword presence
        if (!email) {
            return res.status(400).json({
                status: "Fail",
                message: "Email cannot be empty"
            });
        }
        if (!id) {
            return res.status(400).json({
                status: "Fail",
                message: "ID cannot be empty"
            });
        }
        // Check if user exists by email
        const userByEmail = await userModel.findOne({ email });

        if (!userByEmail) {
            return res.status(404).json({
                status: "Fail",
                message: "User with this email not found"
            });
        }

        // Check if user exists by ID
        const userById = await userModel.findOne({ id });

        if (!userById) {
            return res.status(404).json({
                status: "Fail",
                message: "User with this ID not found"
            });
        }

        // Ensure that the user with both email and ID exists
        if (userByEmail.id !== userById.id) {
            return res.status(404).json({
                status: "Fail",
                message: "User with this email and ID does not match"
            });
        }
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                status: "Fail",
                message: "New password must be at least 6 characters long"
            });
        }

        // Hash the new password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user with the new password
        userByEmail.password = hashedPassword;
        await userByEmail.save();

        res.status(200).json({
            status: "Success",
            message: "Password reset successfully"
        });

    } catch (err) {
        return res.status(500).json({
            status: "Fail",
            message: err.message
        });
    }
};
const deleteUserByIdController = async (req, res) => {
    try {
        const { id } = req.params; // Extract ID from request parameters

        // Validate ID format if needed (e.g., ensure it's a valid number)
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                status: "Fail",
                message: "Wrong format"
            });
        }

        // Find the user by ID
        const user = await userModel.findOne({ id: Number(id) });

        if (!user) {
            return res.status(404).json({
                status: "Fail",
                message: "User not found"
            });
        }

        // Delete the user by ID
        const result = await userModel.deleteOne({ id: Number(id) });

        // Check if the deletion was successful
        if (result.deletedCount === 0) {
            return res.status(500).json({
                status: "Fail",
                message: "Deletion failed"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Deletion successful"
        });

    } catch (err) {
        return res.status(500).json({
            status: "Fail",
            message: err.message
        });
    }
};
const addReviewController = async (req, res) => {
    try {
      let { restaurantId, userId, rating, comment } = req.body;
  
      restaurantId = String(restaurantId);
      userId = String(userId);
  
      if (!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          status: "Fail",
          message: "Invalid restaurantId or userId format."
        });
      }
  
      if (!rating || rating > 5 || rating < 0) {
        return res.status(400).json({
          status: "Fail",
          message: "Invalid rating. Rating must be between 0 and 5."
        });
      }
  
      // Check if user and restaurant exist
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: "Fail",
          message: "User not found."
        });
      }
  
      const restaurant = await RestaurantModel.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({
          status: "Fail",
          message: "Restaurant not found."
        });
      }
  
      // Check if the user has already reviewed the restaurant
      const existingReview = user.reviews.find(
        (review) => review.restaurantId.toString() === restaurantId
      );
  
      if (existingReview) {
        return res.status(400).json({
          status: "Fail",
          message: "User has already reviewed this restaurant."
        });
      }
  
      // Add review to user's reviews
      user.reviews.push({
        restaurantId, // No need to convert to ObjectId here
        rating,
        comment
      });
  
      restaurant.reviews.push({
        userId, // No need to convert to ObjectId here
        rating,
        comment
      });
  
      // Save the updated user and restaurant
      await user.save();
      await restaurant.save();
  
      res.status(200).json({
        status: "Success",
        message: "Rating and comment added successfully.",
      });
  
    } catch (error) {
      res.status(500).json({
        status: "Fail",
        message: error.message
      });
    }
  };
const updaterateRestaurantController = async (req, res) => {
    try {
      let { restaurantId, userId, rating, comment } = req.body;
  
      // Convert IDs to strings if they are not already
      restaurantId = String(restaurantId);
      userId = String(userId);
  
      // Validate input
      if (!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          status: "Fail",
          message: "Invalid restaurantId or userId format."
        });
      }
  
      if (rating === undefined || rating > 5 || rating < 0) {
        return res.status(400).json({
          status: "Fail",
          message: "Invalid rating. Rating must be between 0 and 5."
        });
      }
  
      // Update the user's review
      const updatedUser = await userModel.findOneAndUpdate(
        { _id: userId, "reviews.restaurantId": restaurantId }, // Locate the specific review
        {
          $set: {
            "reviews.$.rating": rating,
            "reviews.$.comment": comment
          }
        },
        { new: true, runValidators: true } // Return the updated document and run validators
      );
  
      if (!updatedUser) {
        return res.status(404).json({
          status: "Fail",
          message: "Review not found for this restaurant by the user."
        });
      }
  
      // Update the restaurant's review
      const updatedRestaurant = await RestaurantModel.findOneAndUpdate(
        { _id: restaurantId, "reviews.userId": userId }, // Locate the specific review
        {
          $set: {
            "reviews.$.rating": rating,
            "reviews.$.comment": comment
          }
        },
        { new: true, runValidators: true } // Return the updated document and run validators
      );
  
      if (!updatedRestaurant) {
        return res.status(404).json({
          status: "Fail",
          message: "Review not found for this user in the restaurant."
        });
      }
  
      res.status(200).json({
        status: "Success",
        message: "Review updated successfully.",
      });
  
    } catch (error) {
      res.status(500).json({
        status: "Fail",
        message: error.message
      });
    }
  };  
const giveOrderController = async (req, res) => {
    try {
      let { restaurantId, userId, food } = req.body; // food is an array of items with quantity
      restaurantId = String(restaurantId);
      userId = String(userId);
  
      // Validate restaurantId and userId format
      if (!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          status: "Fail",
          message: "Invalid restaurantId or userId format.",
        });
      }
  
      // Check if the restaurant exists
      const restaurant = await RestaurantModel.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({
          status: "Fail",
          message: "Restaurant not found.",
        });
      }
  
      // Check if the user exists
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: "Fail",
          message: "User not found.",
        });
      }
  
      // Validate if the food items exist in the restaurant
      const orderedItems = food.map(item => item.foodname);
      const availableFoods = restaurant.foods.filter(foodItem => orderedItems.includes(foodItem));
  
      if (availableFoods.length !== orderedItems.length) {
        return res.status(400).json({
          status: "Fail",
          message: "Some items in the order are not available in the restaurant.",
        });
      }
  
      // Create the order in both user and restaurant
      const order = {
        restaurantId: restaurant._id,
        items: food,
        status: "Pending",
        createdAt: new Date(),
      };
  
      // Update user orders
      user.orders.push(order);
      await user.save();
  
      // Update restaurant orders
      const restaurantOrder = {
        userId: user._id,
        items: food,
        status: "Pending",
        createdAt: new Date(),
      };
      restaurant.orders.push(restaurantOrder);
      await restaurant.save();
  
      return res.status(200).json({
        status: "Success",
        message: "Order placed successfully.",
        order,
      });
    } catch (error) {
      return res.status(500).json({
        status: "Fail",
        message: error.message,
      });
    }
  };

module.exports = {getUserController, getOneUserController, updateUserController, resetUserPasswordController, deleteUserByIdController, addReviewController, updaterateRestaurantController, giveOrderController};