const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true
    },
    title: {
      type: String,
      required: [true, "Restaurant title is required"],
      unique: true
    },
    foods: {
      type: Array,
      required: true,
      trim: true
    },
    pickup: {
      type: Boolean,
      default: true,
    },
    delivery: {
      type: Boolean,
      default: true,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    reviews: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
      },
      comment: {
        type: String,
        trim: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    orders: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      items: [{
        foodname: String,
        quantity: {
          type: Number,
          required: true
        }
      }],
      totalAmount: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    // Reference to the courier
    courier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Courier'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
