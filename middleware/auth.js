const jwt = require('jsonwebtoken');
const User = require('../models/User')

// to check for user auth to use some fetch 
exports.protect = async (req, res, next) => {
    let token;
    // check token sent with header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }
    // if no token send error
    if (!token) {
        return res.status(401).json({success: false, error: "Not Authorized"});
    }

    try {
        // verify token with jwt
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        // no user send error
        if (!user) {
            return res.status(404).json({success: false, error: "No user found with this id"});
        }
        req.user = user;

        next()
    } catch (err) {
        return res.status(401).json({success: false, error: "Not Authorized to access this route"});
    }
}