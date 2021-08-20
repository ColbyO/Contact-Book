// user model for mongodb
const User = require('../models/User')
// sanitize for mongodb entries
const sanitize = require('mongo-sanitize');

// register user to mongodb
exports.register = async (req, res, next) => {
    // get inputs from user
    const { username, email, password } = sanitize(req.body);
    try{
        // create user 
        const user = await User.create({
            username, email, password
        });
        // auth token
        sendToken(user, 201, res)
    } catch (err) {
        // error
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

// login user
exports.login = async (req, res, next) => {
    // get user inputs
    const { email, password } = sanitize(req.body);

    // if no email or password error
    if(!email || !password) {
        res.status(400).json({success: false, error: "Please provide email and password"})
    }

    try {
        // find user in database
        const user = await User.findOne({email}).select("+password")
        // if no user create error
        if(!user){
            res.status(404).json({success: false, error: "Invalid credentials"})
        }
        // match password from input & database
        const isMatch = await user.matchPasswords(password)

        // if theres no match create error
        if(!isMatch) {
           res.status(404).json({success: false, error: "Invalid credentials"}) 
        }
        // send token
        sendToken(user, 200, res)
    } catch (err) {
        // do nothing
    }
}

// JWT token for authentication
const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken()
    res.status(statusCode).json({success: true, token})
}