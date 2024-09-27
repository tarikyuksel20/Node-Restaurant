const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const { token } = require("morgan");

const registerController = async (req, res) => {
    try {
        const { userName, email, password, phone, address } = req.body;
        if (!userName) {
            return res.status(400).json({
                status: "Fail",
                message: "Name cannot be empty"
            });
        }
        if (!email) {
            return res.status(400).json({
                status: "Fail",
                message: "Email cannot be empty"
            });
        }
        if (!password) {
            return res.status(400).json({
                status: "Fail",
                message: "Password cannot be empty"
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                status: "Fail",
                message: "Password cannot be shorter than 6 digits"
            });
        }
        if (!phone) {
            return res.status(400).json({
                status: "Fail",
                message: "Phone cannot be empty"
            });
        }

        const existing = await userModel.findOne({ email });
        if (existing) {
            return res.status(400).json({
                status: "Fail",
                message: "Email is already in use"
            });
        }
        //karmaşık
        // Find the highest existing ID and increment by 1
        /*const lastUser = await userModel.findOne().sort({ id: -1 });
        const newId = (lastUser && !isNaN(lastUser.id)) ? lastUser.id + 1 : 0;*/
        const lastUser = await userModel.findOne().sort({ id: -1 });

        let newId;
        if (lastUser && !isNaN(lastUser.id)) {
            newId = lastUser.id + 1;
        } else {
            newId = 0;}

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await userModel.create({
            id: newId,
            userName,
            email,
            password: hashedPassword,
            address,
            phone
        });

        // Generate a token (assuming you want to include this in the response)
        const token = JWT.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        if (user) {
            return res.status(201).json({
                status: "Success",
                message: "User has been created",
                data: {
                    token,
                    user
                }
            });
        }

    } catch (err) {
        return res.status(500).json({
            status: "Fail",
            message: err.message
        });
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(500).json({
                status: "Fail",
                message: "Email cannot be empty"
            });
        }
        if (!password) {
            return res.status(500).json({
                status: "Fail",
                message: "Password cannot be empty"
            });
        }

        const user = await userModel.findOne({ email: email,});
        if (!user) {
            return res.status(404).json({
                status: "Fail",
                message: "Email is incorrect"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password );
        if (!isMatch) {
            return res.status(401).json({
                status: "Fail",
                message: "Password is incorrect"
            });
        }
        const token = JWT.sign({id:user._id}, process.env.JWT_SECRET,{
            expiresIn:'7d'
        })
        res.status(200).json({
            status: "Success",
            message: "Login Successful",
            token,
            user
        });

    } catch (err) {
        return res.status(500).json({
            status: "Fail",
            message: err.message
        });
    }
};


module.exports = {registerController, loginController};