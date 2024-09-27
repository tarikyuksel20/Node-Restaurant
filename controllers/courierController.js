const courierModel = require("../models/courierModel");
const restaurantModel = require("../models/restaurantModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");

const courier_register_controller = async (req, res) => {
    try{
        const {courier_name, courier_email, courier_password, courier_phone} = req.body
        if(!courier_name){
            return res.status(400).json({
                status:"Fail",
                message:"Name can no be empty"
            })
        }
        if(!courier_email){
            return res.status(400).json({
                status:"Fail",
                message:"email can no be empty"
            })
        }
        if(!courier_password){
            return res.status(400).json({
                status:"Fail",
                message:"password can no be empty"
            })
        }
        if(!courier_phone){
            return res.status(400).json({
                status:"Fail",
                message:"phone can no be empty"
            })
        }
        const exist = await courierModel.findOne({courier_email});
        if(exist){
            return res.status(400).json({
                status:"Fail",
                message:"This email is already taken"
            })
        }
        const last_courier = await courierModel.findOne().sort({id:-1});
        let newId;
        if (last_courier && !isNaN(last_courier.id)) {
            newId = last_courier.id + 1;
        } else {
            newId = 0;}
                // Hash the password
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = await bcrypt.hash(courier_password, salt);
        
                // Create new user
                const courier = await courierModel.create({
                    courier_id: newId,
                    courier_name,
                    courier_email,
                    courier_password: hashedPassword,
                    courier_phone
                });
        
                // Generate a token (assuming you want to include this in the response)
                const token = JWT.sign({ courier_id: courier.courier_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
                if (courier) {
                    return res.status(201).json({
                        status: "Success",
                        message: "User has been created",
                        data: {
                            token,
                            courier
                        }
                    });
                }
    }catch(err){
        return res.status(500).json({
            status:"Fail",
            message:err.message
        })
    }
}

const courier_login_controller = async (req, res) => {
    try {
      const { courier_email, courier_password } = req.body;
  
      // Check for missing email or password
      if (!courier_email) {
        return res.status(400).json({
          status: "Fail",
          message: "Email cannot be empty"
        });
      }
      if (!courier_password) {
        return res.status(400).json({
          status: "Fail",
          message: "Password cannot be empty"
        });
      }
  
      // Find the courier by email (not courier_id)
      const courier = await courierModel.findOne({ courier_email });
      if (!courier) {
        return res.status(404).json({
          status: "Fail",
          message: "This email cannot be found"
        });
      }
  
      // Compare provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(courier_password, courier.courier_password);
      if (!isMatch) {
        return res.status(401).json({
          status: "Fail",
          message: "Password is incorrect"
        });
      }
  
      // Generate a JWT token using the courier's id
      const token = JWT.sign({ courier_id: courier._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });
  
      // Send response with token and courier data
      res.status(200).json({
        status: "Success",
        message: "Login Successful",
        token,
        courier
      });
    } catch (err) {
      return res.status(400).json({
        status: "Fail",
        message: err.message
      });
    }
  };

  const get_one_courier = async (req, res) => {
    try {
      const { courierId } = req.params;
  
      // Find the courier and populate the choose_restaurant field
      const exist = await courierModel.findOne({ courier_id: courierId }).populate('choose_restaurant');
  
      if (!exist) {
        return res.status(404).json({
          status: "Fail",
          message: "Courier could not be found"
        });
      }
  
      return res.status(200).json({
        status: "Success",
        message: exist // The populated courier object
      });
      
    } catch (err) {
      return res.status(400).json({
        status: "Fail",
        message: err.message
      });
    }
  };
    
const choose_restaurant_controller = async (req, res) => {
    try {
      const { courierId, restaurantId } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(courierId) || !mongoose.Types.ObjectId.isValid(restaurantId)) {
        return res.status(400).json({
          status: "Fail",
          message: "Invalid courierId or restaurantId format."
        });
      }
  
      // Find the courier by their ID
      const courier = await courierModel.findById(courierId);
      if (!courier) {
        return res.status(404).json({
          status: "Fail",
          message: "Courier not found."
        });
      }
  
      // Check if the restaurant exists
      const restaurant = await restaurantModel.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({
          status: "Fail",
          message: "Restaurant not found."
        });
      }
  
      // Add the restaurant to the courier's choose_restaurant field if not already added
      if (!courier.choose_restaurant.includes(restaurantId)) {
        courier.choose_restaurant.push(restaurantId);
        await courier.save();
      }
  
      return res.status(200).json({
        status: "Success",
        message: "Restaurant chosen successfully.",
        courier
      });
  
    } catch (err) {
      return res.status(500).json({
        status: "Fail",
        message: err.message
      });
    }
  };
  
module.exports = {courier_register_controller,courier_login_controller,choose_restaurant_controller,get_one_courier};