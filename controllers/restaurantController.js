const restaurantModel = require("../models/restaurantModel");
const courierModel = require("../models/courierModel");



const getRestaurantController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        status: "Fail",
        message: "Wrong format"
      });
    }

    // Populate the courier information
    const restaurant = await restaurantModel.findOne({ id: Number(id) }).populate('courier');

    if (!restaurant) {
      return res.status(404).json({
        status: "Fail",
        message: "Restaurant not found"
      });
    }

    return res.status(200).json({
      status: "Success",
      restaurant
    });
  } catch (err) {
    return res.status(500).json({
      status: "Fail",
      message: err.message
    });
  }
};


const createResturantController = async (req, res) => {
    try {
      const { title, foods, pickup, delivery, isOpen, rating } = req.body;

      // Validation
      if (!title) {
        return res.status(400).json({
          success: "Fail",
          message: "Title cannot be empty",
        });
      }

      if (!Array.isArray(foods) || foods.length === 0 || foods.some(food => !food.trim())) {
        return res.status(400).json({
          success: "Fail",
          message: "Foods cannot be empty and must contain valid entries",
        });
      }

      // Check if the title already exists in the database
      const existing = await restaurantModel.findOne({ title });
      if (existing) {
        return res.status(400).json({
          success: "Fail",
          message: "This title is already taken",
        });
      }

      const lastRestaurant = await restaurantModel.findOne().sort({ id: -1 });
      const newRestaurantId = (lastRestaurant && !isNaN(lastRestaurant.id)) ? lastRestaurant.id + 1 : 0;

      // Create new restaurant entry
      const restaurant = await restaurantModel.create({
        id:newRestaurantId,
        title,
        foods,
        pickup,
        delivery,
        isOpen,
        rating,
      });

      if (restaurant) {
        return res.status(201).json({
          success: "Success",
          message: "Restaurant has been created",
          restaurant,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in Create Restaurant API",
        error,
      });
    }
};
const updateRestaurantController = async (req, res) =>{
  try{
    const id = req.params.id;
    if(!id || isNaN(Number(id))){
      return res.status(400).json({
        status:"Fail",
        message:err.message
      })
    }
    const numericId = Number(id);
    const restaurant = restaurantModel.findOne({id:numericId});
    if(!restaurant){
      return res.status(404).json({
        status: "Fail",
        message: "Restaurant not found"
    });
    }
    const {title} = req.body;
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({
          status: "Fail",
          message: "Name cannot be empty"
      });
  }
  if (title !== undefined) restaurant.title = title;
  await restaurant.save();
  res.status(200).json({
    status: "Success",
    message: "Update successful",
    user
});
  }catch(err){
    return res.status(500).json({
      status:"Fail",
      message:err.message
    })
  }
}
const deleteRestaurantController = async (req, res) => {
  try{
    const {id} = req.params;
    if(!id){
      return res.status(500).json({
        status:"Fail",
        message:"Id can not be empty"
      })
    }
    if(isNaN(Number(id))){
      return res.status(500).json({
        status:"Fail",
        message:"Wrong format"
      })
    }
    const restaurant = await restaurantModel.findOne({id: Number(id)})
    if(!restaurant){
      return res.status(400).json({
        status:"Fail",
        message:"Can not find restaurant"
      })
    }
    const result = await restaurantModel.deleteOne({id: Number(id)})
    if(result){
      return res.status(500).json({
        status:"Success",
        message:"Restaurant has been deleted"
      })
    }
  }catch(err){
    return res.status(500).json({
      status:"Fail",
      message:err.message
    })
  } 
}


module.exports = {createResturantController,getRestaurantController, deleteRestaurantController,updateRestaurantController};