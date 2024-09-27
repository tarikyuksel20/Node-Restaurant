const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (token == null) return res.status(401).json({ status: "Fail", message: "Token is missing" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ status: "Fail", message: "Token is invalid" });

        req.user = await User.findById(user._id); // Assuming user ID is stored in token payload
        next();
    });
};

module.exports = authenticateToken;
